import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import TravelPlan from '@/models/TravelPlan';
import dbConnect from '@/lib/mongodb';
import { authOptions } from '../auth/[...nextauth]/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 400 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { title, startDate, endDate, destination, description } = body;

    const travelPlan = new TravelPlan({
      title,
      startDate,
      endDate,
      destination,
      description,
      userEmail: session.user?.email,
    });

    await travelPlan.save();

    return NextResponse.json({ success: true, data: travelPlan }, { status: 200 });
  } catch (error : any) {
    console.error(error);
    return NextResponse.json({ success: false, error: '여행 계획 생성에 실패했습니다.' }, { status: 500 });
  }
}