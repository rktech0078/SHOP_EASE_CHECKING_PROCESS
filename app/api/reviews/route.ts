import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createReview, getProductReviews, updateReviewVotes } from '@/sanity/lib/api';

// GET - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const reviews = await getProductReviews(productId);
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, title, comment } = body;

    if (!productId || !rating) {
      return NextResponse.json({ error: 'Product ID and rating are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check if user has already reviewed this product
    const existingReviews = await getProductReviews(productId);
    const userId = (session.user as { id: string }).id;
    const hasReviewed = existingReviews.some(review => review.user._id === userId);

    if (hasReviewed) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    const reviewData = {
      productId,
      userId: userId,
      rating,
      title: title?.trim(),
      comment: comment?.trim(),
      verifiedPurchase: false, // TODO: Check if user has purchased this product
    };

    const review = await createReview(reviewData);
    return NextResponse.json({ review, message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

// PATCH - Update review votes
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { reviewId, helpful } = body;

    if (!reviewId || typeof helpful !== 'boolean') {
      return NextResponse.json({ error: 'Review ID and helpful status are required' }, { status: 400 });
    }

    await updateReviewVotes(reviewId, helpful);
    return NextResponse.json({ message: 'Vote updated successfully' });
  } catch (error) {
    console.error('Error updating review vote:', error);
    return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
  }
}
