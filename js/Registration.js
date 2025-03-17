/*function form_Registration()
{
    window_Registration = new Ext.Window
    ({ 
        title: 'Регистрация',
        
        /*width: 550,
        height: 290, *//*
        layout: 'fit',

        closable: false,
        draggable:false, // перетаскивание окна
        resizable: false, //изменение размера
		//bodyStyle: 'background: transparent; border: none; padding: 5px;',
		//style: 'background: #5587CA; border: 2px solid #5587CA blur(0.8px); padding: 5px; ',
        items:
        [{
            xtype: 'form',
            bodyStyle: 'padding: 5px;',
            items: 
            [{
                xtype: 'textfield',
                fieldLabel: 'Фамилия'
            },{
                xtype: 'textfield',
                fieldLabel: 'Имя'
            },{
                xtype: 'textfield',
                fieldLabel: 'Отчество'
            },{
                xtype: 'textfield',
                fieldLabel: 'Дата рождения'
            },{
                xtype: 'textfield',
                fieldLabel: 'Логин',
                inputType: 'email'
            },{
                xtype: 'textfield',
                fieldLabel: 'Пароль'
            }]
        }],
        buttons:
        [{
            text: 'Зарегистрироваться',
            handler: function(){
                Ext.Ajax.request
                ({
                    url: 'phps/Authorization.php',
                    method: 'post',
                    params:
                    {
                        login: Login.getValue(),
                        password: myPassword.getValue()
                    },
                    callback:   function(opts,suss,resp)
                    {
                        var v = Ext.decode(resp.responseText);
                        
                        if(v == -1)
                        {
                            var Error_Avtorizaciya_1 = new Ext.Window({
                                frame: true,
                                closable: false,
                                layout: 'form',
                                modal: true,
                                bodyStyle: 'background: #c1ddf1; border: none;',
                                items:
                                [{
                                    style: 'margin: 15px;',
                                    xtype: 'label',
                                    html: '<div style = "align:center"></br><b>Пользователь с таким логином/паролем не зарегистрирован!</b></div>'
                                },{
                                    xtype: 'button',
                                    style: 'padding: 15px;',
                                    width: '100%',
                                    text: 'Ок',
                                    handler: function(){
                                        Error_Avtorizaciya_1.close();
                                        Authorization();
                                    }
                                }]
                            });
    
                            Error_Avtorizaciya_1.show();
                            Avtorizaciya_W.close();
                        }
                        else 
                        {
                            Chat_list_F(v);
                            Avtorizaciya_W.close();	
                                                    
                        }
                    }
                }); 
            }             
           
        }]
    });

    window_Registration.show(); 
}*/
function form_Registration()
{
    window_Registration = new Ext.Window
    ({ 
        title: 'Регистрация',
        
        /*width: 550,
        height: 290, */
        layout: 'fit',

        closable: false,
        draggable:false, // перетаскивание окна
        resizable: false, //изменение размера
		//bodyStyle: 'background: transparent; border: none; padding: 5px;',
		//style: 'background: #5587CA; border: 2px solid #5587CA blur(0.8px); padding: 5px; ',
        items:
        [{
            xtype: 'form',
            id: 'reg_form',
            bodyStyle: 'padding: 5px;',
            items: 
            [{
                xtype: 'textfield',
                itemId: 'first_name',
                fieldLabel: 'Фамилия',
                minLength: 2,
            },{
                xtype: 'textfield',
                itemId: 'name',
                fieldLabel: 'Имя',
                minLength: 2
            },{
                xtype: 'textfield',
                itemId: 'second_name',
                fieldLabel: 'Отчество',
                minLength: 2
            },{
                xtype: 'textfield',
                itemId: 'date_birth',
                fieldLabel: 'Дата рождения'
            },{
                xtype: 'textfield',
                itemId: 'login',
                fieldLabel: 'Логин',
                inputType: 'email',
                minLength: 4
            },{
                xtype: 'textfield',
                itemId: 'password',
                fieldLabel: 'Пароль',
                minLength: 5
            }]
        }],
        buttons:
        [/*{
            text: 'Печать',
            handler: function(){
                // Параметры
                var params = flattenObject({});
                // Создаём окно и выводим в нём сообщение
                var wName = Ext.id(null, 'print-');
                var pw = window.open('', wName);
                if(!pw){
                    Ext.Msg.alert('Сообщение', 'При печати документа произошла ошибка');
                    // Выходим из печати
                    return;
                }
                pw.document.open();
                pw.document.write('Пожалуйста подождите, выполняется формирование документа...');
                pw.document.close();
                
                // Создаём форму для передачи параметров с помощью POST
                var form = document.createElement('form');
                form.setAttribute('action', CONFIG.printers.xml);
                form.setAttribute('method', 'post');
                form.setAttribute('target', wName);
                form.setAttribute('style', 'display:none;');
                // Добавляем параметры
                for(var key in params){
                    if(params.hasOwnProperty(key)){
                        var input = document.createElement('input');
                        input.setAttribute('type', 'hidden');
                        input.setAttribute('name', key);
                        input.setAttribute('value', params[key]);
                        form.appendChild(input);
                    }
                }
                // Добавляем форму в документ
                document.body.appendChild(form);
                // Отправка формы в wName
                form.submit();
                // Удаляем форму
                document.body.removeChild(form);
            }
        },*/ {
            text: 'Зарегистрироваться',
            handler: function() {
                // Получаем данные формы
                var form = Ext.getCmp('reg_form'),
                    first_name  = form.down('#first_name').getValue(),
                    name        = form.down('#name').getValue(),
                    second_name = form.down('#second_name').getValue(),
                    date_birth  = form.down('#date_birth').getValue(),
                    login       = form.down('#login').getValue(),
                    password    = (form.down('#password').getValue().length > 0) ? MD5(CONSTANTS.HASH + form.down('#password').getValue()) : null;

                    // Создаем маску для окна авторизации
                var lm = new Ext.LoadMask({
                    target: window_Registration,
                    msg: 'Регистрация пользователя...'
                });
    
                // Выводим маску
                lm.show();

               // Вроде бы поля заполнены, запускаем PHP проверку пользователя
                Server.registration.registr({
                    first_name: first_name,
                    name: name,
                    second_name: second_name,
                    date_birth: date_birth,
                    login: login,
                    password: password
                }, function(result, callback, success){
                    lm.hide();

                    // Смотрим, прошёл ли вообще запрос?
                    if(!success){
                        return;
                    }

                    // Итак, мы зарегистрировались
                    // Закрываем окно регистрации
                    window_Registration.close();
                    
                    // Возвращаем пользователя на экран авторизации
                    form_Autorization();          
                    
                    Ext.Msg.alert('Сообщение', 'Пользователь успешно зарегистрирован!');
                });
            }             
           
        }]
    });

    window_Registration.show(); 
}