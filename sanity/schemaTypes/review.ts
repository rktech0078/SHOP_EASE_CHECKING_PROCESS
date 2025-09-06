import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{type: 'user'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      options: {
        list: [
          {title: '1 Star', value: 1},
          {title: '2 Stars', value: 2},
          {title: '3 Stars', value: 3},
          {title: '4 Stars', value: 4},
          {title: '5 Stars', value: 5},
        ],
      },
    }),
    defineField({
      name: 'title',
      title: 'Review Title',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'comment',
      title: 'Review Comment',
      type: 'text',
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'images',
      title: 'Review Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: 'verifiedPurchase',
      title: 'Verified Purchase',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'helpfulVotes',
      title: 'Helpful Votes',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'notHelpfulVotes',
      title: 'Not Helpful Votes',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'adminResponse',
      title: 'Admin Response',
      type: 'text',
      description: 'Response from admin to this review',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      product: 'product.name',
      user: 'user.fullName',
      rating: 'rating',
      status: 'status',
    },
    prepare(selection) {
      const {title, product, user, rating, status} = selection
      return {
        title: title || `${rating}★ Review by ${user}`,
        subtitle: `Product: ${product} | Status: ${status}`,
      }
    },
  },
})
