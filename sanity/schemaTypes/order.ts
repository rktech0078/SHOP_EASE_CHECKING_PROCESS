import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Customer Information',
      type: 'object',
      fields: [
        { 
          name: 'fullName', 
          type: 'string', 
          title: 'Full Name',
          validation: (Rule) => Rule.required()
        },
        { 
          name: 'email', 
          type: 'string', 
          title: 'Email',
          validation: (Rule) => Rule.required().email()
        },
        { 
          name: 'phone', 
          type: 'string', 
          title: 'Phone',
          validation: (Rule) => Rule.required()
        },
        { 
          name: 'address', 
          type: 'string', 
          title: 'Street Address',
          validation: (Rule) => Rule.required()
        },
        { 
          name: 'city', 
          type: 'string', 
          title: 'City',
          validation: (Rule) => Rule.required()
        },
        { 
          name: 'state', 
          type: 'string', 
          title: 'State/Province',
          validation: (Rule) => Rule.required()
        },
        { 
          name: 'zipCode', 
          type: 'string', 
          title: 'ZIP/Postal Code',
          validation: (Rule) => Rule.required()
        },
        { 
          name: 'country', 
          type: 'string', 
          title: 'Country',
          validation: (Rule) => Rule.required(),
          initialValue: 'India'
        },
        { 
          name: 'landmark', 
          type: 'string', 
          title: 'Landmark (Optional)'
        },
        { 
          name: 'addressType', 
          type: 'string', 
          title: 'Address Type',
          options: {
            list: [
              { title: 'Residential', value: 'residential' },
              { title: 'Commercial', value: 'commercial' }
            ]
          },
          initialValue: 'residential'
        }
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'productId', 
              type: 'reference',
              to: [{ type: 'product' }],
              title: 'Product',
              validation: (Rule) => Rule.required()
            },
            { 
              name: 'productName', 
              type: 'string', 
              title: 'Product Name',
              validation: (Rule) => Rule.required()
            },
            { 
              name: 'quantity', 
              type: 'number', 
              title: 'Quantity',
              validation: (Rule) => Rule.required().min(1)
            },
            { 
              name: 'price', 
              type: 'number', 
              title: 'Original Price',
              validation: (Rule) => Rule.required().min(0)
            },
            { 
              name: 'discount', 
              type: 'number', 
              title: 'Discount %',
              validation: (Rule) => Rule.min(0).max(100)
            },
            { 
              name: 'finalPrice', 
              type: 'number', 
              title: 'Final Price',
              validation: (Rule) => Rule.required().min(0)
            },
            { 
              name: 'productImage', 
              type: 'image', 
              title: 'Product Image'
            },
            { 
              name: 'productSlug', 
              type: 'string', 
              title: 'Product Slug'
            }
          ],
          validation: (Rule) => Rule.required().min(1),
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'pricing',
      title: 'Order Pricing',
      type: 'object',
      fields: [
        { 
          name: 'subtotal', 
          type: 'number', 
          title: 'Subtotal',
          validation: (Rule) => Rule.required().min(0)
        },
        { 
          name: 'tax', 
          type: 'number', 
          title: 'Tax Amount',
          validation: (Rule) => Rule.required().min(0)
        },
        { 
          name: 'shipping', 
          type: 'number', 
          title: 'Shipping Cost',
          validation: (Rule) => Rule.required().min(0)
        },
        { 
          name: 'discount', 
          type: 'number', 
          title: 'Total Discount',
          validation: (Rule) => Rule.required().min(0)
        },
        { 
          name: 'totalAmount', 
          type: 'number', 
          title: 'Total Amount',
          validation: (Rule) => Rule.required().min(0)
        },
        { 
          name: 'currency', 
          type: 'string', 
          title: 'Currency',
          initialValue: 'INR'
        }
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Out for Delivery', value: 'out_for_delivery' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Returned', value: 'returned' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Credit Card', value: 'credit_card' },
          { title: 'Debit Card', value: 'debit_card' },
          { title: 'UPI', value: 'upi' },
          { title: 'Net Banking', value: 'net_banking' },
          { title: 'Cash on Delivery', value: 'cod' },
          { title: 'Bank Transfer', value: 'bank_transfer' },
          { title: 'Digital Wallet', value: 'digital_wallet' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
          { title: 'Partially Refunded', value: 'partially_refunded' },
        ],
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shipping',
      title: 'Shipping Information',
      type: 'object',
      fields: [
        { 
          name: 'method', 
          type: 'string', 
          title: 'Shipping Method',
          options: {
            list: [
              { title: 'Standard Delivery', value: 'standard' },
              { title: 'Express Delivery', value: 'express' },
              { title: 'Same Day Delivery', value: 'same_day' },
              { title: 'Next Day Delivery', value: 'next_day' },
            ]
          },
          initialValue: 'standard'
        },
        { 
          name: 'trackingNumber', 
          type: 'string', 
          title: 'Tracking Number'
        },
        { 
          name: 'carrier', 
          type: 'string', 
          title: 'Shipping Carrier'
        },
        { 
          name: 'estimatedDelivery', 
          type: 'datetime', 
          title: 'Estimated Delivery Date'
        },
        { 
          name: 'actualDelivery', 
          type: 'datetime', 
          title: 'Actual Delivery Date'
        },
        { 
          name: 'shippingNotes', 
          type: 'text', 
          title: 'Shipping Notes'
        }
      ]
    }),
    defineField({
      name: 'timeline',
      title: 'Order Timeline',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'status', 
              type: 'string', 
              title: 'Status'
            },
            { 
              name: 'timestamp', 
              type: 'datetime', 
              title: 'Timestamp'
            },
            { 
              name: 'description', 
              type: 'string', 
              title: 'Description'
            },
            { 
              name: 'location', 
              type: 'string', 
              title: 'Location (Optional)'
            }
          ]
        }
      ],
      initialValue: []
    }),
    defineField({
      name: 'notes',
      title: 'Order Notes',
      type: 'text',
    }),
    defineField({
      name: 'createdAt',
      title: 'Order Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'orderId',
      subtitle: 'customer.fullName',
      status: 'status',
      total: 'pricing.totalAmount',
      media: 'items.0.productImage',
    },
    prepare(selection) {
      const { title, subtitle, status, total } = selection
      return {
        title: title || 'Order',
        subtitle: `${subtitle} - Rs ${total} (${status})`,
        media: 'A'
      }
    },
  },
})