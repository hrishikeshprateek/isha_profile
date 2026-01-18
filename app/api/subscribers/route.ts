import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';

// Simple in-memory rate limiting (for single server)
// For production with multiple servers, use Redis
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 900000 }); // 15 min window
    return false;
  }

  if (record.count >= 5) {
    return true; // 5 requests per 15 minutes
  }

  record.count++;
  return false;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST /api/subscribers  -> create a subscriber
export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Rate limiting check
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, source = 'footer' } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection(Collections.SUBSCRIBERS);

    // Check if already subscribed
    const existing = await collection.findOne({ email: trimmedEmail });
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Already subscribed',
        alreadyExists: true
      });
    }

    // Add subscriber with proper timestamp
    const result = await collection.insertOne({
      email: trimmedEmail,
      source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Check your email.',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe. Try again later.' }, { status: 500 });
  }
}

// GET /api/subscribers  -> list subscribers (public for now, admin can view in /admin/subscribers)
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection(Collections.SUBSCRIBERS);
    const subscribers = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      subscribers,
      count: subscribers.length
    });
  } catch (error) {
    console.error('List subscribers error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

