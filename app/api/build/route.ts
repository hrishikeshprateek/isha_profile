import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Collections } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Interface for Build/Project submission
interface BuildSubmission {
  category: string;
  vibe: string[];
  description: string;
  budget: string;
  deadline: string;
  name: string;
  email: string;
  submittedAt?: Date;
  status?: string;
}

// GET /api/build - Fetch all build submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const adminToken = request.headers.get('Authorization');

    // For now, we'll allow GET requests without strict auth check
    // In production, verify the token

    const db = await getDatabase();
    const collection = db.collection('build_submissions');

    const submissions = await collection
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      submissions: submissions.map(sub => ({
        ...sub,
        id: sub._id?.toString()
      }))
    });
  } catch (error) {
    console.error('Get build submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

// POST /api/build - Create new build submission
export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as BuildSubmission;

    // Validate required fields
    if (!data.category || !data.name || !data.email || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('build_submissions');

    // Create submission document
    const submission: BuildSubmission = {
      category: data.category,
      vibe: data.vibe || [],
      description: data.description,
      budget: data.budget || '',
      deadline: data.deadline || '',
      name: data.name,
      email: data.email,
      submittedAt: new Date(),
      status: 'new'
    };

    const result = await collection.insertOne(submission as any);

    return NextResponse.json({
      success: true,
      message: 'Build submission created successfully',
      id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Create build submission error:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}

// PUT /api/build - Update build submission status (admin)
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing id or status' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('build_submissions');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Submission status updated'
    });
  } catch (error) {
    console.error('Update build submission error:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

// DELETE /api/build - Delete build submission (admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('build_submissions');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Submission deleted'
    });
  } catch (error) {
    console.error('Delete build submission error:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}

