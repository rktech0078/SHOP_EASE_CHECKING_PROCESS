import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
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
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Category Image (400x400px recommended)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Upload a square image for best display. Recommended size: 400x400px or 500x500px',
      validation: (Rule) => Rule.required().warning('Category image is recommended for better user experience'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})