import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false for real-time data
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN, // Use the public environment variable
})

// Admin client for write operations
export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Use admin token for write operations
})

