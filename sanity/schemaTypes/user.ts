import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'user',
  title: 'Users',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'password',
      title: 'Password Hash',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'addresses',
      title: 'Shipping Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'shippingAddress',
          fields: [
            { 
              name: 'isDefault', 
              type: 'boolean', 
              title: 'Default Address',
              initialValue: false 
            },
            { 
              name: 'label', 
              type: 'string', 
              title: 'Address Label',
              description: 'e.g., Home, Office, etc.',
              options: {
                list: [
                  { title: 'Home', value: 'home' },
                  { title: 'Office', value: 'office' },
                  { title: 'Other', value: 'other' }
                ]
              }
            },
            { 
              name: 'fullName', 
              type: 'string', 
              title: 'Full Name',
              validation: (Rule) => Rule.required()
            },
            { 
              name: 'phone', 
              type: 'string', 
              title: 'Phone Number',
              validation: (Rule) => Rule.required()
            },
            { 
              name: 'street', 
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
              title: 'Landmark (Optional)',
              description: 'Nearby landmark for easy delivery'
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
          preview: {
            select: {
              title: 'label',
              subtitle: 'street',
              default: 'isDefault'
            },
            prepare(selection) {
              const { title, subtitle, default: isDefault } = selection
              return {
                title: `${title}${isDefault ? ' (Default)' : ''}`,
                subtitle: subtitle
              }
            }
          }
        }
      ],
      initialValue: []
    }),
    // Keep the old address field for backward compatibility
    defineField({
      name: 'address',
      title: 'Legacy Address (Deprecated)',
      type: 'object',
      fields: [
        { name: 'street', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State/Province' },
        { name: 'zipCode', type: 'string', title: 'ZIP/Postal Code' },
        { name: 'country', type: 'string', title: 'Country' },
      ],
      hidden: true, // Hide this field as it's deprecated
    }),
    defineField({
      name: 'role',
      title: 'User Role',
      type: 'string',
      options: {
        list: [
          { title: 'Customer', value: 'customer' },
          { title: 'Admin', value: 'admin' },
        ],
      },
      initialValue: 'customer',
    }),
    defineField({
      name: 'provider',
      title: 'Authentication Provider',
      type: 'string',
      options: {
        list: [
          { title: 'Credentials', value: 'credentials' },
          { title: 'Google', value: 'google' },
          { title: 'Facebook', value: 'facebook' },
        ],
      },
      initialValue: 'credentials',
    }),
    defineField({
      name: 'providerId',
      title: 'Provider ID',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'isEmailVerified',
      title: 'Email Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isPhoneVerified',
      title: 'Phone Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'verificationToken',
      title: 'Email Verification Token',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resetPasswordToken',
      title: 'Password Reset Token',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resetPasswordExpires',
      title: 'Password Reset Expires',
      type: 'datetime',
      hidden: true,
    }),
    defineField({
      name: 'lastLogin',
      title: 'Last Login',
      type: 'datetime',
    }),
    defineField({
      name: 'status',
      title: 'Account Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Inactive', value: 'inactive' },
          { title: 'Suspended', value: 'suspended' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'createdAt',
      title: 'Account Created',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'email',
      role: 'role',
      status: 'status'
    },
    prepare(selection) {
      const { title, subtitle, role, status } = selection
      return {
        title: title || 'Unnamed User',
        subtitle: `${subtitle} (${status})`,
        media: role === 'admin' ? 'A' : 'U',
      }
    },
  },
})
