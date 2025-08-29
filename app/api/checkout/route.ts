import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminClient } from '@/sanity/lib/adminClient';
import { generateOrderId } from '@/lib/utils';
import { sendOrderConfirmationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Checkout API called');
    
    // Get user session for authentication
    const session = await getServerSession();
    console.log('👤 User session:', session?.user?.email);
    
    if (!session?.user?.email) {
      console.log('❌ No user session found');
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to continue' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('📦 Request body:', body);
    
    const { 
      cartItems, 
      shippingDetails, 
      paymentMethod, 
      totalPrice, 
      subtotal, 
      tax, 
      shipping, 
      discount 
    } = body;

    // Validate required data
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.log('❌ Invalid cart items');
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    if (!shippingDetails) {
      console.log('❌ No shipping details');
      return NextResponse.json(
        { error: 'Shipping details are required' },
        { status: 400 }
      );
    }

    // Validate shipping details
    const requiredShippingFields = ['fullName', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredShippingFields) {
      if (!shippingDetails[field]) {
        console.log(`❌ Missing shipping field: ${field}`);
        return NextResponse.json(
          { error: `Missing required shipping field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate pricing data
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      console.log('❌ Invalid total price:', totalPrice);
      return NextResponse.json(
        { error: 'Invalid total price' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed, fetching user details...');

    // Fetch user details
    const user = await adminClient.fetch(`
      *[_type == "user" && email == $email][0] {
        _id,
        fullName,
        email,
        phone,
        addresses
      }
    `, { email: session.user.email });

    console.log('👤 User details:', user);

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate unique order ID
    const orderId = generateOrderId();
    console.log('🆔 Generated Order ID:', orderId);

    // Prepare order items with product references
    const orderItems = cartItems.map(item => ({
      productId: {
        _type: 'reference',
        _ref: item.product._id
      },
      product: {
        _type: 'reference',
        _ref: item.product._id
      },
      productName: item.product.name,
      productSlug: item.product.slug?.current || item.product._id,
      quantity: item.quantity,
      price: item.product.discount 
        ? item.product.price - (item.product.price * item.product.discount / 100)
        : item.product.price,
      originalPrice: item.product.price,
      discount: item.product.discount || 0,
      finalPrice: item.product.discount 
        ? item.product.price - (item.product.price * item.product.discount / 100)
        : item.product.price
    }));

    console.log('📦 Prepared order items:', orderItems);

    // Create order document
    const order = {
      _type: 'order',
      orderId,
      userId: {
        _type: 'reference',
        _ref: user._id
      },
      customer: {
        fullName: shippingDetails.fullName.trim(),
        email: shippingDetails.email.trim(),
        phone: shippingDetails.phone.trim(),
        address: shippingDetails.address.trim(),
        city: shippingDetails.city.trim(),
        state: shippingDetails.state.trim(),
        zipCode: shippingDetails.zipCode.trim(),
        country: shippingDetails.country.trim(),
        landmark: shippingDetails.landmark?.trim() || '',
        addressType: shippingDetails.addressType || 'residential'
      },
      items: orderItems,
      pricing: {
        subtotal: subtotal || 0,
        tax: tax || 0,
        shipping: shipping || 0,
        discount: discount || 0,
        totalAmount: totalPrice,
        currency: 'INR'
      },
      status: 'pending',
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending',
      shipping: {
        method: 'standard',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        shippingNotes: shippingDetails.notes || ''
      },
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          description: 'Order has been placed successfully',
          location: 'Online Store'
        }
      ],
      notes: shippingDetails.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('📋 Created order document:', order);

    // Save order to Sanity
    console.log('💾 Saving order to Sanity...');
    const result = await adminClient.create(order);
    console.log('✅ Order saved to Sanity:', result);

    // Update user's addresses array with new shipping address
    const newAddress = {
      isDefault: !user.addresses || user.addresses.length === 0,
      label: 'Home',
      fullName: shippingDetails.fullName.trim(),
      phone: shippingDetails.phone.trim(),
      street: shippingDetails.address.trim(),
      city: shippingDetails.city.trim(),
      state: shippingDetails.state.trim(),
      zipCode: shippingDetails.zipCode.trim(),
      country: shippingDetails.country.trim(),
      landmark: shippingDetails.landmark?.trim() || '',
      addressType: shippingDetails.addressType || 'residential'
    };

    // Check if address already exists
    const addressExists = user.addresses?.some((addr: { street: string; city: string; state: string; zipCode: string }) => 
      addr.street === newAddress.street &&
      addr.city === newAddress.city &&
      addr.state === newAddress.state &&
      addr.zipCode === newAddress.zipCode
    );

    if (!addressExists) {
      console.log('🏠 Adding new address to user profile...');
      const updatedAddresses = user.addresses ? [...user.addresses, newAddress] : [newAddress];
      
      // Update user's addresses
      await adminClient
        .patch(user._id)
        .set({ 
          addresses: updatedAddresses,
          updatedAt: new Date().toISOString()
        })
        .commit();
      console.log('✅ User address updated');
    } else {
      console.log('🏠 Address already exists, skipping update');
    }

    // Send order confirmation email
    console.log('📧 Sending order confirmation email...');
    try {
      const emailResult = await sendOrderConfirmationEmail(
        session.user.email,
        shippingDetails.fullName,
        {
          orderId: result.orderId,
          totalAmount: result.pricing?.totalAmount || totalPrice,
          items: orderItems,
          customer: shippingDetails,
          shipping: result.shipping,
          createdAt: result.createdAt,
          pricing: result.pricing
        }
      );
      
      if (emailResult.success) {
        console.log('✅ Order confirmation email sent:', emailResult.message);
      } else {
        console.log('⚠️ Order confirmation email failed:', emailResult.message);
        if (emailResult.error) {
          console.error('Email error details:', emailResult.error);
        }
      }
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    // Return success response
    const response = {
      success: true,
      message: 'Order placed successfully',
      order: {
        orderId: result.orderId,
        _id: result._id,
        totalAmount: result.pricing?.totalAmount || totalPrice
      }
    };
    
    console.log('🎉 Returning success response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 Checkout error:', error);
    
    // Handle specific Sanity errors
    if (error && typeof error === 'object' && 'message' in error) {
      if ((error as { message: string }).message.includes('Insufficient permissions')) {
        return NextResponse.json(
          { error: 'Database access error. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process checkout. Please try again.' },
      { status: 500 }
    );
  }
}
