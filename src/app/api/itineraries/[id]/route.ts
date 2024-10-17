import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth';
import dbConnect from '@/lib/mongodb';
import Itinerary from '@/models/Itinerary';
import TravelPlan from '@/models/TravelPlan';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { travelPlanId, ...itineraryData } = body;

    const itinerary = await Itinerary.findById(params.id);
    if (!itinerary) {
      return NextResponse.json({ error: '해당 일정을 찾을 수 없습니다.' }, { status: 404 });
    }

    const travelPlan = await TravelPlan.findOne({ _id: itinerary.travelPlanId, userEmail: session.user?.email });
    if (!travelPlan) {
      return NextResponse.json({ error: '해당 여행 계획을 찾을 수 없습니다.' }, { status: 404 });
    }

    const updatedItinerary = await Itinerary.findByIdAndUpdate(params.id, itineraryData, { new: true });

    return NextResponse.json({ success: true, data: updatedItinerary }, { status: 200 });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json({ success: false, error: '일정 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  await dbConnect();

  try {
    const itinerary = await Itinerary.findById(params.id);
    if (!itinerary) {
      return NextResponse.json({ error: '해당 일정을 찾을 수 없습니다.' }, { status: 404 });
    }

    const travelPlan = await TravelPlan.findOne({ _id: itinerary.travelPlanId, userEmail: session.user?.email });
    if (!travelPlan) {
      return NextResponse.json({ error: '해당 여행 계획을 찾을 수 없습니다.' }, { status: 404 });
    }

    await Itinerary.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json({ success: false, error: '일정 삭제에 실패했습니다.' }, { status: 500 });
  }
}