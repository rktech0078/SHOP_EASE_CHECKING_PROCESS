import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminClient } from '@/sanity/lib/adminClient';

// PATCH - Add admin response to review
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
    const { adminResponse } = await request.json();

    if (!adminResponse || adminResponse.trim().length === 0) {
      return NextResponse.json({ error: 'Admin response is required' }, { status: 400 });
    }

    await adminClient
      .patch(id)
      .set({ 
        adminResponse: adminResponse.trim(),
        updatedAt: new Date().toISOString()
      })
      .commit();

    return NextResponse.json({ message: 'Admin response added successfully' });
  } catch (error) {
    console.error('Error adding admin response:', error);
    return NextResponse.json({ error: 'Failed to add admin response' }, { status: 500 });
  }
}
