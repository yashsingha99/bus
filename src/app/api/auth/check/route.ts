import { NextResponse } from 'next/server';
import { dbConnection } from '@/lib/db';
import { UserModel } from '@/model/user.model';

export async function POST(req: Request) {
  try {
    const { clerkId } = await req.json();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Clerk ID is required' },
        { status: 400 }
      );
    }

    await dbConnection();

    // Check if user exists
    const user = await UserModel.findOne({ clerkId });

    return NextResponse.json({
      exists: !!user
    });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 