import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Use better-auth's sendVerificationEmail method
    await auth.api.sendVerificationEmail({
      headers: request.headers,
      body: {
        email,
      },
    });

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 },
    );
  }
}
