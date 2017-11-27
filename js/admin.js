import {App} from './app.js';

export class Admin{
    static add_answer(phrase, answer) {
		if(phrase && answer){
			App.require_to_bd('insert?', $.param({
				table: 'Dialogs',
				field: 'phrase, answer',
				val: [App.convert(phrase),answer].join('","')
			}));
			console.log(`Клиент:"${App.convert(phrase)}" - Бот:"${answer}"`);
		}
	}
}
