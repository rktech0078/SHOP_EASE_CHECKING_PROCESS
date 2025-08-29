import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/sanity/lib/adminClient';
import { sendOrderStatusUpdateEmail } from '@/lib/emailService';

export async function PUT(request: NextRequest) {
  return handleStatusUpdate(request);
}

export async function PATCH(request: NextRequest) {
  return handleStatusUpdate(request);
}

async function handleStatusUpdate(request: NextRequest) {
  try {
    console.log('🔄 Starting order status update...');

    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const { orderId, status, description, location } = body;

    // Validate required fields
    if (!orderId || !status) {
      console.log('❌ Missing required fields:', { orderId, status });
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Looking for order with ID: ${orderId}`);

    // First, let's see what orders exist in Sanity
    const allOrders = await adminClient.fetch(`
      *[_type == "order"] {
        _id,
        orderId,
        status
      }
    `);
    
    console.log('📋 All orders in Sanity:', allOrders);

    // Try to find order by orderId
    const currentOrder = await adminClient.fetch(`
      *[_type == "order" && orderId == $orderId][0] {
        _id,
        orderId,
        status,
        customer,
        totalAmount
      }
    `, { orderId });

    if (!currentOrder) {
      console.log(`❌ Order not found by orderId: ${orderId}`);
      
      // Try to find by _id instead
      const orderById = await adminClient.fetch(`
        *[_type == "order" && _id == $orderId][0] {
          _id,
          orderId,
          status,
          customer,
          totalAmount
        }
      `, { orderId });
      
      if (orderById) {
        console.log(`✅ Found order by _id: ${orderById.orderId}`);
        return await updateOrderStatus(orderById, status, description);
      }
      
      return NextResponse.json(
        { error: 'Order not found by orderId or _id' },
        { status: 404 }
      );
    }

    console.log(`✅ Found order: ${currentOrder.orderId}`);
    return await updateOrderStatus(currentOrder, status, description);

  } catch (error) {
    console.error('❌ Error updating order status:', error);
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

async function updateOrderStatus(currentOrder: Record<string, any>, status: string, description?: string) {
  try {
    console.log('📝 Updating order with data:', { status, description });

    // Prepare update data
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };

    // Auto-update payment status when delivered
    if (status === 'delivered') {
      updateData.paymentStatus = 'paid';
      console.log('💰 Auto-updating payment status to "paid" for delivered order');
    }

    // Update the order
    const updatedOrder = await adminClient
      .patch(currentOrder._id)
      .set(updateData)
      .commit();

    console.log('✅ Order updated successfully');

    // Send email notification to customer
    try {
      if (currentOrder.customer?.email) {
        console.log(`📧 Sending email to: ${currentOrder.customer.email}`);
        
        const emailResult = await sendOrderStatusUpdateEmail(
          currentOrder.customer.email,
          currentOrder.customer.fullName || 'Customer',
          {
            orderId: currentOrder.orderId,
            totalAmount: currentOrder.totalAmount || 0,
            items: []
          },
          status,
          description || `Order status updated to ${status}`
        );
        
        if (emailResult.success) {
          console.log('✅ Status update email sent successfully');
        } else {
          console.log('⚠️ Status update email failed:', emailResult.message);
        }
      } else {
        console.log('⚠️ No customer email found, skipping email notification');
      }
    } catch (emailError) {
      console.error('❌ Email error:', emailError);
      // Don't fail the status update if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder,
      updatedStatus: status,
      paymentStatus: updateData.paymentStatus || currentOrder.paymentStatus
    });

  } catch (error) {
    console.error('❌ Error in updateOrderStatus:', error);
    throw error;
  }
}
