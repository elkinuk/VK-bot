import {Sub} from './subsidary.js';
import {Admin} from './admin.js';
import {Bot} from './bot.js';
export class App {
	static change_subscription(uid,value){
		if(uid && value!=undefined){
	        Sub.require_to_bd('update?', $.param({
	            table: 'Users',
	            field: 'subscription',
	            val: value,
	            wfield: 'id',
	            wval: uid
	        }));
			Admin.refresh_users($('#users_data'));
			let val = value==0 ? 'подписали' : 'отписали';
			Sub.consoleLog(`Вы успешно ${val} пользователя id${uid}`);
		}
    }
	static check_user(uid, sucsess, fail){
		Sub.require_to_bd('select?', $.param({
			table: 'Users',
			fields: 'id',
			wfield: 'id',
			wval: uid
		}), (xhr) => {
			if(JSON.parse(xhr.responseText).length!=0){
				sucsess();
			}else {
				fail();
			}
		});
	}
	static add_user(uid,phone,address,first_name,last_name) {
		if(uid){
			if(first_name == undefined || last_name == undefined) {
				first_name = null;
				last_name = null
			}
			if(phone == undefined || phone == '') {
				phone = null;
			}
			if(address == undefined || address == '') {
				address = null;
			}
			App.check_user(uid,()=>{
				App.change_subscription(uid,'0');
			}, ()=>{
				Sub.require_to_bd('insert?', $.param({
					table: 'Users',
					field: 'id,first_name,last_name,phone,address',
					val: [uid,first_name,last_name,phone,address].join('","')
				}));
				Sub.consoleLog(`В базу дабвлен пользователь с id ${uid}`);
				Admin.refresh_users($('#users_data'));
			});
		}else Sub.consoleLog(`А где ID пользователя???`,'error');
	}
	static remove_user(uid) {
		if(uid){
			Sub.require_to_bd('select?', $.param({
                table: 'Users',
                fields: 'id',
                wfield: 'id',
                wval: uid
            }), (xhr) => {
				if(JSON.parse(xhr.responseText).length==0){
					Sub.consoleLog(`Пользователя с id${uid} нет в базе`,'error');
				}else {
					App.change_subscription(uid,'1');
				}
			});
		}else Sub.consoleLog(`А где ID пользователя???`,'error');
	}
	static add_order(uid,phone,address,details){
		if(uid){
			App.check_user(uid, ()=>{
				Sub.require_to_bd('update?', $.param({
		            table: 'Users',
		            field: 'phone',
		            val: phone,
		            wfield: 'id',
		            wval: uid
		        }));
				Sub.require_to_bd('update?', $.param({
		            table: 'Users',
		            field: 'address',
		            val: address,
		            wfield: 'id',
		            wval: uid
		        }));
				Admin.refresh_users($('#users_data'));
			}, ()=>{ Bot.get_name(uid,phone,address,App.add_user) });
			Sub.require_to_bd('insert?', $.param({
				table: 'Orders',
				field: 'uid,date,details',
				val: [uid,Sub.get_now(),details].join('","')
			}));
			setTimeout(()=>{App.have_order(uid,'1');},1000);
		}else Sub.consoleLog(`А где ID пользователя???`,'error');
	}
	static have_order(uid,bool){
        Sub.require_to_bd('update?', $.param({
            table: 'Users',
            field: 'have_orders',
            val: bool,
            wfield: 'id',
            wval: uid
        }));
    }
}
