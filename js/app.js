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
			} else if (callback != undefined) callback(xhr); // обработать результат
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
					wval: App.convert(dialogs[i].body)
				}), (xhr) => {
                    let str = JSON.parse(xhr.responseText)[0];
                    str = str == undefined ? ':)' : str.answer;
					Bot.send_message(dialogs[i].uid, str);
					console.log('Бот ответил: ' + str);
				});
			}
	}
	static add_answer(phrase, answer) {
		if(phrase && answer){
			App.require_to_bd('insert?', $.param({
				table: 'Dialogs',
				field: 'phrase, answer',
				value: [App.convert(phrase),answer].join('","')
			}));
			console.log(`Клиент:"${phrase}" - Бот:"${answer}"`);
		}
	}
	static convert(str){
		str = str.toLowerCase().replace(/\s/g, '').replace(/[.,\/#!?$%\^&\*;:№"'\[\]@\\{}=\-_`~()]/g,'')
		console.log(str);
		return str;
	}
}
