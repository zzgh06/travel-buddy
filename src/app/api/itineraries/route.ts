import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/auth";
import dbConnect from "@/lib/mongodb";
import TravelPlan from "@/models/TravelPlan";
import Itinerary from "@/models/Itinerary";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  await dbConnect();

  try {
    const url = new URL(req.url);
    const travelPlanId = url.searchParams.get('travelPlanId');

    if (!travelPlanId) {
      return NextResponse.json({ error: '여행 계획 ID가 필요합니다.' }, { status: 400 });
    }

    const travelPlan = await TravelPlan.findOne({ _id: travelPlanId, userEmail: session.user?.email });
    if (!travelPlan) {
      return NextResponse.json({ error: '해당 여행 계획을 찾을 수 없습니다.' }, { status: 404 });
    }

    const itineraries = await Itinerary.find({ travelPlanId }).sort({ date: 1, time: 1 });
    return NextResponse.json({ success: true, data: itineraries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json({ success: false, error: '일정 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자 입니다.' }, { status: 401 })
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { travelPlanId, ...itineraryData } = body;

    const travelPlan = await TravelPlan.findOne({ _id: travelPlanId, userEmail: session.user?.email })
    if(!travelPlan) {
      return NextResponse.json({ error: '해당 여행 계획을 찾을 수 없습니다.' }, { status: 404 });
    }

    const itinerary = new Itinerary({ ...itineraryData, travelPlanId });
    await itinerary.save();
    return NextResponse.json({ success: true, data: itinerary }, { status: 200 });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json({ success: false, error: '일정 생성에 실패했습니다.' }, { status: 500 });
  }
}
