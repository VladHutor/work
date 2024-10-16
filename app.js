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

let activeRequestId = null; // Для отслеживания текущей активной заявки

// Функция для добавления заявки в интерфейс
function addTabToUI(clientNumber, clientName, clientInn, clientBg, docId) {
  const tabContainer = document.querySelector('.tabs');
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.textContent = clientNumber;

  // Событие для переключения между заявками
  tab.addEventListener('click', function() {
    setActiveTab(docId, clientNumber, clientName, clientInn, clientBg);
  });

  // Кнопка удаления заявки
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    deleteRequest(docId, tab);
  });

  tab.appendChild(deleteBtn);
  tabContainer.appendChild(tab);
}

// Функция для удаления заявки
function deleteRequest(docId, tabElement) {
  db.collection("requests").doc(docId).delete().then(function() {
    console.log("Заявка удалена с ID: ", docId);
    tabElement.remove();
  }).catch(function(error) {
    console.error("Ошибка при удалении заявки: ", error);
  });
}

// Установка активной вкладки
function setActiveTab(docId, clientNumber, clientName, clientInn, clientBg) {
  activeRequestId = docId;

  // Убираем выделение с предыдущей активной вкладки
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Выделяем текущую вкладку
  event.target.classList.add('active');

  // Отображаем данные текущей заявки в полях ввода
  document.getElementById('client-number').value = clientNumber;
  document.getElementById('client-name').value = clientName;
  document.getElementById('client-inn').value = clientInn;
  document.getElementById('client-bg').value = clientBg;
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
    addTabToUI(clientNumber, clientName, clientInn, clientBg, docRef.id);
  })
  .catch(function(error) {
    console.error("Ошибка при сохранении заявки: ", error);
  });
}

// Функция для сохранения изменений в активной заявке
function saveCurrentRequest() {
  const clientNumber = document.getElementById('client-number').value;
  const clientName = document.getElementById('client-name').value;
  const clientInn = document.getElementById('client-inn').value;
  const clientBg = document.getElementById('client-bg').value;

  if (activeRequestId) {
    db.collection("requests").doc(activeRequestId).update({
      clientNumber: clientNumber,
      clientName: clientName,
      clientInn: clientInn,
      clientBg: clientBg
    })
    .then(() => {
      console.log("Параметры заявки обновлены для ID: ", activeRequestId);
    })
    .catch(error => {
      console.error("Ошибка при обновлении заявки: ", error);
    });
  } else {
    alert("Нет активной заявки для сохранения.");
  }
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

// Кнопка сохранения параметров
document.querySelector('.save-params').addEventListener('click', saveCurrentRequest);

// Функция для загрузки заявок из Firestore
function loadRequests() {
  db.collection("requests").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var requestData = doc.data();
      console.log("Заявка: ", requestData.clientNumber, " Клиент: ", requestData.clientName);
      addTabToUI(requestData.clientNumber, requestData.clientName, requestData.clientInn, requestData.clientBg, doc.id);
    });
  });
}

// Загрузка заявок при открытии страницы
window.onload = function() {
  loadRequests();
};
