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
	static get_now(){
		let now = new Date();
		return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${now.getDate()}/${now.getMonth()}/${now.getYear()}`
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
		if(uid && value!=undefined){
	        App.require_to_bd('update?', $.param({
	            table: 'Users',
	            field: 'subscription',
	            val: value,
	            wfield: 'id',
	            wval: uid
	        }));
			let val = value==0 ? 'подписали' : 'отписали';
			App.consoleLog(`Вы успешно ${val} пользователя id${uid}`);
		}
    }
	static add_user(uid,first_name,last_name) {
		if(uid){
			if(first_name == undefined || last_name == undefined) {
				first_name = null;
				last_name = null
			}
			App.require_to_bd('select?', $.param({
                table: 'Users',
                fields: 'id',
                wfield: 'id',
                wval: uid
            }), (xhr) => {
				if(JSON.parse(xhr.responseText).length!=0){
					//console.log('------' + JSON.parse(xhr.responseText).length);
					App.change_subscription(uid,'0');
				}else {
					App.require_to_bd('insert?', $.param({
						table: 'Users',
						field: 'id,first_name,last_name',
						val: [uid,first_name,last_name].join('","')
					}));
					App.consoleLog(`В базу дабвлен пользователь с id ${uid}`);
				}
			});
		}else App.consoleLog(`А где ID пользователя???`,'error');
	}
	static remove_user(uid) {
		if(uid){
			App.require_to_bd('select?', $.param({
                table: 'Users',
                fields: 'id',
                wfield: 'id',
                wval: uid
            }), (xhr) => {
				if(JSON.parse(xhr.responseText).length==0){
					App.consoleLog(`Пользователя с id${uid} нет в базе`,'error');
				}else {
					App.change_subscription(uid,'1');
				}
			});
		}else App.consoleLog(`А где ID пользователя???`,'error');
	}
	static consoleLog(text, style){
		$('#content').html($('#content').html() + `<p class='${style}'>${text}</p>`);
	}
	static to_table(arr){
		let str='';
		for(let i=0;i<arr.length;i++){
			str +='<tr>';
			for(let j in arr[i]){
				if(arr[i][j] == null) arr[i][j]='';
				if(j=='subscription' && arr[i][j]=='1') arr[i][j]='Отписан';
				if(j=='subscription' && arr[i][j]=='0') arr[i][j]='Подписан';
				if (j=='first_name') str += '<td>'+arr[i][j];
				else if (j=='last_name') str += ' '+arr[i][j]+'</td>';
				else str += '<td>'+arr[i][j]+'</td>';
			}
			str +=`
			<td>
				<button class="del" data-uid="${arr[i].id}">
					<i class="fa fa-times" aria-hidden="true"></i>
				</button>
			</td>
			<td>
				<button class="unsub" data-uid="${arr[i].id}">
					<i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
				</button>
			</td>
			<td>
				<button class="sub" data-uid="${arr[i].id}">
					<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
				</button>
			</td></tr>`;
		}
		return str;
	}
}
