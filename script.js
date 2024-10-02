const banks = ['Абс', 'Альфа', 'Алеф', 'Влад', 'ГТ', 'ТСБ', 'ТКБ', 'Уралсиб', 'Уралфд', 'Солидарность', 'Реалист', 'МТС', 'Камком', 'Росбанк', 'ПСБ', 'Примсоц', 'Кубань', 'Казань', 'СГБ', 'СДМ', 'Левобережный', 'Солид'];

const stages = ['заявка', 'доработка', 'на подписании', 'в банке', 'на согласовании', 'заведена', 'отказ'];

const applications = [
  { number: '12345', name: 'ООО Компания', inn: '7701234567', bg: 'БГ1', banks: [] },
  { number: '54321', name: 'ООО Вторая компания', inn: '7707654321', bg: 'БГ2', banks: [] }
];

function loadBankList() {
  const bankList = document.getElementById('bankList');
  banks.forEach(bank => {
    const li = document.createElement('li');
    li.textContent = bank;
    li.onclick = () => addBankToStage(bank, 'заявка');
    bankList.appendChild(li);
  });
}

function loadStageColumns() {
  const stageColumns = document.getElementById('stageColumns');
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
  stageColumn.appendChild(card);
}

function loadApplication
