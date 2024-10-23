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

let activeRequestId = null;
let currentUser = null;  // Переменная для текущего пользователя

// Функция для выбора пользователя
function selectUser() {
  const username = document.getElementById('username').value;
  if (username) {
    currentUser = username;
    loadRequests(); // Загружаем заявки для текущего пользователя
  } else {
    alert('Введите имя пользователя');
  }
}

// Функция для добавления заявки в интерфейс
function addTabToUI(clientNumber, clientName, clientInn, clientBg, docId) {
  const tabContainer = document.querySelector('.tabs');
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.textContent = clientNumber;

  tab.addEventListener('click', function() {
    setActiveTab(docId, clientNumber, clientName, clientInn, clientBg);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    deleteRequest(docId, tab);
  });

  tab.appendChild(deleteBtn);
  tabContainer.appendChild(tab);
}

// Функция для сохранения заявки
function saveRequest(clientNumber, clientName, clientInn, clientBg) {
  if (!currentUser) {
    alert('Выберите пользователя перед сохранением заявки');
    return;
  }

  db.collection("requests").add({
    user: currentUser,  // Привязка к пользователю
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
    addTabToUI(clientNumber, clientName, clientInn, clientBg, docRef.id);
  })
  .catch(function(error) {
    console.error("Ошибка при сохранении заявки: ", error);
  });
}

// Функция для загрузки заявок только для текущего пользователя
function loadRequests() {
  if (!currentUser) {
    alert('Выберите пользователя');
    return;
  }

  db.collection("requests").where("user", "==", currentUser).get()
    .then(function(querySnapshot) {
      document.querySelector('.tabs').innerHTML = ''; // Очищаем старые заявки
      querySnapshot.forEach(function(doc) {
        const requestData = doc.data();
        addTabToUI(requestData.clientNumber, requestData.clientName, requestData.clientInn, requestData.clientBg, doc.id);
      });
    });
}

// Добавляем событие на выбор пользователя
document.getElementById('select-user').addEventListener('click', selectUser);

// Сохранение новой заявки
document.querySelector('.add-tab').addEventListener('click', function() {
  const clientNumber = document.getElementById('client-number').value;
  const clientName = document.getElementById('client-name').value;
  const clientInn = document.getElementById('client-inn').value;
  const clientBg = document.getElementById('client-bg').value;

  if (clientNumber && clientName && clientInn && clientBg) {
    saveRequest(clientNumber, clientName, clientInn, clientBg);
  } else {
    alert('Заполните все поля.');
  }
});

// Загружаем заявки при открытии страницы (после выбора пользователя)
window.onload = function() {
  // Ничего не загружаем, пока не выбран пользователь
};
