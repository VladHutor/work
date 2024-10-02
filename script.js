const url = 'https://script.google.com/macros/s/AKfycybxp8HxakHB868yDoSi8H0ar3s1hIsDniil5fUgErF5amOWGabeLhPaXaiUqXBHWT5iQ/exec'; // Замените на ваш URL

async function saveApplication(application) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(application),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Ошибка при сохранении заявки');
        }

        const data = await response.text();
        console.log('Успешно сохранено:', data);
    } catch (error) {
        console.error('Ошибка при сохранении заявки:', error);
    }
}

// Пример вызова функции сохранения заявки
document.getElementById('addApplicationButton').onclick = async function() {
    const application = {
        number: '001', // Номер заявки
        name: 'Иван Иванов', // Имя клиента
        inn: '1234567890', // ИНН клиента
        bg: 'Гарантия', // Гарантия
        banks: ['Банк1', 'Банк2'], // Массив выбранных банков
        stage: 'На подписании' // Этап обработки
    };

    await saveApplication(application);
};
