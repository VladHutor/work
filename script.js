const banks = ['Абс', 'Альфа', 'Алеф', 'Влад', 'ГТ', 'ТСБ', 'ТКБ', 'Уралсиб', 'Уралфд', 'Солидарность', 'Реалист', 'МТС', 'Камком', 'Росбанк', 'ПСБ', 'Примсоц', 'Кубань', 'Казань', 'СГБ', 'СДМ', 'Левобережный', 'Солид'];

const stages = ['заявка', 'доработка', 'на подписании', 'в банке', 'на согласовании', 'заведена', 'отказ'];

let applications = [
    { number: '12345', name: 'ООО Компания', inn: '7701234567', bg: 'БГ1', banks: [] }
];

let currentApplicationIndex = 0;

function loadBankList() {
    const bankList = document.getElementById('bankList');
    bankList.innerHTML = '';
    banks.forEach(bank => {
        const li = document.createElement('li');
        li.textContent = bank;
        li.onclick = () => addBankToStage(bank, 'заявка');
        bankList.appendChild(li);
    });
}

function loadStageColumns() {
    const stageColumns = document.getElementById('stageColumns');
    stageColumns.innerHTML = '';
    stages.forEach(stage => {
        const column = document.createElement('div');
        column.className = 'stage-column';
        const title = document.createElement('h3');
        title.textContent = stage;
        column.appendChild(title);
        stageColumns.appendChild(column);
    });
}

function addBankToStage(bank, stage) {
    const stageColumn = [...document.getElementsByClassName('stage-column')].find(col => col.querySelector('h3').textContent === stage);
    const card = document.createElement('div');
    card.className = 'bank-card';
    card.textContent = bank;

    const application = applications[currentApplicationIndex];
    const bankDetails = {
        name: bank,
        stage: stage,
        bankApplicationNumber: '',
        commission: ''
    };
    application.banks.push(bankDetails);

    const bankAppNumberInput = document.createElement('input');
    bankAppNumberInput.placeholder = 'Номер заявки в банке';
    bankAppNumberInput.oninput = (e) => bankDetails.bankApplicationNumber = e.target.value;

    const commissionInput = document.createElement('input');
    commissionInput.placeholder = 'Комиссия';
    commissionInput.oninput = (e) => bankDetails.commission = e.target.value;

    card.appendChild(bankAppNumberInput);
    card.appendChild(commissionInput);
    stageColumn.appendChild(card);

    enableDragAndDrop(card, bankDetails);
}

function enableDragAndDrop(card, bankDetails) {
    card.draggable = true;
    card.ondragstart = (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(bankDetails));
    };

    document.querySelectorAll('.stage-column').forEach(column => {
        column.ondragover = (e) => {
            e.preventDefault();
        };

        column.ondrop = (e) => {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const newStage = column.querySelector('h3').textContent;
            moveBankToStage(data, newStage);
            column.appendChild(card);
        };
    });
}

function moveBankToStage(bankDetails, newStage) {
    const application = applications[currentApplicationIndex];
    const bank = application.banks.find(b => b.name === bankDetails.name);
    bank.stage = newStage;
}

function loadApplicationTabs() {
    const tabs = document.getElementById('tabs');
    tabs.innerHTML = '';

    applications.forEach((app, index) => {
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.textContent = `${app.number} - ${app.name} - ИНН: ${app.inn} - БГ: ${app.bg}`;
        tab.onclick = () => switchApplication(index);
        tabs.appendChild(tab);
    });
}

function switchApplication(index) {
    currentApplicationIndex = index;
    loadStageColumns();
    loadBanksForCurrentApplication();
}

function loadBanksForCurrentApplication() {
    const application = applications[currentApplicationIndex];
    application.banks.forEach(bank => {
        addBankToStage(bank.name, bank.stage);
    });
}

function addNewApplication() {
    const newApplication = {
        number: prompt('Введите номер заявки'),
        name: prompt('Введите название компании'),
        inn: prompt('Введите ИНН компании'),
        bg: prompt('Введите БГ'),
        banks: []
    };

    if (newApplication.number && newApplication.name && newApplication.inn && newApplication.bg) {
        applications.push(newApplication);
        loadApplicationTabs();
        switchApplication(applications.length - 1);
    } else {
        alert('Все поля должны быть заполнены!');
    }
}

function deleteCurrentApplication() {
    if (confirm('Вы уверены, что хотите удалить текущую заявку?')) {
        applications.splice(currentApplicationIndex, 1);
        if (applications.length > 0) {
            currentApplicationIndex = 0;
            loadApplicationTabs();
            switchApplication(0);
        } else {
            document.getElementById('stageColumns').innerHTML = '';
            document.getElementById('tabs').innerHTML = '';
        }
    }
}

window.onload = function() {
    loadBankList();
    loadStageColumns();
    loadApplicationTabs();

    document.getElementById('addApplication').onclick = addNewApplication;
    document.getElementById('deleteApplication').onclick = deleteCurrentApplication;
};
