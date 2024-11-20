'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import database from '../../firebaseConfig';
import styles from './wait.module.css';

const WaitPage = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Add current user to waiting list
        const addUserToQueue = async () => {
            const usersRef = ref(database, 'waiting');
            const newUserRef = push(usersRef);
            const newUser = {
                id: newUserRef.key,
                joinedAt: Date.now(),
            };

            await set(newUserRef, newUser);
            setCurrentUser(newUser);
        };

        addUserToQueue();

        // Listen to changes in waiting queue
        const usersRef = ref(database, 'waiting');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val() || {};
            setUsers(Object.values(data));
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className={styles.container}>
            <h1>Waiting Room</h1>
            <p>Waiting for other users to connect...</p>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.id}</li>
                ))}
            </ul>
        </div>
    );
};

export default WaitPage;
