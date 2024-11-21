import { NextResponse } from 'next/server';
import { login } from '../../utils/firebaseHelpers';

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await login(data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
