export class VK{
    static get_url(method, prms){
        if (!method) throw new Error('Вы не указали метод');
        let parameters  = prms || {};
        parameters.access_token = '47ac5415567702bc352dcfc8fd54114a28e2b32d9c06c3f2d9b82b443b92236abde1fc7551a740e0842e7';
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
