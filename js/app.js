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
	static randomNum(max) {
	    return Math.floor(0 + Math.random() * (max + 1 - 0));
  	}
	static convert(str){
		str = str.toLowerCase().replace(/\s/g, '').replace(/[.,\/#!?$%\^&\*;:№"'\[\]@\\{}=\-_`~()]/g,'');
		str = str.split('').filter(function(item,i,arr) {
  			return item != arr[i+1];
		}).join('');
		return str;
	}
	static get_ids(str){
		return str.replace(/["'\[\]{}:]/g,'').replace(/id/g,'').split(',');
	}
}
