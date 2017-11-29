import {VK} from './vk.js';
import {App} from './app.js';

export class Bot{
    static send_message(uid, text){
        VK.send_request('messages.send',{user_id: uid, message: text}, ()=>{App.consoleLog('Сообщение отправлено пользователю с id' + uid);});
    }
    static start_talking(){
        if (!this.myid){ //чтобы по нажатию на ту же кнопку можно было стопить
            this.myid = setInterval(()=>{ //сделать обработчик на случай если не удастся отправить сообщение
                VK.send_request('messages.getDialogs',{offset:0, count:53}, (data)=>{Bot.listen(data.response);});
            },1000);
            App.consoleLog('Бот заговорил','imp');
        }else {
            clearInterval(this.myid);
            this.myid = undefined;
            App.consoleLog('Бот замолчал','imp');
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

        					App.consoleLog(`Клиент написал: ${dialogs[i].body}<br>Бот ответил: ${str}`,'high');
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

                App.consoleLog(`Бот начал рассылку сообщений "${text}"`,'imp');
                let users = App.get_ids(xhr.responseText);//достает из полученной строки айдишники
                let timer = setInterval(() => {
                    Bot.send_message(users.shift(), text);
                    if(users.length == 0){
                        clearInterval(timer);
                        setTimeout(()=>{App.consoleLog(`Бот завершил рассылку сообщений`,"imp");},5000);
                    }
                },5000);
            });
        }else App.consoleLog('Бот не начнет рассылку, пока вы не введете сообщение','error');
    }
    static execute_command(uid,command){
        let str;
        switch (command) {
            case '/help':
                str =  `Вот список доступных команд:<br>
                    /help - вывести список доступных команд<br>/unsubscribe - отпиаться от рассылки<br>/subscribe - подписаться на рассылку<br>
                `;
                break;
            case '/unsubscribe':
                App.remove_user(uid);
                str = 'Вы успешно отписаны от рекламной рассылки';
                break;
            case '/subscribe':
                App.add_user(uid);
                str = 'Вы успешно подписаны на рекламную рассылку';
                break;
            default: str = 'Прости, но я не знаю такой команды, отправь /help чтобы получить весь список команд';
        }
        Bot.send_message(uid, str);
        App.consoleLog(`Клиент написал: ${command}<br>Бот ответил: ${str}`,'high');
        //`Клиент написал: ${command}<br>Бот ответил: ${str}`
    }
}
