import { ref, set, onValue, remove, push, get } from 'firebase/database';
import { database } from '../../firebaseConfig';

// Offer 전송
export const sendOffer = async (targetUsername, offer) => {
    try {
        const offerRef = ref(database, `signaling/${targetUsername}/offer`);
        console.log('Sending offer to:', targetUsername, offer);
        await set(offerRef, {
            sdp: offer.sdp,
            type: offer.type,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error('Error sending offer:', error);
    }
};

// Offer 수신 리스너
export const listenToOffer = (username, callback) => {
    const offerRef = ref(database, `signaling/${username}/offer`);
    return onValue(
        offerRef,
        (snapshot) => {
            const data = snapshot.val();
            console.log('Received offer data:', data);
            if (data && data.type === 'offer' && data.sdp) {
                callback({
                    type: data.type,
                    sdp: data.sdp,
                });
            } else {
                console.log('Waiting for valid offer data...');
            }
        },
        (error) => {
            console.error('Error listening to offer:', error);
        }
    );
};

// Answer 전송
export const sendAnswer = async (targetUsername, answer) => {
    try {
        const answerRef = ref(database, `signaling/${targetUsername}/answer`);
        console.log('Sending answer to:', targetUsername, answer);
        await set(answerRef, {
            sdp: answer.sdp,
            type: answer.type,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error('Error sending answer:', error);
    }
};

// Answer 수신 리스너
export const listenToAnswer = (username, callback) => {
    const answerRef = ref(database, `signaling/${username}/answer`);
    return onValue(
        answerRef,
        (snapshot) => {
            const data = snapshot.val();
            console.log('Received answer data:', data);
            if (data && data.type === 'answer' && data.sdp) {
                callback({
                    type: data.type,
                    sdp: data.sdp,
                });
            } else {
                console.log('Waiting for valid answer data...');
            }
        },
        (error) => {
            console.error('Error listening to answer:', error);
        }
    );
};

// ICE Candidate 전송
export const sendCandidate = async (targetUsername, candidate) => {
    try {
        const candidatesRef = ref(database, `signaling/${targetUsername}/candidates`);
        const newCandidateRef = push(candidatesRef);
        await set(newCandidateRef, {
            candidate: candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error('Error sending ICE candidate:', error);
    }
};

// ICE Candidate 수신 리스너
export const listenToCandidates = (username, callback) => {
    const candidatesRef = ref(database, `signaling/${username}/candidates`);
    return onValue(
        candidatesRef,
        (snapshot) => {
            const data = snapshot.val();
            console.log('Received ICE candidates:', data);
            if (data) {
                const candidates = Object.values(data).map((item) => ({
                    candidate: item.candidate,
                    sdpMid: item.sdpMid,
                    sdpMLineIndex: item.sdpMLineIndex,
                }));
                callback(candidates);
            }
        },
        (error) => {
            console.error('Error listening to ICE candidates:', error);
        }
    );
};

// 사용자 상태 확인
export const checkUserExists = async (username) => {
    try {
        const userRef = ref(database, `signaling/${username}`);
        const snapshot = await get(userRef);
        return snapshot.exists();
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
};

// 사용자 초기화
export const joinServer = async (username) => {
    try {
        const userRef = ref(database, `signaling/${username}`);
        await set(userRef, {
            joinedAt: Date.now(),
            status: 'online',
        });
    } catch (error) {
        console.error('Error joining server:', error);
    }
};

// 사용자 데이터 제거
export const removeUser = async (username) => {
    try {
        const userRef = ref(database, `signaling/${username}`);
        await remove(userRef);
    } catch (error) {
        console.error('Error removing user:', error);
    }
};
