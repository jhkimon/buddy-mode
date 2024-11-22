"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../utils/firebaseHelpers";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); // 성공/실패 메시지
    const router = useRouter();

    const handleSignup = async () => {
        try {
            await signup(email, name, password);
            setMessage("회원가입 성공! 이제 로그인하세요.");
            setTimeout(() => router.push("/login"), 2000); // 2초 후 로그인 페이지로 이동
        } catch (error) {
            setMessage(`회원가입 실패: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>회원가입</h1>
            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: "block", margin: "1rem auto", padding: "0.5rem", width: "80%" }}
            />
            <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ display: "block", margin: "1rem auto", padding: "0.5rem", width: "80%" }}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: "block", margin: "1rem auto", padding: "0.5rem", width: "80%" }}
            />
            <div style={{ marginTop: "1rem" }}>
                <button
                    onClick={handleSignup}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    회원가입
                </button>
            </div>
            {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
        </div>
    );
}
