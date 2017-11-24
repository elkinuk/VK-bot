export class VK{
    static get_url(method, prms){
        if (!method) throw new Error('Вы не указали метод');
        let parameters  = prms || {};
        parameters.access_token = '6b927c4ec84d8e27ca0086c1be6c2e8edd25f42067e641ea44de14cf64266697ab5be2b683eeab9e8654d';
        return `https://api.vk.com/method/${method}\?${$.param(parameters)}`; // запрос к vk.api
    }

    static send_request(method, prms, callback){
        $.ajax({
            url : VK.get_url(method, prms),
            method: 'GET',
            context: document.body,
            dataType: 'JSONP',
            success: callback
        });
    }
}
