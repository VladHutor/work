let tabs = [];
let activeTabId = null;

const db = firebase.firestore();

function renderTabs() {
  const tabsContainer = document.querySelector('.tabs');
  tabsContainer.innerHTML = '';
  tabs.forEach((tab) => {
    const tabElement = document.createElement('div');
    tabElement.classList.add('tab');
    if (tab.id === activeTabId) {
      tabElement.classList.add('active');
    }
    tabElement.textContent = tab.clientNumber;

    // Добавляем кнопку для удаления
    const deleteButton = document.createElement('button');
    deleteButton.onclick = () => deleteTab(tab.id);
    tabElement.appendChild(deleteButton);

    tabElement.onclick = () => switchTab(tab.id);
    tabsContainer.appendChild(tabElement);
  });
}

function addTab() {
  const tabId = Date.now().toString();
  const newTab = {
    id: tabId,
    clientNumber: 'Новая заявка',
    clientName: '',
    clientINN: '',
    clientBG: '',
    clientComments: ''
  };
  tabs.push(newTab);
  activeTabId = tabId;
  renderTabs();
  switchTab(tabId);
}

function switchTab(id) {
  activeTabId = id;
  const activeTab = tabs.find((tab) => tab.id === id);
  document.getElementById('clientNumber').value = activeTab.clientNumber;
  document.getElementById('clientName').value = activeTab.clientName;
  document.getElementById('clientINN').value = activeTab.clientINN;
  document.getElementById('clientBG').value = activeTab.clientBG;
  document.getElementById('clientComments').value = activeTab.clientComments;
  renderTabs();
}

function saveParams() {
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  activeTab.clientNumber = document.getElementById('clientNumber').value;
  activeTab.clientName = document.getElementById('clientName').value;
  activeTab.clientINN = document.getElementById('clientINN').value;
  activeTab.clientBG = document.getElementById('clientBG').value;
  activeTab.clientComments = document.getElementById('clientComments').value;

  // Сохраняем в Firebase
  db.collection('tabs').doc(activeTabId).set(activeTab)
    .then(() => console.log('Заявка сохранена с ID: ', activeTabId))
    .catch((error) => console.error('Ошибка при сохранении: ', error));

  renderTabs();
}

function deleteTab(id) {
  tabs = tabs.filter((tab) => tab.id !== id);
  db.collection('tabs').doc(id).delete()
    .then(() => console.log('Заявка удалена с ID: ', id))
    .catch((error) => console.error('Ошибка при удалении: ', error));
  if (tabs.length > 0) {
    switchTab(tabs[0].id);
  } else {
    activeTabId = null;
  }
  renderTabs();
}

// Восстанавливаем данные из Firebase при загрузке
db.collection('tabs').get().then((snapshot) => {
  snapshot.forEach((doc) => {
    tabs.push(doc.data());
  });
  if (tabs.length > 0) {
    activeTabId = tabs[0].id;
    renderTabs();
    switchTab(activeTabId);
  }
});

document.querySelector('.add-tab').addEventListener('click', addTab);
document.querySelector('.save-params').addEventListener('click', saveParams);
