function require_to_site(url, params = '', callback) {
		let xhr = new XMLHttpRequest(); //поддержка запросов серверу
		xhr.open('GET', 'http://localhost:8080/' + url + params, true); //формирование запроса с значением урл
		xhr.onreadystatechange = function () { //когда всё будет готово к отправке реквеста
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) {
				//alert('Ошибка ' + xhr.status + ': ' + xhr.statusText); // обработать ошибку
				return;
			} else if (callback != undefined) callback(xhr); // обработать результат
		}
		xhr.send(null); //отправить запрос
	}

$('#send_out').on('click',()=>{
    if($('#name_field').val()==0) alert('Заполните поле Имя');
    else {
        if($('#link_field').val()!=0){
			let link = $('#link_field').val();
			if(/https:\/\/vk\.com\/id/gi.test(link) || /vk\.com\/id/gi.test(link)){
				let uid = link.replace(/vk\.com\/id/,'').replace(/https:\/\//,'');
				if($('#phone_field').val()!=0){
					let phone = $('#phone_field').val().replace(/^[ ]+/g, '');
					let details = $('#result').html().replace(/<b>/gi,'').replace(/<\/b>/gi,'');
                    details = details.replace(/<br>/gi,'\n')
                    details = details.replace(/<small>/gi,'').replace(/<\/small>/gi,'');
                    details = details.replace(/<big>/gi,'').replace(/<\/big>/gi,'');
					if (/\([\d]{2}\)[\d]{3}[\d]{2}[\d]{2}$/.test(phone)){
							require_to_site('setOrder?', $.param({
				            name: $('#name_field').val(),
			                uid: uid,//https://vk.com/id59502817
							phone: phone,
			                details: details
				        }));
						alert('Наш бот уже написал вам, проверьте! (на всякий случай мы отправили вам письмо и на почту)');
					}else alert('Вы неверно ввели номер телефона');
				}else alert('Вы не ввели номер телефона');
			} else alert('Проверьте правильность введенной ссылки');
        }else if( $('#email_field').val() != 0){
			regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(regex.test($('#email_field').val()) == true) alert('Мы получили ваш заказ, ожидайте связи по почте с нашим оператором');
			else alert('Вы неверно ввели email');
        } else alert('Заполните либо поле со ссылкой либо email, чтобы мы могли с вами связаться');
    }
})

function count_price(){
        $.getJSON('data.json', function(json) {
            let height = parseFloat($('#letter-height').val().replace(/,/,'.'));
            let length = $('#phrase').val().length;
            let square = parseFloat($('#box-square').val().replace(/,/,'.'));
            let select_lt = $('#select_letter_type')[0];
            let select_bt = $('#select_box_type')[0];
            let lett_cost = json.letters[select_lt.options[select_lt.selectedIndex].innerHTML];
            let box_cost = json.box[select_bt.options[select_bt.selectedIndex].innerHTML];
            let back_h = parseFloat($('#back-haight').val().replace(/,/,'.'));
            let back_w = parseFloat($('#back-width').val().replace(/,/,'.'));
            let result_count;
            if (length != 0){
                $('#result').html('<b>Вы выбрали тип букв</b> - ' + select_lt.options[select_lt.selectedIndex].innerHTML);
                if( !isNaN(square) && $('#select_letter_type')[0].options[$('#select_letter_type')[0].selectedIndex].innerHTML == 'Световой короб'){
                    $('#result').html('<b>Вы выбрали тип короба</b> - ' + select_bt.options[select_bt.selectedIndex].innerHTML);
                    $('#result').append(' длиной '+square+'м.п., по ' + box_cost + 'p. за м.п., <br><b>Цена:</b> ' +square*box_cost+'p.');
                    result_count = square*box_cost;
                } else if (!(isNaN(height)) && height <=100){
                    $('#result').append(', по ' + lett_cost + 'p. за букву ('+length+'шт.), <br><b>Цена:</b> ' +lett_cost*length*height+'p.');
                    result_count = lett_cost*length*height;
                } else $('#result').html('<span>Проверьте, все ли поля заполнены, и заполнены ли они правильно</span>');
            } else $('#result').html('<span>Проверьте, все ли поля заполнены, и заполнены ли они правильно</span>');
            if (result_count != undefined){
                if($('#checkbox2').prop('checked')){
                    $('#result').append('<br><b>С подложкой</b>, 4600p. за м.кв. ');
                    if(back_h*back_w!=0 && !(isNaN(back_h*back_w))){
                        $('#result').append('('+back_h/100+'м. x '+back_w/100+'м.)<br><b>Цена:</b> '+(back_h*back_w*4600/10000)+'p.');
                    } else $('#result').append('<br><span>Вы не ввели размеры подложки</span>');
                    result_count+=back_h*back_w*4600/10000;
                } else $('#result').append('<br><b>Без подложки</b>');
                $('#result').append('<br><big><b>Итог</b> '+result_count+'p.</big>');
                $('#result').append('<br><small>*Работы и прочее рассчитываeтся отдельно</small>');
            }
        });
}

function change_class(){
    $.getJSON('data.json', function(json) {
        if($('#select_letter_type').prop('selectedIndex') == 10){
            $('#output_text1').removeClass().addClass('letter_style3'+$('#select_box_type').prop('selectedIndex'));
            $('#output_text2').removeClass().addClass('letter_style4'+$('#select_box_type').prop('selectedIndex'));
        }else{
            $('#output_text1').removeClass().addClass('letter_style1'+$('#select_letter_type').prop('selectedIndex'));
            $('#output_text2').removeClass().addClass('letter_style2'+$('#select_letter_type').prop('selectedIndex'));
        }
    });
}

function select_change(){
    change_class();
    if($('#select_letter_type')[0].options[$('#select_letter_type')[0].selectedIndex].innerHTML == 'Стальные')
        $('#output_text1').css('color','');
    if ($('#select_letter_type')[0].options[$('#select_letter_type')[0].selectedIndex].innerHTML == 'Световой короб'){
        $('#box-fieldset').css('display','block');
        $('#letter-height-box').css('display','none');
        $('#letter-height').val(undefined);
    } else{
        $('#box-fieldset').css('display','none');
        $('#letter-height-box').css('display','block');
        $('#box-square').val(undefined)
    }
    if($('#result').html() != '<span>Проверьте, все ли поля заполнены, и заполнены ли они правильно</span>' || $('#result').html() != 'Здесь отобразится результат вашего выбора') count_price();

}
function result_output(){
    $('#output_text1').html($('#phrase').val());
    $('#output_text2').html($('#phrase').val());
    if($('#result').html() != 'Здесь отобразится результат вашего выбора') count_price();
}

$(document).ready(function() {
    $.getJSON('data.json', function(json) {
        let str = '';
        for (let i in json.letters) {
            str+='<option>'+i+'</option>';
        }
        $('#select_letter_type').html(str);
        str = '';
        for (let i in json.box) {
            str+='<option>'+i+'</option>';
        }
        $('#select_box_type').html(str);
    });

    $('#select_box_type').change(select_change);
    $('#select_letter_type').change(select_change);
    $('#checkbox2').change(function(){
        let that = this;
        $.getJSON('data.json', function(json) {
            let str='';
            if(that.checked){
                $('#output_text3').removeClass().addClass('box_style10');
                $('#back-fieldset').css('display','block');
                $('#output_text3').css('padding-bottom','8px').css('visibility','visible');
            }else{
                $('#output_text3').removeClass().css('visibility','hidden');
                $('#back-fieldset').css('display','none');
            }
        });
        count_price();
    });

    $('#color-palette-letters td').each(function() {
        $(this).click(function(){
            if($('#select_letter_type')[0].options[$('#select_letter_type')[0].selectedIndex].innerHTML != 'Стальные')
               $('#output_text1').css('color',$(this).css('background-color'));
        });
    });

    $('#color-palette-back td').each(function() {
        $(this).click(function(){
            //$('#output_text2').css('background-color',$(this).css('background-color'));
            $('#output_text3').css('background-color',$(this).css('background-color'));
        });
    });

    $(".has-popover").each(function(i, obj) {
        $(this).popover({
          html: true,
          content: function() {
            var id = $(this).attr('id')
            return $('#popover-content-' + id).html();
            },
            trigger: 'manual'
        });
    });
    $('#letter-height').keyup(function(){
        let height = parseFloat($('#letter-height').val().replace(/,/,'.'));
        $("#letter-height").css('background-color','#fff').css('border','1px solid #ddd');
        if(height > 50) {
            if(height > 100){
                $('#popover-content-letter-height').html('<p><b>Внимание!</b> Высота подложки не должна превышать один метр</p>');
                $("#letter-height").css('background-color','#ffaeae').css('border','2px solid #ff7272');
                $('#output_text1').css('font-size', (100+10));
                $('#output_text2').css('font-size', (100+10));
            }else{
                $('#output_text1').css('font-size', (+height+10));
                $('#output_text2').css('font-size', (+height+10));
                $('#popover-content-letter-height').html('<p><b>Внимание!</b> Высота букв более 50 см нарушает Постановление №902. За консультацией обращайтесь к менеджеру.</p>');
            }
            $("#letter-height").popover('show');
        }
        else {
            $("#letter-height").popover('hide');
            $('#output_text1').css('font-size', (+height+10));
            $('#output_text2').css('font-size', (+height+10));
        }
        count_price();
    });
    $('#box-square').keyup(function(){
        let height = parseFloat($('#box-square').val().replace(/,/,'.'));
        $("#box-square").css('background-color','#fff').css('border','1px solid #ddd');
        if(height > 5) {
            if(height > 8){
                $('#output_text1').css('font-size', (80+10));
                $('#output_text2').css('font-size', (80+10));
            }else{
                $('#output_text1').css('font-size', (+height*10+10));
                $('#output_text2').css('font-size', (+height*10+10));
                $('#popover-content-letter-height').html('<p><b>Внимание!</b> Высота букв более 50 см нарушает Постановление №902. За консультацией обращайтесь к менеджеру.</p>');
            }
            $("#letter-height").popover('show');
        }
        else {
            $("#letter-height").popover('hide');
            $('#output_text1').css('font-size', (+height*10+10));
            $('#output_text2').css('font-size', (+height*10+10));
        }
        count_price();
    });
    $('#back-width').keyup(function(){
        let back_w = parseFloat($('#back-width').val().replace(/,/,'.'));
        if(back_w > 1000) {
            $("#back-width").popover('show');
            $('#output_text3').css('padding-left', (1000-1000/20)/2).css('padding-right', (1000-1000/20)/2).css('margin-left', -(1000-1000/20)/2);
        }
        else {
            $("#back-width").popover('hide');
            $('#output_text3').css('padding-left', (+back_w-back_w/20)/2).css('padding-right', (+back_w-back_w/20)/2).css('margin-left', -(+back_w-back_w/20)/2);
        }
        count_price();

    });
    $('#back-haight').keyup(function(){
        let back_h = parseFloat($('#back-haight').val().replace(/,/,'.'));
        if(back_h > 50) {
            $("#back-haight").popover('show');
            if(back_h > 110){
                $('#output_text3').css('padding-top', 110/2).css('padding-bottom', 110/2).css('top', 55);
            } else{
                $('#output_text3').css('padding-top', (+back_h)/2).css('padding-bottom', (+back_h)/2).css('top', 110-(+back_h)/2);
            }
        }
        else{
            $("#back-haight").popover('hide');
            $('#output_text3').css('padding-top', (+back_h)/2).css('padding-bottom', (+back_h)/2).css('top', 110-(+back_h)/2);
        }
        count_price();
    });
    $('#phrase').keyup(function(){ result_output(); });
    $('#letter-height').focusout(function(){$("#letter-height").popover('hide');});
    $('#back-haight').focusout(function(){$("#back-haight").popover('hide');});
    $('#back-width').focusout(function(){$("#back-width").popover('hide');});
});
