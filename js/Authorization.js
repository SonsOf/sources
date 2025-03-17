function form_Autorization()
{
    // Функция для переключения типа поля (пароль/текст)
    function togglePasswordVisibility(field, btn) {
        if (btn.pressed) {
            field.inputEl.dom.type = 'text';
            btn.classList.remove('eye-open');
            btn.classList.add('eye-closed');
            btn.pressed = false;
        } else {
            field.inputEl.dom.type = 'password';
            btn.classList.remove('eye-closed');
            btn.classList.add('eye-open');
            btn.pressed = true;
        }
    }

    // Поле для ввода логина
    var loginField = new Ext.form.TextField({
        id: 'login',
        fieldLabel: 'Логин',
        allowBlank: false,
        labelWidth: 50,
        width: 240,
        margin: '10 0 0 20',
        listeners: {}
    });

    // Поле для ввода пароля
    var passwordField = new Ext.form.TextField({
        id: 'password',
        fieldLabel: 'Пароль',
        inputType: 'password',
        allowBlank: false,
        labelWidth: 50,
        width: 215, // Ширина поля
        margin: '10 0 0 20',
        listeners: {}
    });

    // Кнопка для показа/скрытия пароля
    var showHideBtn = document.createElement('button');
    showHideBtn.className = 'x-btn x-btn-noicon eye-open';
    showHideBtn.style.verticalAlign = 'bottom'; // Выровняем кнопку по нижнему краю
    showHideBtn.style.height = '24px'; // Высота кнопки, чтобы соответствовать полю ввода
    showHideBtn.style.padding = '0'; // Убираем внутренние отступы
    showHideBtn.style.border = 'none'; // Убираем рамку вокруг кнопки
    showHideBtn.style.backgroundColor = 'transparent'; // Прозрачный фон
    showHideBtn.style.borderColor = 'transparent'; // Прозрачный фон
    showHideBtn.style.marginTop = '12px'; // Сдвигаем кнопку вниз
    showHideBtn.style.marginLeft = '5px'; // Отступ слева от поля
    showHideBtn.pressed = false;

    // Обработчик нажатия на кнопку
    showHideBtn.onclick = function() {
        togglePasswordVisibility(passwordField, this);
    };

    // Контейнер для размещения полей и кнопки
    var container = new Ext.Container({
        layout: 'vbox',
        items: [
            loginField,
            {
                layout: 'hbox',
                width: '100%',
                bodyStyle: 'border: none; background: transparent;',
                items: [passwordField, showHideBtn]
            }
        ]
    });

    // Добавляем контейнер в окно
    var window_Autorization = new Ext.Window({
        title: 'Авторизация',
        width: 300,
        height: 180,
        closable: false,    
        items: [container],
        buttons: [{
            text: 'Войти',
            handler: function()
            {
                /*form_Administration();*/
                var login = Ext.getCmp('login').getValue(),
                    password = (Ext.getCmp('password').getValue().length > 0) ?  MD5(CONSTANTS.HASH + Ext.getCmp('password').getValue()) : null;

                // Проверяем, все ли поля заполнены
                if(Ext.isEmpty(login)){
                    Ext.Msg.alert('Сообщение', 'Укажите имя пользователя!');
                    return;
                }

                // Проверяем, все ли поля заполнены
                if(Ext.isEmpty(password)){
                    Ext.Msg.alert('Сообщение', 'Вы не указали пароль!');
                    return;
                }

                // Создаем маску для окна авторизации
                var lm = new Ext.LoadMask({
                    target: window_Autorization,
                    msg: 'Проверка пользователя...'
                });
    
                // Выводим маску
                lm.show();

               // Вроде бы поля заполнены, запускаем PHP проверку пользователя
                Server.auth.sing_in({
                    login: login,
                    password: password
                }, function(result, callback, success){
                    lm.hide();

                    // Смотрим, прошёл ли вообще запрос?
                    if(!success){
                        return;
                    }

                    // Смотрим, есть ли сообщение об ошибке. Можем вышибать через exception
                    if(result.msg){
                        //Ext.Msg.alert('Сообщение', result.msg);

                        showTimeoutMessage(result.msg);

                        // Очищаем пароль
                        Ext.getCmp('password').reset();
                        return;
                    }

                    // Итак, мы залогинились
                    if(result.success){

                        // Берем информацию пользователя
                        window.USER = result.data;

                        window_Autorization.close();

                        if(USER.ROLE == 'ADMIN') 
                        {
                            if(USER.KOL_USER_SYSTEM == 0)
                                form_Loading_Data();
                            else
                                form_Menu(1);
                        }
                        else 
                        {
                            if(USER.LOCAL_BOSS == true)
                                form_Menu(2);  
                            else
                                form_Menu(3);  
                        }                                                 
                    }
                });
                
            }
        }/*,{
            text: 'Зарегистрироваться',
            handler: function()
            {
                window_Autorization.close();
                form_Registration();
            } 
        }*/]
    });

    window_Autorization.show();
}
