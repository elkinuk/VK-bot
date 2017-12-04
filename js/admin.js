import {Sub} from './subsidary.js';
import {App} from './app.js';

export class Admin{
    static add_answer(phrase, answer) {
        if(phrase && answer){
			Sub.require_to_bd('insert?', $.param({
				table: 'Dialogs',
				field: 'phrase, answer',
				val: [Sub.convert(phrase),answer].join('","')
			}));
			Sub.consoleLog(`Вы добавили сочетание<br>Клиент:"${Sub.convert(phrase)}"<br>Бот:"${answer}"`,'high');
		}
	}
    static del_user(uid){
        if(uid){
            Sub.require_to_bd('delete?', $.param({
                table: 'Users',
                wfield: 'id',
                wval: uid
            }));
            Admin.refresh_users($('#users_data'));
            Sub.consoleLog(`Пользователь с id${uid} удален`);
            Sub.require_to_bd('select?', $.param({
                table: 'Orders',
                fields: 'id',
                wfield: 'uid',
    			wval: uid
            }), (xhr) => {
                let orders = JSON.parse(xhr.responseText);
                for(let i=0;i<orders.length;i++){
                    Admin.del_order(orders[i].id);
                }
            });
        }else Sub.consoleLog('А где ID???','error');
    }
    static del_order(id){
        if(id){
            Sub.require_to_bd('select?', $.param({
                table: 'Orders',
                fields: 'uid',
                wfield: 'id',
    			wval: id
            }), (xhr) => {
                let uid = JSON.parse(xhr.responseText)[0].uid;
                Sub.require_to_bd('select?', $.param({
                    table: 'Orders',
                    fields: 'id',
                    wfield: 'uid',
        			wval: uid
                }), (xhr) => {
                    if(JSON.parse(xhr.responseText).length == 0){
                        App.have_order(uid,'0');
                    }
                });
            });
            Sub.require_to_bd('delete?', $.param({
                table: 'Orders',
                wfield: 'id',
                wval: id
            }));
            Admin.refresh_orders($('#orders_data'));
            Sub.consoleLog(`Заказ с id${id} удален`);
        }else Sub.consoleLog('А где ID???','error');
    }
    static refresh_users(el){
        Sub.require_to_bd('select?', $.param({
            table: 'Users',
            fields: '*'
        }), (xhr) => {
            let html = Sub.users_to_table(JSON.parse(xhr.responseText));
            el.html(html);
        });
        Sub.consoleLog('Таблица пользователей обновлена в ' + Sub.get_now(),'imp');
    }
    static refresh_orders(el){
        Sub.require_to_bd('select?', $.param({
            table: 'Orders',
            fields: '*'
        }), (xhr) => {
            let orders = JSON.parse(xhr.responseText);
            Sub.require_to_bd('select?', $.param({
                table: 'Users',
                fields: 'id,first_name,last_name',
                wfield: 'have_orders',
    			wval: '1'
            }), (xhr) => {
                let html = Sub.orders_to_table(orders,JSON.parse(xhr.responseText));
                el.html(html);
            });
        });
        Sub.consoleLog('Таблица заказов обновлена в ' + Sub.get_now(),'imp');
    }
    static refresh_data(bool){
        bool ?
        setTimeout(()=>{Admin.refresh_users($('#users_data'));Admin.refresh_orders($('#orders_data'));},500)
        : Admin.refresh_users($('#users_data'));Admin.refresh_orders($('#orders_data'));
    }
}
