import {VK} from './vk.js';
import {App} from './app.js';
import {Admin} from './admin.js';
import {Sub} from './subsidary.js';

export class Bot{
    static send_message(uid, text){
        if(uid && text) VK.send_request('messages.send',{user_id: uid, message: text}, ()=>{Sub.consoleLog('Сообщение отправлено пользователю с id' + uid);});
        else Sub.consoleLog('Сообщение не может быть отправлено. Проверьте id','error');
    }
    static start_talking(){
        if (!this.myid){ //чтобы по нажатию на ту же кнопку можно было стопить
            this.myid = setInterval(()=>{ //сделать обработчик на случай если не удастся отправить сообщение
                VK.send_request('messages.getDialogs',{offset:0, count:53}, (data)=>{Bot.listen(data.response);});
            },1000);
            Sub.consoleLog('Бот заговорил','imp');
        }else {
            clearInterval(this.myid);
            this.myid = undefined;
            Sub.consoleLog('Бот замолчал','imp');
        }
    }
    static listen(dialogs) {
        if(dialogs && dialogs.lenght!=0){
    		for (let i = 1; i < dialogs.length; i++){
    			if (dialogs[i].out === 0 && dialogs[i].read_state === 0) {
                    if(dialogs[i].body[0] =='/') Bot.execute_command(dialogs[i].uid,dialogs[i].body);
                    else{
        				Sub.require_to_bd('select?', $.param({
        					table: 'Dialogs',
        					fields: 'answer',
        					wfield: 'phrase',
        					wval: Sub.convert(dialogs[i].body)
        				}), (xhr) => {
            					let answers = JSON.parse(xhr.responseText);
            					let j = Sub.randomNum(answers.length-1);
                                let str = answers[j]; //если вариантов ответа много, он выберет рандомно любой

                                str = str == undefined ? ':)' : str.answer;
            					Bot.send_message(dialogs[i].uid, str);

            					Sub.consoleLog(`Клиент написал: ${dialogs[i].body}<br>Бот ответил: ${str}`,'high');
        				    }
                        );
    			    }
    	        }
            }
        } else {
            Sub.consoleLog('Проверьте токен','error');
        }
    }
    static dispatch(text){
        if(text){
            Sub.require_to_bd('select?', $.param({
                table: 'Users',
                fields: 'id',
                wfield: 'subscription',
                wval: '0'
            }), (xhr) => {

                Sub.consoleLog(`Бот начал рассылку сообщений "${text}"`,'imp');
                let users = Sub.get_ids(xhr.responseText);//достает из полученной строки айдишники
                let timer = setInterval(() => {
                    Bot.send_message(users.shift(), text);
                    if(users.length == 0){
                        clearInterval(timer);
                        setTimeout(()=>{Sub.consoleLog(`Бот завершил рассылку сообщений`,"imp");},5000);
                    }
                },5000);
            });
        }else Sub.consoleLog('Бот не начнет рассылку, пока вы не введете сообщение','error');
    }
    static execute_command(uid,command){
        let str='';
        switch (command) {
            case '/help':
                str =  `Вот список доступных команд:<br>
                    /help - вывести список доступных команд<br>/unsubscribe - отпиаться от рассылки<br>/subscribe - подписаться на рассылку<br>/show - вывести информацию по заказам<br>/whoami - вывести информацию о вас<br>/repeat - повторить последний заказ
                `;
                break;
            case '/unsubscribe':
                App.remove_user(uid);
                str = 'Вы успешно отписаны от рекламной рассылки';
                break;
            case '/subscribe':
                name = Bot.get_name(uid,'','',App.add_user);
                str = 'Вы успешно подписаны на рекламную рассылку';
                break;
            case '/show':
                Bot.show_orders(uid);
                break;
            case '/whoami':
                Bot.show_me(uid);
                break;
            case '/repeat':
                Bot.repeat_order(uid);
                break;
            default: str = 'Прости, но я не знаю такой команды, отправь /help чтобы получить весь список команд';
        }
        if(str){
            Bot.send_message(uid, str);
            Sub.consoleLog(`Клиент написал: ${command}<br>Бот ответил: ${str}`,'high');
        }
    }
    static get_name(uid,phone,address,callback){
        VK.send_request('users.get',{user_ids: uid}, (data)=>{
            callback(uid,phone,address,data.response[0].first_name,data.response[0].last_name);
        });
    }
    static start_reacting(){
        if (!this.myid){ //чтобы по нажатию на ту же кнопку можно было стопить
            this.myid = setInterval(()=>{ //сделать обработчик на случай если не удастся отправить сообщение
                Bot.react_to_order();
            },1000);
            Sub.consoleLog('Бот отлавливает заказы','imp');
        }else {
            clearInterval(this.myid);
            this.myid = undefined;
            Sub.consoleLog('Бот перестал отлавливать заказы','imp');
        }
    }
    static react_to_order(){
        Sub.require_to_bd('getOrder?', $.param({}), (xhr) => {
			let result = JSON.parse(xhr.responseText);
            if (result[0] != undefined){
                for(let i = 0; i < result.length; i++){
                    //форматирование деталей
                    let details = result[i].details.replace(/<b>/gi,'').replace(/<\/b>/gi,'');
                    details = details.replace(/<br>/gi,'\n')
                    details = details.replace(/<small>/gi,'').replace(/<\/small>/gi,'');
                    details = details.replace(/<big>/gi,'').replace(/<\/big>/gi,'');
                    Sub.consoleLog('Бот ответил на заказ','high');
                    Bot.send_message(result[i].uid, `Привет ${result[i].name}, Ты сделал закакз<br>"${details}"`);
                    App.add_order(result[i].uid,'+375'+result[i].phone,result[i].address,details);
                    Admin.refresh_orders($('#orders_data'));
                }
            }
		});
	}
    static show_orders(uid){
        Sub.require_to_bd('select?', $.param({
            table: 'Orders',
            fields: 'date,details',
            wfield: 'uid',
            wval: uid
        }), (xhr) => {
            let result = JSON.parse(xhr.responseText);
            let text = '';
            for(let i=0;i<result.length;i++){
                text += `${result[i].date}: ${result[i].details}<br>`;
            }
            Bot.send_message(uid, text);
            Sub.consoleLog(`Клиент написал: /show<br>Бот ответил: ${text}`,'high');
        });
    }
    static show_me(uid){
        Sub.require_to_bd('select?', $.param({
            table: 'Users',
            fields: '*',
            wfield: 'id',
            wval: uid
        }), (xhr) => {
            let result = JSON.parse(xhr.responseText);
            let text = '';
            for(let i=0;i<result.length;i++){
                text += `${result[i].first_name} ${result[i].last_name}<br>Телефон: ${result[i].phone}<br>Адрес: ${result[i].address}`;
            }
            Bot.send_message(uid, text);
            Sub.consoleLog(`Клиент написал: /show<br>Бот ответил: ${text}`,'high');
        });
    }
    static repeat_order(uid){
        Sub.require_to_bd('select?', $.param({
            table: 'Orders',
            fields: '*',
            wfield: 'uid',
            wval: uid
        }), (xhr) => {
            let result = JSON.parse(xhr.responseText);
            let message = '';
            if(result.length==0){
                message = 'У вас еще не было заказов, чтобы их повторять';
            }else{
                result = result[result.length-1];
                App.add_order(result.uid,result.phone,result.address,result.details);
                message = 'Последний заказ повторен';
                Sub.consoleLog(`Заказ пользователя id${uid} повторен`,'high');
            }
            Bot.send_message(uid, message);
            Sub.consoleLog(`Клиент написал: /repeat<br>Бот ответил: ${message}`,'high');
            Admin.refresh_orders($('#orders_data'));
        });
    }
}
