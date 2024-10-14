// Firebase configuration (v8)
var firebaseConfig = {
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
var db = firebase.firestore();

// Функция для добавления заявки в интерфейс
function addTabToUI(clientNumber, clientName, clientInn, clientBg, docId) {
  const tabContainer = document.querySelector('.tabs');
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.textContent = `Заявка ${clientNumber}`;
  
  // Событие для переключения между заявками (пока без логики переключения)
  tab.addEventListener('click', function() {
    console.log('Переключение на заявку:', clientNumber);
    // Здесь можно реализовать логику для отображения содержимого заявки
  });

  // Добавляем вкладку в интерфейс
  tabContainer.appendChild(tab);
}

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
  .then(function(docRef) {
    console.log("Заявка сохранена с ID: ", docRef.id);
    // Добавляем новую заявку в интерфейс после сохранения
    addTabToUI(clientNumber, clientName, clientInn, clientBg, docRef.id);
  })
  .catch(function(error) {
    console.error("Ошибка при сохранении заявки: ", error);
  });
}

// Пример вызова функции при создании заявки
document.querySelector('.add-tab').addEventListener('click', function() {
  var clientNumber = document.getElementById('client-number').value;
  var clientName = document.getElementById('client-name').value;
  var clientInn = document.getElementById('client-inn').value;
  var clientBg = document.getElementById('client-bg').value;

  if (clientNumber && clientName && clientInn && clientBg) {
    saveRequest(clientNumber, clientName, clientInn, clientBg);
  } else {
    alert('Пожалуйста, заполните все поля.');
  }
});

// Функция для загрузки заявок из Firestore
function loadRequests() {
  db.collection("requests").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var requestData = doc.data();
      console.log("Заявка: ", requestData.clientNumber, " Клиент: ", requestData.clientName);
      // Добавляем каждую загруженную заявку в интерфейс
      addTabToUI(requestData.clientNumber, requestData.clientName, requestData.clientInn, requestData.clientBg, doc.id);
    });
  });
}

// Загрузка заявок при открытии страницы
window.onload = function() {
  loadRequests();
};
