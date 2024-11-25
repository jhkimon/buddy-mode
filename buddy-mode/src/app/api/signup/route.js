import { NextResponse } from 'next/server';
import { signup } from '../../utils/firebaseHelpers';

export async function POST(req) {
  try {
    // 요청 본문(JSON) 파싱
    const { name, id, password } = await req.json();

    // 입력값 검증
    if (!name || !id || !password) {
      return NextResponse.json(
        { error: '이름, 아이디, 비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    // 회원가입 처리
    await signup({ name, id, password });

    // 성공 응답
    return NextResponse.json(
      { message: '회원가입 성공' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during signup:', error);

    // 오류 응답
    return NextResponse.json(
      { error: error.message || '회원가입 중 문제가 발생했습니다.' },
      { status: 500 }
    );
  }
}
