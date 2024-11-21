"use client";

import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', id: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      console.log('Response:', response); // 응답 확인
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Signup failed:', errorData); // 서버 에러 로그
        alert(`회원가입 실패: ${errorData.error}`);
      } else {
        const successData = await response.json();
        console.log('Signup successful:', successData);
        alert('회원가입 성공!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('예상치 못한 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>회원가입</h1>
      <input name="name" placeholder="이름" onChange={handleChange} required />
      <input name="id" placeholder="아이디" onChange={handleChange} required />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
      <button type="submit">회원가입</button>
    </form>
  );
}
