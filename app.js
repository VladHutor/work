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

  saveRequest(clientNumber, clientName, clientInn, clientBg);
});

// Функция для загрузки заявок из Firestore
function loadRequests() {
  db.collection("requests").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var requestData = doc.data();
      console.log("Заявка: ", requestData.clientNumber, " Клиент: ", requestData.clientName);
      // Здесь можно добавить логику для отображения заявок на странице
    });
  });
}

// Загрузка заявок при открытии страницы
window.onload = function() {
  loadRequests();
};
