import {Bot} from './bot.js'
import {App} from './app.js'

$('#talk').on('click', Bot.start_talking);
$('#set').on('click', function(){App.set_data('11');});
$('#get').on('click', function(){App.get_data();});


console.log('Server running on port 8080');
