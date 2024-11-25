'use client';

import { useEffect, useState } from 'react';
import { addMessage, listenToMessages } from '../../../utils/firebaseHelpers';

export default function ChatPage({ params }) {
    const [username1, setUsername1] = useState(null);
    const [username2, setUsername2] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [roomId, setRoomId] = useState('');

    // params 언래핑 및 디코딩
    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            const decodedUsername1 = decodeURIComponent(resolvedParams.username1);
            const decodedUsername2 = decodeURIComponent(resolvedParams.username2);

            setUsername1(decodedUsername1);
            setUsername2(decodedUsername2);

            // 방 ID 생성
            const generatedRoomId = [decodedUsername1, decodedUsername2].sort().join('_');
            setRoomId(generatedRoomId);
        };

        unwrapParams();
    }, [params]);

    // 메시지 리스너 등록
    useEffect(() => {
        if (roomId) {
            const unsubscribe = listenToMessages(roomId, (fetchedMessages) => {
                setMessages(fetchedMessages);
            });

            return () => unsubscribe(); // 컴포넌트 언마운트 시 리스너 제거
        }
    }, [roomId]);

    // 메시지 전송 핸들러
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        await addMessage(roomId, username1, newMessage);
        setNewMessage(''); // 입력창 초기화
    };

    // 화상 채팅 이동 핸들러
    const handleVideoChat = () => {
        window.location.href = `/video/${encodeURIComponent(username1)}/${encodeURIComponent(username2)}`;
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>
                채팅방: {username1} & {username2}
            </h1>

            {/* 메시지 목록 */}
            <div
                style={{
                    border: '1px solid #ccc',
                    height: '300px',
                    overflowY: 'scroll',
                    marginBottom: '10px',
                    padding: '10px',
                }}
            >
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <strong>{msg.sender}</strong>: {msg.content}
                        <div style={{ fontSize: '0.8em', color: '#888' }}>
                            {new Date(msg.timestamp).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* 메시지 입력 */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button
                    onClick={handleSendMessage}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    전송
                </button>
            </div>

            {/* 화상 채팅 버튼 */}
            <button
                onClick={handleVideoChat}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                화상 채팅으로 이동
            </button>
        </div>
    );
}
