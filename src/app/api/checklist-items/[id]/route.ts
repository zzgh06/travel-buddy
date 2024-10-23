import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth';
import ChecklistItem from '@/models/ChecklistItem';
import TravelPlan from '@/models/TravelPlan';
import dbConnect from '@/lib/mongodb';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  await dbConnect();

  const id = params.id;
  const body = await request.json();

  try {
    const item = await ChecklistItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: '체크리스트 항목을 찾을 수 없습니다.' }, { status: 404 });
    }
    const travelPlan = await TravelPlan.findOne({ _id: item.travelPlanId, userEmail: session.user?.email });
    if (!travelPlan) {
      return NextResponse.json({ error: '이 항목을 수정할 권한이 없습니다.' }, { status: 403 });
    }
    const updatedItem = await ChecklistItem.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: '체크리스트 항목 수정에 실패했습니다.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  await dbConnect();

  const id = params.id;

  try {
    const item = await ChecklistItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: '체크리스트 항목을 찾을 수 없습니다.' }, { status: 404 });
    }
    const travelPlan = await TravelPlan.findOne({ _id: item.travelPlanId, userEmail: session.user?.email });
    if (!travelPlan) {
      return NextResponse.json({ error: '이 항목을 삭제할 권한이 없습니다.' }, { status: 403 });
    }
    await ChecklistItem.deleteOne({ _id: id });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: '체크리스트 항목 삭제에 실패했습니다.' }, { status: 400 });
  }
}