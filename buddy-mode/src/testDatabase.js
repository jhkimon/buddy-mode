import database from './firebaseConfig.js';
import { ref, set, get, child } from 'firebase/database';

async function testDatabase() {
    try {
        // 1. 데이터 쓰기
        const testRef = ref(database, 'test/');
        await set(testRef, { message: 'Hello Firebase Realtime Database!' });
        console.log('Data written successfully.');

        // 2. 데이터 읽기
        const snapshot = await get(child(ref(database), 'test/'));
        if (snapshot.exists()) {
            console.log('Data read successfully:', snapshot.val());
        } else {
            console.log('No data found.');
        }
    } catch (error) {
        console.error('Error with Firebase Realtime Database:', error);
    }
}

testDatabase();
