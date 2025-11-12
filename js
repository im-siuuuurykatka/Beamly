import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBo2t7LAJ0mbbVAeD9IVI4xHKnKZdFcEoU",
  authDomain: "use-beamly.firebaseapp.com",
  databaseURL: "https://use-beamly-default-rtdb.firebaseio.com", 
  projectId: "use-beamly",
  storageBucket: "use-beamly.appspot.com",
  messagingSenderId: "1013402009059",
  appId: "1:1013402009059:web:e9e40207eb398d61f0b4d6",
  measurementId: "G-5C548KGT73"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM
const loginDiv = document.getElementById('loginDiv');
const chatDiv = document.getElementById('chatDiv');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const myIdSpan = document.getElementById('myId');
const receiverInput = document.getElementById('receiverId');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const messagesList = document.getElementById('messagesList');

let myID = "";

// Logowanie Google
googleSignInBtn.addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  myID = user.displayName || user.email;
  myIdSpan.textContent = myID;

  loginDiv.style.display = 'none';
  chatDiv.style.display = 'block';

  listenMessages();
});

// Wylogowanie
signOutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    loginDiv.style.display = 'block';
    chatDiv.style.display = 'none';
    myID = "";
    messagesList.innerHTML = '';
    receiverInput.value = '';
    messageInput.value = '';
  });
});

// Wysyłanie wiadomości
sendBtn.addEventListener('click', () => {
  const receiver = receiverInput.value.trim();
  const text = messageInput.value.trim();
  if (!receiver || !text) return alert("Wypełnij wszystkie pola!");

  push(ref(db, "messages/"), {
    sender: myID,
    receiver,
    text,
    timestamp: Date.now()
  });

  messageInput.value = '';
});

// Odbieranie wiadomości w czasie rzeczywistym
function listenMessages() {
  onValue(ref(db, "messages/"), (snapshot) => {
    messagesList.innerHTML = '';
    const data = snapshot.val();
    if (!data) return;
    Object.values(data).forEach(msg => {
      if (msg.receiver === myID) {
        const li = document.createElement('li');
        li.textContent = `${msg.sender}: ${msg.text}`;
        messagesList.appendChild(li);
      }
    });
    messagesList.scrollTop = messagesList.scrollHeight;
  });
}
