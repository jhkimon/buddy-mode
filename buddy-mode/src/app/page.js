"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "./utils/firebaseHelpers";

export default function ChatTest() {
    const [currentUser, setCurrentUser] = useState(null); // 현재 사용자 정보
    const [profiles, setProfiles] = useState([]); // 다른 사용자 목록
    const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자

    // 로그인한 사용자 정보 가져오기
    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    // Realtime Database에서 사용자 목록 가져오기
    useEffect(() => {
        const fetchProfiles = async () => {
            const allUsers = await getAllUsers();

            // 현재 사용자 제외
            const filteredUsers = allUsers.filter(
                (user) => user.name !== currentUser?.name
            );

            setProfiles(filteredUsers);
        };

        if (currentUser) {
            fetchProfiles();
        }
    }, [currentUser]);

    // 채팅방 연결 핸들러
    const handleChatConnection = () => {
        if (!selectedUser) {
            alert("채팅할 사용자를 선택해주세요.");
            return;
        }

        // 이름 기반으로 채팅방 URL 생성
        const chatRoomUrl = `/space/${currentUser.name}/${selectedUser.name}`;
        window.location.href = chatRoomUrl;
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>채팅 테스트</h1>
            <h2>현재 사용자: {currentUser?.name || "알 수 없음"}</h2>

            {/* 사용자 프로필 목록 */}
            <div style={{ margin: "1rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {profiles.map((profile) => (
                    <div
                        key={profile.name} // name을 key로 사용
                        onClick={() => setSelectedUser(profile)}
                        style={{
                            padding: "1rem",
                            border: selectedUser?.name === profile.name ? "2px solid blue" : "1px solid #ccc",
                            borderRadius: "8px",
                            cursor: "pointer",
                            textAlign: "center",
                        }}
                    >
                        {profile.name}
                    </div>
                ))}
            </div>

            {/* 채팅 연결 버튼 */}
            <button
                onClick={handleChatConnection}
                style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                채팅 연결하기
            </button>
        </div>
    );
}
