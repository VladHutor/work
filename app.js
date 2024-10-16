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
const db = firebase.firestore();

let activeRequestId = null;

// Create new request
document.getElementById('create-request-btn').addEventListener('click', () => {
  const requestData = {
    clientNumber: '',
    clientName: '',
    clientInn: '',
    clientBg: '',
    clientComment: ''
  };

  db.collection("requests").add(requestData).then((docRef) => {
    addTabToUI('', '', '', '', docRef.id);
  });
});

// Save current request
function saveCurrentRequest() {
  const clientNumber = document.getElementById('client-number').value;
  const clientName = document.getElementById('client-name').value;
  const clientInn = document.getElementById('client-inn').value;
  const clientBg = document.getElementById('client-bg').value;
  const clientComment = document.getElementById('client-comment').value;

  if (activeRequestId) {
    db.collection("requests").doc(activeRequestId).update({
      clientNumber: clientNumber,
      clientName: clientName,
      clientInn: clientInn,
      clientBg: clientBg,
      clientComment: clientComment
    });
  }
}

// Add a new tab for the request
function addTabToUI(clientNumber, clientName, clientInn, clientBg, requestId) {
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.innerHTML = `${clientNumber}`;

  // Add delete button to each tab
  const deleteButton = document.createElement('button');
  deleteButton.addEventListener('click', (e) => {
    e.stopPropagation();
    db.collection("requests").doc(requestId).delete().then(() => {
      tab.remove();
      clearInputFields();
    });
  });
  tab.appendChild(deleteButton);

  tab.addEventListener('click', () => {
    setActiveTab(tab, requestId);
  });

  document.getElementById('tabs-container').appendChild(tab);
}

// Set active tab and load request data
function setActiveTab(tab, requestId) {
  const tabs = document.getElementsByClassName('tab');
  for (let t of tabs) {
    t.classList.remove('active');
  }
  tab.classList.add('active');
  activeRequestId = requestId;

  db.collection("requests").doc(requestId).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      document.getElementById('client-number').value = data.clientNumber;
      document.getElementById('client-name').value = data.clientName;
      document.getElementById('client-inn').value = data.clientInn;
      document.getElementById('client-bg').value = data.clientBg;
      document.getElementById('client-comment').value = data.clientComment || '';
    }
  });
}

// Clear input fields
function clearInputFields() {
  document.getElementById('client-number').value = '';
  document.getElementById('client-name').value = '';
  document.getElementById('client-inn').value = '';
  document.getElementById('client-bg').value = '';
  document.getElementById('client-comment').value = '';
}

// Load requests when the page is loaded
window.onload = function() {
  db.collection("requests").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const requestData = doc.data();
      addTabToUI(requestData.clientNumber, requestData.clientName, requestData.clientInn, requestData.clientBg, doc.id);
    });
  });
};
