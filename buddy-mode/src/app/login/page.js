"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../utils/firebaseHelpers";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const user = await login(email, password);
            localStorage.setItem("currentUser", JSON.stringify({ uid: user.uid, email: user.email, name: user.displayName }));
            alert("로그인 성공!");
            router.push("/"); // 기본 페이지로 이동
        } catch (error) {
            alert(`로그인 실패: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>로그인</h1>
            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                    onClick={handleLogin}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    로그인
                </button>
            </div>
        </div>
    );
}
