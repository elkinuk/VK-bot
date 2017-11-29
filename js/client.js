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
$('#subscribe_user').on('click', function(){
    App.add_user($('#user_id').val(),'0');
    $('#user_id').val('');
    setTimeout(()=>{Admin.refresh_users($('#users_data'));},500);
});
$('#unsubscribe_user').on('click', function(){
    App.remove_user($('#user_id').val(),'1');
    $('#user_id').val('');
    setTimeout(()=>{Admin.refresh_users($('#users_data'));},500);
});
$('#refresh_users').on('click', function(){
    Admin.refresh_users($('#users_data'));
});

$('table').on('click','.del',function(){
    Admin.del_user($(this).attr('data-uid'));
    setTimeout(()=>{Admin.refresh_users($('#users_data'));},500);
})
App.consoleLog('Server running on port 8000');
