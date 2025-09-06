import { NextRequest, NextResponse } from 'next/server';
import { getReviewStats } from '@/sanity/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const stats = await getReviewStats(productId);
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return NextResponse.json({ error: 'Failed to fetch review stats' }, { status: 500 });
  }
}
