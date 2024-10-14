// Импорт функций Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore"; 

// Firebase конфигурация
const firebaseConfig = {
  apiKey: "AIzaSyBzT-NU0UnK2-KlbI5vH4Xz3IHzrRbGfD8",
  authDomain: "hutor-24bfc.firebaseapp.com",
  projectId: "hutor-24bfc",
  storageBucket: "hutor-24bfc.appspot.com",
  messagingSenderId: "129019774778",
  appId: "1:129019774778:web:e185f5bd9dbfb3ae7f7203",
  measurementId: "G-YWGM1XWL9M"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Функция для сохранения заявки
async function saveRequest(clientNumber, clientName, clientInn, clientBg) {
  try {
    const docRef = await addDoc(collection(db, "requests"), {
      clientNumber: clientNumber,
      clientName: clientName,
      clientInn: clientInn,
      clientBg: clientBg,
      banks: [],
      stages: {
        task: [],
        rework: [],
        link: [],
        bankWait: [],
        proposal: [],
        reject: []
      }
    });
    console.log("Заявка сохранена с ID: ", docRef.id);
  } catch (e) {
    console.error("Ошибка при сохранении заявки: ", e);
  }
}

// Пример вызова функции при создании заявки
document.querySelector('.add-tab').addEventListener('click', () => {
  const clientNumber = document.getElementById('client-number').value;
  const clientName = document.getElementById('client-name').value;
  const clientInn = document.getElementById('client-inn').value;
  const clientBg = document.getElementById('client-bg').value;

  saveRequest(clientNumber, clientName, clientInn, clientBg);
});

// Функция для загрузки заявок из Firestore
async function loadRequests() {
  const querySnapshot = await getDocs(collection(db, "requests"));
  querySnapshot.forEach((doc) => {
    const requestData = doc.data();
    console.log(`Заявка: ${requestData.clientNumber}, Клиент: ${requestData.clientName}`);
    
    // Логика для создания вкладки и отображения данных на странице
    createTabFromData(doc.id, requestData);
  });
}

// Функция для обновления этапов при перетаскивании банка
async function updateStage(requestId, bankName, newStage) {
  const requestRef = doc(db, "requests", requestId);
  
  const requestDoc = await getDoc(requestRef);
  if (requestDoc.exists()) {
    const stages = requestDoc.data().stages;

    // Удаление банка из старых этапов
    for (const stage in stages) {
      stages[stage] = stages[stage].filter(bank => bank !== bankName);
    }

    // Добавляем банк в новый этап
    stages[newStage].push(bankName);

    // Обновляем документ в Firestore
    await updateDoc(requestRef, { stages: stages });
  }
}

// Вызов функции загрузки заявок при загрузке страницы
window.onload = function() {
  loadRequests();
};
