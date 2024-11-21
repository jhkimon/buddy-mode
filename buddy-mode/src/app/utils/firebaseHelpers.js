import { ref, push, set, get, query, equalTo, orderByChild } from 'firebase/database';
import { database } from '../../firebaseConfig';
import bcrypt from 'bcryptjs'; 

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

export const signup = async ({ name, id, password }) => {
    const usersRef = ref(database, 'users');
  
    // ID 중복 체크
    const userQuery = query(usersRef, orderByChild('id'), equalTo(id));
    const snapshot = await get(userQuery);
  
    if (snapshot.exists()) {
      throw new Error('이미 존재하는 아이디입니다.');
    }
  
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // 새 사용자 추가
    const newUserRef = push(usersRef);
    await set(newUserRef, { name, id, password: hashedPassword });
  
    return { message: '회원가입 성공' };
  };
  
  /*로그인*/
  export const login = async ({ id, password }) => {
    const usersRef = ref(database, 'users');
  
    // ID 검색
    const userQuery = query(usersRef, orderByChild('id'), equalTo(id));
    const snapshot = await get(userQuery);
  
    if (!snapshot.exists()) {
      throw new Error('존재하지 않는 아이디입니다.');
    }
  
    // 사용자 데이터 가져오기
    const userData = Object.values(snapshot.val())[0];
  
    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
  
    return { message: '로그인 성공', user: { id: userData.id, name: userData.name } };
  };
