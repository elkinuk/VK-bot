export class Sub{
    static require_to_bd(url, params = '', callback) {
        let xhr = new XMLHttpRequest(); //поддержка запросов серверу
        xhr.open('GET', 'http://localhost:8080/' + url + params, true); //формирование запроса с значением урл
        xhr.onreadystatechange = function () { //когда всё будет готово к отправке реквеста
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                alert('Ошибка ' + xhr.status + ': ' + xhr.statusText); // обработать ошибку
                return;
            } else if (callback != undefined) callback(xhr); // обработать результат
        }
        xhr.send(null); //отправить запрос
    }
    static randomNum(max) {
        return Math.floor(0 + Math.random() * (max + 1 - 0));
    }
    static get_now(){
        let now = new Date();
        return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${now.getDate()}/${now.getMonth()}/${now.getYear()-100}`
    }
    static convert(str){
        str = str.toLowerCase().replace(/\s/g, '').replace(/[.,\/#!?$%\^&\*;:№"'\[\]@\\{}=\-_`~()]/g,'');
        str = str.split('').filter(function(item,i,arr) {
            return item != arr[i+1];
        }).join('');
        return str;
    }
    static get_ids(str){
        return str.replace(/["'\[\]{}:]/g,'').replace(/id/g,'').split(',');
    }
    static users_to_table(arr){
        let str='';
        for(let i=0;i<arr.length;i++){
            str +='<tr>';
            for(let j in arr[i]){
                if(arr[i][j] == null) arr[i][j]='';
                if(j=='subscription' && arr[i][j]=='1') arr[i][j]='Отписан';
                if(j=='subscription' && arr[i][j]=='0') arr[i][j]='Подписан';
                if (j=='first_name') str += '<td>'+arr[i][j];
                else if (j=='last_name') str += ' '+arr[i][j]+'</td>';
                else if (j=='have_orders') break;
                else str += '<td>'+arr[i][j]+'</td>';
            }
            str +=`
            <td>
                <button class="del del_user" data-uid="${arr[i].id}">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </td>
            <td>
                <button class="unsub" data-uid="${arr[i].id}">
                    <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                </button>
            </td>
            <td>
                <button class="sub" data-uid="${arr[i].id}">
                    <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                </button>
            </td></tr>`;
        }
        return str;
    }
    static orders_to_table(orders,users){
        for(let i=0;i<orders.length;i++){
            for(let j=0;j<users.length;j++){
                if (orders[i].uid == users[j].id){
                    orders[i].uid = users[j].first_name +' '+users[j].last_name;
                    break;
                }
            }
        }
        let str='';
        for(let i = 0;i<orders.length;i++){
            str +='<tr>';
            for(let j in orders[i]){
                 str += '<td>'+orders[i][j]+'</td>';
            }
            str +=`<td>
                <button class="del del_order" data-id="${orders[i].id}">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </td></tr>`;
        }
        return str;
    }
    static consoleLog(text, style){
        style = style || ' ';
        $('#content').html($('#content').html() + `<p class='${style}'>${text}</p>`);
    }
}
