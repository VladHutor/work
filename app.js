// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzT-NU0UnK2-KlbI5vH4Xz3IHzrRbGfD8",
  authDomain: "hutor-24bfc.firebaseapp.com",
  projectId: "hutor-24bfc",
  storageBucket: "hutor-24bfc.appspot.com",
  messagingSenderId: "129019774778",
  appId: "1:129019774778:web:e185f5bd9dbfb3ae7f7203",
  measurementId: "G-YWGM1XWL9M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

// Функция для сохранения заявки
function saveRequest(clientNumber, clientName, clientInn, clientBg) {
  db.collection("requests").add({
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
  })
  .then((docRef) => {
    console.log("Заявка сохранена с ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Ошибка при сохранении заявки: ", error);
  });
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
function loadRequests() {
  db.collection("requests").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const requestData = doc.data();
      console.log(`Заявка: ${requestData.clientNumber}, Клиент: ${requestData.clientName}`);
      
      // Логика для создания вкладки и отображения данных на странице
      createTabFromData(doc.id, requestData);
    });
  });
}

// Вызов функции загрузки заявок при загрузке страницы
window.onload = function() {
  loadRequests();
};
