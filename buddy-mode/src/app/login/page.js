"use client";

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ id: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      alert(`로그인 성공! 환영합니다, ${data.user.name}`);
    } catch (error) {
      alert(`로그인 실패: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>로그인</h1>
      <input name="id" placeholder="아이디" onChange={handleChange} required />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
      <button type="submit">로그인</button>
    </form>
  );
}
