// Вставляем URL веб-приложения из Google Apps Script
const apiUrl = 'https://script.google.com/macros/s/AKfycbyxp8HxakHB688yDOsi8H0ar3s1hslDnii5CfUgErF5amOWGabeLhPaXaiUqXBHTWt5iQ/exec';

// Функция для загрузки всех заявок с Google Таблицы
async function fetchApplications() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('Полученные заявки:', data);
        updateBoard(data); // Обновляем доску заявок на основе полученных данных
    } catch (error) {
        console.error('Ошибка при получении заявок:', error);
    }
}

// Функция для сохранения новой заявки или обновления существующей
async function saveApplication(application) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(application),
        });
        const result = await response.text();
        console.log('Результат сохранения:', result);
    } catch (error) {
        console.error('Ошибка при сохранении заявки:', error);
    }
}

// Функция для обновления доски заявок на основе полученных данных
function updateBoard(data) {
    // Очищаем текущие элементы на доске
    clearBoard();

    // Проходим по каждой заявке и добавляем ее на доску
    data.forEach(application => {
        const { number, name, inn, bg, banks, stage } = application;
        
        // Создаем элемент заявки и заполняем его данными
        addApplicationToBoard(number, name, inn, bg, banks, stage);
    });
}

// Функция для очистки доски перед обновлением
function clearBoard() {
    const board = document.getElementById('board'); // Элемент доски
    board.innerHTML = ''; // Очищаем содержимое
}

// Функция для добавления заявки на доску
function addApplicationToBoard(number, name, inn, bg, banks, stage) {
    const board = document.getElementById('board');

    // Создаем новый элемент заявки
    const applicationDiv = document.createElement('div');
    applicationDiv.className = 'application';

    // Наполняем элемент заявки данными
    applicationDiv.innerHTML = `
        <h3>Заявка #${number}</h3>
        <p>Название: ${name}</p>
        <p>ИНН: ${inn}</p>
        <p>БГ: ${bg}</p>
        <p>Банки: ${banks.join(', ')}</p>
        <p>Этап: ${stage}</p>
    `;

    // Добавляем элемент на доску
    board.appendChild(applicationDiv);
}

// Пример использования функций
const exampleApplication = {
    number: '001',
    name: 'ООО Ромашка',
    inn: '1234567890',
    bg: 'БГ001',
    banks: ['Альфа', 'ВТБ'],
    stage: 'заявка'
};

// Сохраняем заявку (это можно вызвать при нажатии на кнопку создания заявки)
saveApplication(exampleApplication);

// Загружаем заявки при загрузке страницы
window.onload = function () {
    fetchApplications(); // Загружаем и отображаем заявки
};
