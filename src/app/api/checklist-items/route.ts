import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import ChecklistItem from '@/models/ChecklistItem';
import TravelPlan from '@/models/TravelPlan';
import dbConnect from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const travelPlanId = searchParams.get('travelPlanId');

  try {
    const travelPlan = await TravelPlan.findOne({ _id: travelPlanId });
    if (!travelPlan) {
      return NextResponse.json({ error: '여행 계획을 찾을 수 없습니다.' }, { status: 404 });
    }
    const items = await ChecklistItem.find({ travelPlanId });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: '체크리스트 항목을 가져오는데 실패했습니다.' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  await dbConnect();

  const body = await request.json();
  const { travelPlanId, text } = body;

  try {
    const travelPlan = await TravelPlan.findOne({ _id: travelPlanId, userEmail: session.user?.email });
    if (!travelPlan) {
      return NextResponse.json({ error: '여행 계획을 찾을 수 없습니다.' }, { status: 404 });
    }
    const item = await ChecklistItem.create({ travelPlanId, text });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: '체크리스트 항목 생성에 실패했습니다.' }, { status: 400 });
  }
}