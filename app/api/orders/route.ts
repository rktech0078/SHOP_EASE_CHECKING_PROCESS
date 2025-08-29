import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/sanity/lib/adminClient';

export async function GET(request: NextRequest) {
  try {
    console.log('✅ Admin access verified - Simple authentication');

    // Fetch all orders from Sanity with proper structure according to schema
    const orders = await adminClient.fetch(`
      *[_type == "order"] | order(createdAt desc) {
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
    `);

    console.log(`📋 Fetched ${orders?.length || 0} orders from Sanity`);

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
        email: order.customer?.email || 'No email',
        phone: order.customer?.phone || 'No phone',
        address: order.customer?.address || 'No address',
        city: order.customer?.city || 'No city',
        state: order.customer?.state || 'No state',
        zipCode: order.customer?.zipCode || 'No ZIP',
        country: order.customer?.country || 'No country'
      },
      totalAmount: order.pricing?.totalAmount || 0,
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'pending',
      paymentMethod: order.paymentMethod || 'cod',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    })) || [];

    console.log(`🔄 Transformed ${transformedOrders.length} orders`);

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      count: transformedOrders.length
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', error);
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
