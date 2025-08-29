// Enhanced Email Service using Nodemailer with modern, stylish templates
import nodemailer from 'nodemailer';

// Create transporter function with proper error handling
const createTransporter = async (): Promise<nodemailer.Transporter | null> => {
  try {
    // Check if we have Gmail credentials
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Verify connection
      await transporter.verify();
      console.log('✅ Gmail SMTP connection verified');
      return transporter;
    }

    // Check if we have custom SMTP credentials
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Verify connection
      await transporter.verify();
      console.log('✅ Custom SMTP connection verified');
      return transporter;
    }

    console.log('⚠️ No SMTP credentials found, using console fallback');
    return null;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return null;
  }
};

// Modern, stylish email templates
const createOrderConfirmationTemplate = (orderData: Record<string, unknown>) => {
  const { orderId, totalAmount, items, customer, createdAt, pricing } = orderData;
  
  // Type assertions for safe access
  const safeOrderId = orderId as string;
  const safeTotalAmount = totalAmount as number;
  const safeItems = items as Array<Record<string, unknown>>;
  const safeCustomer = customer as Record<string, unknown>;
  const safeCreatedAt = createdAt as string;
  const safePricing = pricing as Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  safeOrderId;
  safeItems;
  safePricing;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ShopEase</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          line-height: 1.6;
        }
        .email-container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        .success-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }
        .header h1 { 
          color: #ffffff; 
          font-size: 32px; 
          font-weight: 700; 
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        .header p { 
          color: #e2e8f0; 
          font-size: 18px;
          position: relative;
          z-index: 1;
        }
        .content { 
          padding: 40px 30px; 
          background: #ffffff;
        }
        .order-card { 
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 16px; 
          padding: 30px; 
          margin: 30px 0;
          border: 1px solid #e2e8f0;
          position: relative;
        }
        .order-id { 
          font-size: 28px; 
          font-weight: 800; 
          color: #1e293b; 
          margin-bottom: 20px;
          text-align: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .order-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 20px; 
          margin: 25px 0; 
        }
        .detail-item { 
          background: #ffffff; 
          padding: 20px; 
          border-radius: 12px; 
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .detail-label { 
          font-size: 12px; 
          color: #64748b; 
          text-transform: uppercase; 
          font-weight: 700; 
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
        .detail-value { 
          font-size: 16px; 
          color: #1e293b; 
          font-weight: 600; 
        }
        .items-section { 
          margin: 35px 0; 
        }
        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .item { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 18px 0; 
          border-bottom: 1px solid #f1f5f9;
        }
        .item:last-child { border-bottom: none; }
        .item-name { font-weight: 600; color: #1e293b; }
        .item-price { font-weight: 700; color: #059669; font-size: 18px; }
        .total-section { 
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 2px solid #bbf7d0; 
          border-radius: 16px; 
          padding: 30px; 
          margin: 30px 0;
          text-align: center;
        }
        .total-amount { 
          font-size: 36px; 
          font-weight: 800; 
          color: #059669; 
          margin-bottom: 10px;
        }
        .total-label { 
          color: #047857; 
          font-weight: 600;
          font-size: 18px;
        }
        .next-steps { 
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 2px solid #bfdbfe; 
          border-radius: 16px; 
          padding: 30px; 
          margin: 30px 0; 
        }
        .next-steps h3 { 
          color: #1e40af; 
          margin: 0 0 20px 0; 
          font-size: 22px;
          font-weight: 700;
        }
        .step { 
          display: flex; 
          align-items: center; 
          margin: 16px 0;
          padding: 16px;
          background: rgba(255,255,255,0.7);
          border-radius: 12px;
        }
        .step-number { 
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: #ffffff; 
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 14px; 
          font-weight: 700; 
          margin-right: 16px;
        }
        .step-text { 
          color: #1e40af; 
          font-weight: 600;
          font-size: 16px;
        }
        .footer { 
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #e2e8f0; 
          text-align: center; 
          padding: 40px 30px;
        }
        .footer h3 { 
          color: #ffffff; 
          margin: 0 0 20px 0; 
          font-size: 24px;
          font-weight: 700;
        }
        .social-links { 
          display: flex; 
          justify-content: center; 
          gap: 20px; 
          margin: 25px 0; 
        }
        .social-link { 
          color: #60a5fa; 
          text-decoration: none; 
          font-weight: 600;
          padding: 10px 20px;
          border: 2px solid #60a5fa;
          border-radius: 25px;
        }
        .contact-info { 
          font-size: 14px; 
          color: #94a3b8;
          line-height: 1.8;
        }
        .emoji { font-size: 20px; }
        @media (max-width: 600px) {
          .order-grid { grid-template-columns: 1fr; }
          .header h1 { font-size: 26px; }
          .total-amount { font-size: 30px; }
          .content { padding: 25px 20px; }
          .header { padding: 30px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <span class="success-icon">🎉</span>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. We're excited to fulfill your order!</p>
        </div>
        
        <div class="content">
          <div class="order-card">
            <div class="order-id">Order #${safeOrderId}</div>
            <div class="order-grid">
              <div class="detail-item">
                <div class="detail-label">📅 Order Date</div>
                <div class="detail-value">${new Date(safeCreatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">👤 Customer</div>
                <div class="detail-value">${safeCustomer.fullName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">📍 Shipping Address</div>
                <div class="detail-value">${safeCustomer.address}, ${safeCustomer.city}, ${safeCustomer.state} ${safeCustomer.zipCode}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">💳 Payment Method</div>
                <div class="detail-value">${(pricing as Record<string, unknown>)?.paymentMethod as string || 'Online Payment'}</div>
              </div>
            </div>
          </div>

          <div class="items-section">
            <div class="section-title">
              <span class="emoji">📦</span>
              Order Items
            </div>
            ${safeItems.map((item: Record<string, unknown>) => `
              <div class="item">
                <div class="item-name">${(item.product as Record<string, unknown>)?.name || 'Product'} × ${item.quantity}</div>
                <div class="item-price">$${(((item.product as Record<string, unknown>)?.price as number || 0) * (item.quantity as number)).toFixed(2)}</div>
              </div>
            `).join('')}
          </div>

          <div class="total-section">
            <div class="total-amount">$${safeTotalAmount.toFixed(2)}</div>
            <div class="total-label">Total Amount</div>
          </div>

          <div class="next-steps">
            <h3>🚀 What's Next?</h3>
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-text">We'll process your order within 24 hours</div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-text">You'll receive shipping confirmation with tracking</div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-text">Your order will be delivered to your doorstep</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <h3>🛍️ ShopEase</h3>
          <div class="social-links">
            <a href="#" class="social-link">Website</a>
            <a href="#" class="social-link">Support</a>
            <a href="#" class="social-link">Track Order</a>
          </div>
          <div class="contact-info">
            Need help? Contact us at support@shopease.com<br>
            © 2024 ShopEase. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Owner notification email template
const createOwnerNotificationTemplate = (orderData: Record<string, unknown>) => {
  const { orderId, totalAmount, items, customer, createdAt } = orderData;
  
  // Type assertions for safe access
  const safeOrderId = orderId as string;
  const safeTotalAmount = totalAmount as number;
  const safeItems = items as Array<Record<string, unknown>>;
  const safeCustomer = customer as Record<string, unknown>;
  const safeCreatedAt = createdAt as string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  safeOrderId;
  safeItems;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification - ShopEase</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          padding: 20px;
          line-height: 1.6;
        }
        .email-container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .notification-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }
        .header h1 { 
          color: #ffffff; 
          font-size: 32px; 
          font-weight: 700; 
          margin-bottom: 10px;
        }
        .header p { 
          color: #ffffff; 
          font-size: 18px;
          opacity: 0.9;
        }
        .content { 
          padding: 40px 30px; 
          background: #ffffff;
        }
        .alert-card { 
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #f59e0b;
          border-radius: 16px; 
          padding: 30px; 
          margin: 30px 0;
          text-align: center;
        }
        .alert-title {
          font-size: 24px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 16px;
        }
        .alert-message {
          color: #92400e;
          font-size: 16px;
          line-height: 1.6;
        }
        .order-summary { 
          background: #f8fafc;
          border-radius: 16px; 
          padding: 30px; 
          margin: 30px 0;
          border: 1px solid #e2e8f0;
        }
        .summary-title {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
          text-align: center;
        }
        .summary-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 20px; 
          margin: 25px 0; 
        }
        .summary-item { 
          background: #ffffff; 
          padding: 20px; 
          border-radius: 12px; 
          border: 1px solid #e2e8f0;
          text-align: center;
        }
        .summary-label { 
          font-size: 12px; 
          color: #64748b; 
          text-transform: uppercase; 
          font-weight: 700; 
          margin-bottom: 8px;
        }
        .summary-value { 
          font-size: 18px; 
          color: #1e293b; 
          font-weight: 700; 
        }
        .action-buttons {
          text-align: center;
          margin: 30px 0;
        }
        .action-btn {
          display: inline-block;
          background: linear-gradient(135deg, #059669, #10b981);
          color: #ffffff;
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          margin: 0 10px;
        }
        .footer { 
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #e2e8f0; 
          text-align: center; 
          padding: 40px 30px;
        }
        .footer h3 { 
          color: #ffffff; 
          margin: 0 0 20px 0; 
          font-size: 24px;
          font-weight: 700;
        }
        .contact-info { 
          font-size: 14px; 
          color: #94a3b8;
          line-height: 1.8;
        }
        @media (max-width: 600px) {
          .summary-grid { grid-template-columns: 1fr; }
          .header h1 { font-size: 26px; }
          .content { padding: 25px 20px; }
          .header { padding: 30px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <span class="notification-icon">🆕</span>
          <h1>New Order Received!</h1>
          <p>A new order has been placed on your store</p>
        </div>
        
        <div class="content">
          <div class="alert-card">
            <div class="alert-title">🚨 Action Required</div>
            <div class="alert-message">
              A new order has been placed and requires your attention. Please review the order details and take necessary action.
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-title">📋 Order Summary</div>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Order ID</div>
                <div class="summary-value">#${orderId}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Customer</div>
                <div class="summary-value">${(safeCustomer.fullName as string) || 'Unknown Customer'}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Amount</div>
                <div class="summary-value">$${(safeTotalAmount as number).toFixed(2)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Order Time</div>
                <div class="summary-value">${new Date(safeCreatedAt as string).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders" class="action-btn">
              View Order Details
            </a>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin" class="action-btn">
              Go to Admin Panel
            </a>
          </div>
        </div>

        <div class="footer">
          <h3>🛍️ ShopEase Admin</h3>
          <div class="contact-info">
            This is an automated notification from your ShopEase store<br>
            © 2024 ShopEase. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Order confirmation email
export const sendOrderConfirmationEmail = async (
  customerEmail: string,
  customerName: string,
  orderData: Record<string, unknown>
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    const transporter = await createTransporter();
    
    if (!transporter) {
      // Fallback to console logging
      console.log('📧 Order Confirmation Email (Console Fallback):');
      console.log('To:', customerEmail);
      console.log('Subject: Order Confirmation - ShopEase');
      console.log('Content:', createOrderConfirmationTemplate(orderData));
      return { success: true, message: 'Email logged to console (SMTP not configured)' };
    }

    const emailContent = createOrderConfirmationTemplate(orderData);
    
    // Send to customer
    await transporter.sendMail({
      from: `"ShopEase" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `🎉 Order Confirmed! #${orderData.orderId} - ShopEase`,
      html: emailContent
    });

    // Send notification to owner
    if (process.env.SMTP_USER) {
      const ownerNotification = createOwnerNotificationTemplate(orderData);
      await transporter.sendMail({
        from: `"ShopEase" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `🆕 New Order Received! #${orderData.orderId} - ShopEase`,
        html: ownerNotification
      });
    }

    console.log('✅ Order confirmation email sent successfully to:', customerEmail);
    return { success: true, message: 'Order confirmation email sent successfully' };
    
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error);
    return { success: false, message: 'Failed to send email', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Order status update email
export const sendOrderStatusUpdateEmail = async (
  customerEmail: string,
  customerName: string,
  orderData: Record<string, unknown>,
  newStatus: string,
  description: string
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    const transporter = await createTransporter();
    
    if (!transporter) {
      // Fallback to console logging
      console.log('📧 Order Status Update Email (Console Fallback):');
      console.log('To:', customerEmail);
      console.log('Subject: Order Status Update - ShopEase');
      return { success: true, message: 'Email logged to console (SMTP not configured)' };
    }

    await transporter.sendMail({
      from: `"ShopEase" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `📋 Order Status Updated to ${newStatus} - ShopEase`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8fafc; border-radius: 10px;">
          <h2 style="color: #1e40af;">Order Status Updated!</h2>
          <p>Your order #${orderData.orderId} status has been updated to <strong>${newStatus}</strong>.</p>
          <p><strong>Description:</strong> ${description || 'Status updated by admin'}</p>
          <p><strong>Update Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    console.log('✅ Order status update email sent successfully to:', customerEmail);
    return { success: true, message: 'Order status update email sent successfully' };
    
  } catch (error) {
    console.error('❌ Failed to send order status update email:', error);
    return { success: false, message: 'Failed to send email', error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
