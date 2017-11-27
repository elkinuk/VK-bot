import {VK} from './vk.js';
import {App} from './app.js';

export class Bot{
    static send_message(uid, text){
        VK.send_request('messages.send',{user_id: uid, message: text}, ()=>{console.log('Сообщение отправлено пользователю с id' + uid);});
    }
    static start_talking(){
        if (!this.myid){ //чтобы по нажатию на ту же кнопку можно было стопить
            this.myid = setInterval(()=>{ //сделать обработчик на случай если не удастся отправить сообщение
                VK.send_request('messages.getDialogs',{offset:0, count:53}, (data)=>{Bot.listen(data.response);});
            },1000);
            console.log('------------------Бот заговорил');
        }else {
            clearInterval(this.myid);
            this.myid = undefined;
            console.log('------------------Бот замолчал');
        }
    }
    static listen(dialogs) {
		for (let i = 1; i < dialogs.length; i++){
			if (dialogs[i].out === 0 && dialogs[i].read_state === 0) {
                if(dialogs[i].body[0] =='/') Bot.execute_command(dialogs[i].uid,dialogs[i].body);
                else{
    				App.require_to_bd('select?', $.param({
    					table: 'Dialogs',
    					fields: 'answer',
    					wfield: 'phrase',
    					wval: App.convert(dialogs[i].body)
    				}), (xhr) => {
        					let answers = JSON.parse(xhr.responseText);
        					let j = App.randomNum(answers.length-1);
                            let str = answers[j]; //если вариантов ответа много, он выберет рандомно любой

                            str = str == undefined ? ':)' : str.answer;
        					Bot.send_message(dialogs[i].uid, str);

        					console.log('Клиент написал: ' + dialogs[i].body + '\nБот ответил: ' + str);
    				    }
                    );
			    }
	        }
        }
    }
    static dispatch(text){
        if(text != 0){
            App.require_to_bd('select?', $.param({
                table: 'Users',
                fields: 'id',
                wfield: 'subscription',
                wval: '0'
            }), (xhr) => {

                console.log(`------------------Бот начал рассылку сообщений "${text}"`);
                let users = App.get_ids(xhr.responseText);//достает из полученной строки айдишники
                let timer = setInterval(() => {
                    Bot.send_message(users.shift(), text);
                    if(users.length == 0){
                        clearInterval(timer);
                        setTimeout('console.log(`------------------Бот завершил рассылку сообщений`);',5000);
                    }
                },5000);
            });
        }else console.log('Бот не начнет рассылку, пока вы не введете сообщение');
    }
    static execute_command(uid,command){
        let str;
        switch (command) {
            case '/help':
                str =  `Вот список доступных команд:\n
                    /help - вывести список доступных команд
                    /unsubscribe - отпиаться от рассылки
                    /subscribe - подписаться на рассылку
                `;
                break;
            case '/unsubscribe':
                Bot.change_subscription(uid,'1');
                str = 'Вы успешно отписаны от рекламной рассылки';
                break;
            case '/subscribe':
                Bot.change_subscription(uid,'0');
                str = 'Вы успешно подписаны на рекламную рассылку';
                break;
            default: str = 'Прости, но я не знаю такой команды, отправь /help чтобы получить весь список команд';
        }
        Bot.send_message(uid, str);
        console.log('Клиент написал: ' + command + '\nБот ответил: ' + str);
    }
    static change_subscription(uid,value){
        App.require_to_bd('update?', $.param({
            table: 'Users',
            field: 'subscription',
            val: value,
            wfield: 'id',
            wval: uid
        }));
    }
}
