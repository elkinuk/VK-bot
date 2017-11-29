import {App} from './app.js';

export class Admin{
    static add_answer(phrase, answer) {
		if(phrase && answer){
			App.require_to_bd('insert?', $.param({
				table: 'Dialogs',
				field: 'phrase, answer',
				val: [App.convert(phrase),answer].join('","')
			}));
			App.consoleLog(`Клиент:"${App.convert(phrase)}" - Бот:"${answer}"`,'high');
		}
	}
    static del_user(uid){
        if(uid){
            App.require_to_bd('delete?', $.param({
                table: 'Users',
                wfield: 'id',
                wval: uid
            }));
            App.consoleLog(`Пользователь с id${uid} удален`);
        }else App.consoleLog('А где ID???','error');
    }
    static refresh_users(el){
        App.require_to_bd('select?', $.param({
            table: 'Users',
            fields: '*'
        }), (xhr) => {
            //console.log(App.to_table(JSON.parse(xhr.responseText)));
            let html = App.to_table(JSON.parse(xhr.responseText));
            el.html(html);
        });
    }
}
