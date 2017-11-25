import {Bot} from './bot.js'
import {App} from './app.js'

$('#talk').on('click', Bot.start_talking);

$('#add_answer').on('click', function(){
    App.add_answer($('#phrase').val(),$('#answer').val());
});

console.log('Server running on port 8080');
