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
	static change_subscription(uid,value){
        App.require_to_bd('update?', $.param({
            table: 'Users',
            field: 'subscription',
            val: value,
            wfield: 'id',
            wval: uid
        }));
		let val = value==0 ? 'подписали' : 'отписали';
		console.log(`Вы успешно ${val} пользователя id${uid}`);
    }
	static add_user(uid) {
		if(uid){
			App.require_to_bd('insert?', $.param({
				table: 'Users',
				field: 'id',
				val: uid
			}));
			console.log(`В базу дабвлен пользователь с id ${uid}`);
		}
	}
}
