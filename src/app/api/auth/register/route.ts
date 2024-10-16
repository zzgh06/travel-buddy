import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    await dbConnect();

    const existingUser  = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: '이미 등록된 이메일입니다.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "회원가입이 완료되었습니다." }, { status: 200 });
  } catch(error : any){
    console.error(error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}