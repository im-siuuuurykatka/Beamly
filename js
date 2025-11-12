import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// Konfiguracja Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBo2t7LAJ0mbbVAeD9IVI4xHKnKZdFcEoU",
  authDomain: "use-beamly.firebaseapp.com",
  databaseURL: "https://use-beamly-default-rtdb.firebaseio.com", // dopasuj URL z Realtime Database
  projectId: "use-beamly",
  storageBucket: "use-beamly.appspot.com",
  messagingSenderId: "1013402009059",
  appId: "1:1013402009059:web:e9e40207eb398d61f0b4d6",
  measurementId: "G-5C548KGT73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elementy DOM
const senderInput = document.getElementById('senderId');
const receiverInput = document.getElementById('receiverId');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const messagesList = document.getElementById('messagesList');

// Wysyłanie wiadomości
sendBtn.addEventListener('click', () => {
  const sender = senderInput.value.trim();
  const receiver = receiverInput.value.trim();
  const text = messageInput.value.trim();
  if (!sender || !receiver || !text) return alert("Wypełnij wszystkie pola!");

  push(ref(db, "messages/"), {
    sender,
    receiver,
    text,
    timestamp: Date.now()
  });

  messageInput.value = '';
});

// Odbieranie wiadomości
onValue(ref(db, "messages/"), (snapshot) => {
  messagesList.innerHTML = '';
  const data = snapshot.val();
  if (!data) return;
  Object.values(data).forEach(msg => {
    // Pokaż tylko wiadomości dla naszego ID
    if (msg.receiver === senderInput.value.trim()) {
      const li = document.createElement('li');
      li.textContent = `${msg.sender}: ${msg.text}`;
      messagesList.appendChild(li);
    }
  });
});
