import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image', options: { hotspot: true }}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'discount',
      title: 'Discount',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  { title: 'XS', value: 'xs' },
                  { title: 'S', value: 's' },
                  { title: 'M', value: 'm' },
                  { title: 'L', value: 'l' },
                  { title: 'XL', value: 'xl' },
                  { title: 'XXL', value: 'xxl' },
                  { title: 'XXXL', value: 'xxxl' },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'stock',
              title: 'Stock Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
              initialValue: 0,
            },
          ],
          preview: {
            select: {
              size: 'size',
              stock: 'stock',
            },
            prepare(selection) {
              const { size, stock } = selection;
              return {
                title: `Size: ${size?.toUpperCase()}`,
                subtitle: `Stock: ${stock}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Color Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              title: 'Color Code',
              type: 'string',
              description: 'Hex color code (e.g., #FF0000)',
              validation: (Rule) => Rule.required().regex(/^#[0-9A-F]{6}$/i, {
                name: 'hex color',
                invert: false,
              }),
            },
            {
              name: 'image',
              title: 'Color Image',
              type: 'image',
              description: 'Optional image showing this color variant',
              options: { hotspot: true },
            },
          ],
          preview: {
            select: {
              name: 'name',
              value: 'value',
              image: 'image',
            },
            prepare(selection) {
              const { name, value, image } = selection;
              return {
                title: name,
                subtitle: value,
                media: image,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
    },
  },
})