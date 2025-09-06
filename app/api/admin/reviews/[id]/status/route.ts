import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminClient } from '@/sanity/lib/adminClient';

// PATCH - Update review status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await adminClient
      .patch(id)
      .set({ 
        status,
        updatedAt: new Date().toISOString()
      })
      .commit();

    return NextResponse.json({ message: 'Review status updated successfully' });
  } catch (error) {
    console.error('Error updating review status:', error);
    return NextResponse.json({ error: 'Failed to update review status' }, { status: 500 });
  }
}
