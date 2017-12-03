import {Bot} from './bot.js'
import {App} from './app.js'
import {Admin} from './admin.js'
import {Sub} from './subsidary.js';

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
    App.add_user($('#user_id').val());
    $('#user_id').val('');
});
$('#refresh_users').on('click', function(){
    Admin.refresh_users($('#users_data'));
});
$('#refresh_orders').on('click', function(){
    Admin.refresh_orders($('#orders_data'));
});
$('table').on('click','.del_user',function(){
    Admin.del_user($(this).attr('data-uid'));
})
$('table').on('click','.del_order',function(){
    Admin.del_order($(this).attr('data-id'));
})
$('table').on('click','.unsub',function(){
    App.remove_user($(this).attr('data-uid'));
})
$('table').on('click','.sub',function(){
    App.change_subscription($(this).attr('data-uid'),'0');
})
$('#clean_cons').on('click',function(){
     $('#content').html('');
});
$('#get_orders').on('click',Bot.start_reacting);

window.onload = function(){
    Sub.consoleLog('Server running on port 8000');
    Admin.refresh_data(false);
}
