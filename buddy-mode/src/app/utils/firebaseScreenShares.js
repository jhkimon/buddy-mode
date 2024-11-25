import { ref, remove, push, set, get, onValue, onChildAdded } from 'firebase/database';
import { database } from '../../firebaseConfig';

// 화면 공유 Offer 설정
export const setScreenShareOffer = async (roomId, data) => {
    const screenShareOfferRef = ref(database, `rooms/${roomId}/screenShareOffer`);
    await set(screenShareOfferRef, data);
};

// 화면 공유 Offer 리스너
export const listenToScreenShareOffer = (roomId, callback) => {
    const screenShareOfferRef = ref(database, `rooms/${roomId}/screenShareOffer`);
    return onValue(screenShareOfferRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};

// 화면 공유 Offer 제거
export const removeScreenShareOffer = async (roomId) => {
    const screenShareOfferRef = ref(database, `rooms/${roomId}/screenShareOffer`);
    await set(screenShareOfferRef, null);
};

// Function to send ICE candidate
export const sendScreenShareCandidate = async (roomId, senderId, candidate) => {
    const candidatesRef = ref(database, `rooms/${roomId}/screenShareCandidates/${senderId}`);
    const newCandidateRef = push(candidatesRef);
    await set(newCandidateRef, candidate);
};

// Function to listen for ICE candidates
export const listenToScreenShareCandidates = (roomId, senderId, callback) => {
    const candidatesRef = ref(database, `rooms/${roomId}/screenShareCandidates`);
    return onChildAdded(candidatesRef, (snapshot) => {
        const data = snapshot.val();
        const peerId = snapshot.key;
        if (peerId !== senderId) {
            const candidateRef = ref(database, `rooms/${roomId}/screenShareCandidates/${peerId}`);
            onChildAdded(candidateRef, (candidateSnapshot) => {
                const candidate = candidateSnapshot.val();
                callback(candidate);
            });
        }
    });
};

// Function to clear ICE candidates
export const clearScreenShareCandidates = async (roomId) => {
    const candidatesRef = ref(database, `rooms/${roomId}/screenShareCandidates`);
    await remove(candidatesRef);
};
