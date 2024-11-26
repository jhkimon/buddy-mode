import { ref, push, set, get, query, equalTo, orderByChild, onValue } from 'firebase/database';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { database, auth, firestore } from '../../firebaseConfig';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

export const addToQueue = async (user) => {
    const queueRef = ref(database, 'waiting');
    const userRef = push(queueRef);
    await set(userRef, user);
    return userRef.key;
};

export const listenToQueue = (callback) => {
    const queueRef = ref(database, 'waiting');
    return onValue(queueRef, (snapshot) => {
        const data = snapshot.val() || {};
        callback(Object.values(data));
    });
};

// 회원가입: Authentication + Realtime Database
export const signup = async (email, name, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firebase Authentication에 이름 저장
    await updateProfile(user, { displayName: name });

    // Realtime Database에 사용자 정보 저장
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, { email, name, uid: user.uid });

    return user;
};

// 로그인 함수
export const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

// Realtime Database에서 사용자 목록 가져오기
export const getAllUsers = async () => {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);

    const users = snapshot.val() || {};
    return Object.values(users); // 객체를 배열로 변환
};

// 메시지 추가
export const addMessage = async (roomId, sender, content) => {
    const chatRef = ref(database, `chats/${roomId}/messages`);
    const newMessageRef = push(chatRef);
    await set(newMessageRef, {
        sender,
        content,
        timestamp: Date.now(),
    });
};

// 메시지 리스너
export const listenToMessages = (roomId, callback) => {
    const chatRef = ref(database, `chats/${roomId}/messages`);
    return onValue(chatRef, (snapshot) => {
        const messages = snapshot.val() || {};
        callback(Object.values(messages));
    });
};
