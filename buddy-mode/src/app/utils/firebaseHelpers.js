import { ref, push, set, onValue } from 'firebase/database';
import database from '../firebaseConfig';

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
