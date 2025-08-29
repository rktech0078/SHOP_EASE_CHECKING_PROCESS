import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminClient } from '@/sanity/lib/adminClient';

export async function GET(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');

    // Verify the requesting user can only access their own orders
    if (userEmail !== session.user.email) {
      return NextResponse.json(
        { error: 'Forbidden - You can only access your own orders' },
        { status: 403 }
      );
    }

    console.log(`🔍 Fetching orders for user: ${userEmail}`);

    // Fetch user's orders from Sanity with consistent structure according to schema
    const orders = await adminClient.fetch(`
      *[_type == "order" && customer.email == $userEmail] | order(createdAt desc) {
        _id,
        orderId,
        items[] {
          _id,
          productId,
          product-> {
            _id,
            name,
            price,
            discount,
            images[] {
              asset-> {
                _ref
              }
            }
          },
          quantity,
          price,
          originalPrice,
          discount
        },
        customer {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
          country
        },
        pricing {
          subtotal,
          tax,
          shipping,
          discount,
          totalAmount,
          currency
        },
        status,
        paymentStatus,
        paymentMethod,
        shipping {
          method,
          trackingNumber,
          carrier,
          estimatedDelivery,
          actualDelivery
        },
        timeline[] {
          status,
          timestamp,
          description,
          location
        },
        createdAt,
        updatedAt
      }
    `, { userEmail });

    console.log(`📋 Found ${orders?.length || 0} orders for user ${userEmail}`);

    // Transform orders to match expected structure
    const transformedOrders = orders?.map((order: any) => ({
      _id: order._id,
      orderId: order.orderId,
      items: order.items?.map((item: any) => ({
        _id: item._id,
        productId: item.productId || item.product?._id,
        product: item.product,
        quantity: item.quantity,
        price: item.price || item.originalPrice || 0
      })) || [],
      customer: {
        fullName: order.customer?.fullName || 'Unknown',
        email: order.customer?.email || userEmail,
        phone: order.customer?.phone || 'No phone',
        address: order.customer?.address || 'No address',
        city: order.customer?.city || 'No city',
        state: order.customer?.state || 'No state',
        zipCode: order.customer?.zipCode || 'No ZIP',
        country: order.customer?.country || 'No country'
      },
      pricing: order.pricing || {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        totalAmount: 0,
        currency: 'INR'
      },
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'pending',
      paymentMethod: order.paymentMethod || 'cod',
      shipping: order.shipping || {
        method: 'standard',
        trackingNumber: '',
        carrier: '',
        estimatedDelivery: '',
        actualDelivery: ''
      },
      timeline: order.timeline || [],
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    })) || [];

    console.log(`🔄 Transformed ${transformedOrders.length} orders for user`);

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      count: transformedOrders.length
    });

  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
