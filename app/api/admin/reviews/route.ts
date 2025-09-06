import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminClient } from '@/sanity/lib/adminClient';

// GET - Fetch all reviews for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query based on status filter
    let query = '*[_type == "review"';
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query += ` && status == "${status}"`;
    }
    query += '] | order(createdAt desc)';

    const reviews = await adminClient.fetch(`
      ${query}[${skip}...${skip + limit}] {
        _id,
        rating,
        comment,
        status,
        adminResponse,
        product-> {
          _id,
          name,
          slug
        },
        user-> {
          _id,
          fullName,
          email
        },
        createdAt,
        updatedAt
      }
    `);

    // Get total count for pagination
    const totalQuery = query.replace('] | order(createdAt desc)', ']');
    const total = await adminClient.fetch(`count(${totalQuery})`);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}