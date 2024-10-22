import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import TravelPlan from '@/models/TravelPlan';
import dbConnect from '@/lib/mongodb';
import { authOptions } from '../../auth/[...nextauth]/auth';
import Itinerary from '@/models/Itinerary';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  await dbConnect();

  try {
    const travelPlan = await TravelPlan.findOne({ _id: params.id, userEmail: session.user?.email });
    if (!travelPlan) {
      return NextResponse.json({ error: '해당 여행 계획을 찾을 수 없습니다.' }, { status: 404 });
    }

    const itineraries = await Itinerary.find({ travelPlanId: params.id }).sort({ date: 1, time: 1 });

    const totalExpenses = itineraries.reduce((sum, itinerary) => sum + (itinerary.expense || 0), 0);
    const remainingBudget = travelPlan.budget - totalExpenses;

    return NextResponse.json({ 
      success: true, 
      data: { 
        travelPlan: JSON.parse(JSON.stringify(travelPlan)),
        itineraries: JSON.parse(JSON.stringify(itineraries)),
        totalExpenses,
        remainingBudget
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching travel plan and itineraries:', error);
    return NextResponse.json({ success: false, error: '데이터 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const updatedPlan = await TravelPlan.findOneAndUpdate(
      { _id: params.id, userEmail: session.user?.email },
      { $set: body },  
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return NextResponse.json({ error: '여행 계획을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPlan }, { status: 200 });
  } catch (error : any) {
    console.error(error);
    return NextResponse.json({ success: false, error: '여행 계획 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  await dbConnect();

  try {
    const deletedPlan = await TravelPlan.findOneAndDelete({ _id: params.id, userEmail: session.user?.email || ""});

    if (!deletedPlan) {
      return NextResponse.json({ error: '여행 계획을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedPlan }, { status: 200 });
  } catch (error : any) {
    console.error(error);
    return NextResponse.json({ success: false, error: '여행 계획 삭제에 실패했습니다.' }, { status: 500 });
  }
}