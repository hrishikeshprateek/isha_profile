import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';

// GET - Fetch maintenance mode status
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('settings');

    const settings = await collection.findOne({ key: 'maintenance_mode' });

    return NextResponse.json({
      success: true,
      maintenanceMode: settings?.enabled || false,
      message: settings?.message || 'Site is under maintenance'
    });
  } catch (error) {
    console.error('Maintenance mode GET error:', error);
    return NextResponse.json({
      success: false,
      maintenanceMode: false,
      error: 'Failed to fetch maintenance status'
    }, { status: 500 });
  }
}

// POST/PUT - Update maintenance mode status
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { enabled, message } = body;

    const db = await getDatabase();
    const collection = db.collection('settings');

    // Update or create maintenance mode setting
    await collection.updateOne(
      { key: 'maintenance_mode' },
      {
        $set: {
          key: 'maintenance_mode',
          enabled: !!enabled,
          message: message || 'Site is under maintenance. We\'ll be back soon!',
          updatedAt: new Date(),
          updatedBy: auth.uid
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      maintenanceMode: enabled,
      message: 'Maintenance mode updated successfully'
    });
  } catch (error) {
    console.error('Maintenance mode POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update maintenance mode' },
      { status: 500 }
    );
  }
}

