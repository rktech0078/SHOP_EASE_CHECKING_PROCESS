import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/lib/adminClient';

export async function GET() {
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
    const transformedOrders = orders?.map((order: Record<string, unknown>) => ({
      _id: order._id as string,
      orderId: order.orderId as string,
      items: (order.items as Array<Record<string, unknown>>)?.map((item: Record<string, unknown>) => ({
        _id: item._id as string,
        productId: (item.productId as string) || (item.product as Record<string, unknown>)?._id as string,
        product: item.product,
        quantity: item.quantity as number,
        price: (item.price as number) || (item.originalPrice as number) || 0
      })) || [],
      customer: {
        fullName: (order.customer as Record<string, unknown>)?.fullName as string || 'Unknown',
        email: (order.customer as Record<string, unknown>)?.email as string || 'No email',
        phone: (order.customer as Record<string, unknown>)?.phone as string || 'No phone',
        address: (order.customer as Record<string, unknown>)?.address as string || 'No address',
        city: (order.customer as Record<string, unknown>)?.city as string || 'No city',
        state: (order.customer as Record<string, unknown>)?.state as string || 'No state',
        zipCode: (order.customer as Record<string, unknown>)?.zipCode as string || 'No ZIP',
        country: (order.customer as Record<string, unknown>)?.country as string || 'No country'
      },
      totalAmount: (order.pricing as Record<string, unknown>)?.totalAmount as number || 0,
      status: order.status as string || 'pending',
      paymentStatus: order.paymentStatus as string || 'pending',
      paymentMethod: order.paymentMethod as string || 'cod',
      createdAt: order.createdAt as string,
      updatedAt: order.updatedAt as string
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
