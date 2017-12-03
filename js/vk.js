export class VK{
    static get_url(method, prms){
        if (!method) throw new Error('Вы не указали метод');
        let parameters  = prms || {};
        parameters.access_token = 'f37fde6f29d4899ef87aec4ba4d2cac3873a7506c37f557b6bb2714c348b2ee7bd3e5b6ac82dc418c95dc';
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
