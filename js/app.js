import {
	Bot
} from './bot.js';

export class App {
	static require_to_bd(url, params = '', callback) {
		let xhr = new XMLHttpRequest(); //поддержка запросов серверу
		xhr.open('GET', 'http://localhost:8080/' + url + params, true); //формирование запроса с значением урл
		xhr.onreadystatechange = function () { //когда всё будет готово к отправке реквеста
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) {
				alert('Ошибка ' + xhr.status + ': ' + xhr.statusText); // обработать ошибку
				return;
			}
			if (callback != undefined) callback(xhr); // обработать результат
			//console.log('GET is working');
		}
		xhr.send(null); //отправить запрос
	}
	static listen_comands(dialogs) {
		for (let i = 1; i < dialogs.length; i++)
			if (dialogs[i].out === 0 && dialogs[i].read_state === 0) {
				App.require_to_bd('select?', $.param({
					table: 'Dialogs',
					fields: 'answer',
					wfield: 'phrase',
					wval: dialogs[i].body
				}), (xhr) => {
                    let str = JSON.parse(xhr.responseText)[0];
                    str = str == undefined ? ':)' : str.answer;
					Bot.send_message(dialogs[i].uid, str);
					console.log('Бот ответил: ' + str);
				});
			}
	}
	static get_data() {
        App.require_to_bd('select?', $.param({
            table: 'Dialogs',
            fields: 'answer',
            wfield: 'phrase',
            wval: 'привет'//dialogs[i].body
        }), (xhr) => {
            //Bot.send_message(dialogs[i].uid, JSON.parse(xhr.responseText).answer);
            console.log(JSON.parse(xhr.responseText));
        });
	}
	static set_data(value) {
		App.require_to_bd('insert?', $.param({
			table: 'Dialogs',
			field: 'answer',
			value: value
		}));
	}
}
