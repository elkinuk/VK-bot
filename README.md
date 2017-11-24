VK bot
=====================
![forthebadge](http://forthebadge.com/images/badges/you-didnt-ask-for-this.svg)

* ES6
* HTML5
* CSS3
* Webpack 3
* AJAX
* JQuery 3.2.1

В файле vk.js вставить свой токен в `parameters.access_token`
как это сделать подробно можно узнать [по ссылке](https://vk.com/dev/first_guide?f=3.%20Авторизация%20пользователя)

##### Затем запускаем сервер бд (для MacOS)

    Запустить  XAMP
    Врубить апачи и мскл
    $ папка проекта
    $ node bd_server.js

##### После этого запускаем бота

    $ cd *project dir*
    $ webpack
    $ npm start

Переходите в localhost:8000 и юзаете

##### ВАЖНО!

По хорошему надо было делать CORS запросы и тд, но я очень ленивая, поэтому просто поставила в Chrome расширение CORS toggle и была довольна :)
