export class VK{
    static get_url(method, prms){
        if (!method) throw new Error('Вы не указали метод');
        let parameters  = prms || {};
        parameters.access_token = '';
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
