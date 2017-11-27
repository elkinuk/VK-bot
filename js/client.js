import {Bot} from './bot.js'
import {App} from './app.js'
import {Admin} from './admin.js'

$('#talk').on('click', Bot.start_talking);

$('#dispatch').on('click',function(){
     Bot.dispatch($('#dispatch_phrase').val());
     $('#dispatch_phrase').val('');
});

$('#add_answer').on('click', function(){
    Admin.add_answer($('#phrase').val(),$('#answer').val());
    $('#phrase').val('');
    $('#answer').val('');
});
$('#add_user').on('click', function(){
    App.add_user($('#user_id').val());
    $('#user_id').val('');
});
$('#subscribe_user').on('click', function(){
    App.change_subscription($('#user_id').val(),'0');
    $('#user_id').val('');
});
$('#unsubscribe_user').on('click', function(){
    App.change_subscription($('#user_id').val(),'1');
    $('#user_id').val('');
});
console.log('Server running on port 8000');
