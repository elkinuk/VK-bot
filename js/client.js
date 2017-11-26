import {Bot} from './bot.js'
import {Admin} from './admin.js'

$('#talk').on('click', Bot.start_talking);

$('#dispatch').on('click',function(){
     Bot.dispatch($('#dispatch_phrase').val());
});

$('#add_answer').on('click', function(){
    Admin.add_answer($('#phrase').val(),$('#answer').val());
    $('#phrase').val('');
    $('#answer').val('');
});

console.log('Server running on port 8000');
