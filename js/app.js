export class App{
    static require_to_bd(url, params = '', callback) {
        let xhr = new XMLHttpRequest(); //поддержка запросов серверу
        xhr.open('GET', 'http://localhost:8080/'+url+params, true); //формирование запроса с значением урл
        xhr.onreadystatechange = function () { //когда всё будет готово к отправке реквеста
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);// обработать ошибку
                return;
            }
            callback(xhr);// обработать результат
            console.log('GET is working');
        }
        xhr.send(null); //отправить запрос
    }
    
    static listen_comand(comand){
        switch (comand) {
            case '/fuckyou':
                return 'fuck yourself';
            case 'Привет':
                return 'Привет';
            case 'Как дела?':
                return 'Хорошо, а у вас?';
            case 'Хорошо':
                return 'Клево';
            default: return ':)';
        }
    }
}
