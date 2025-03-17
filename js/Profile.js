/* Форма "Личный кабинет" */
function form_Profile()
{  
    
     
      
    window_Profile = new Ext.Window
    ({ 
        header: false,
        width: 670,
        height: 535, 
        closable: false,
        resizable: false, //изменение размера
        bodyStyle: 'border: none; ',
        layout: 'border',
        items:
        [{
            region: 'center',
            bodyStyle: 'border: none; ',
            items:
            [{
                bodyStyle: 'background: transparent; border: none;',
                html: 
                    '<section class="section section-color">'+
                        'Личный кабинет'+
                    '</section>'
            },{
                layout: 'column',
                bodyStyle: 'border: none; ',
                items:
                [{
                    style: 'margin: 5px;',
                    xtype: 'fieldset',              
                    title: 'Данные пользователя',
                    items: 
                    [{
                        xtype: 'textfield',
                        id: 'profile_name',
                        fieldLabel: 'Имя',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        id: 'profile_surname',
                        fieldLabel: 'Фамилия',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        id: 'profile_middlename',
                        fieldLabel: 'Отчество',
                        readOnly: true
                    },{
                        id: 'profile_gender',
                        xtype: 'textfield',
                        fieldLabel: 'Пол',
                        readOnly: true
                    },{
                        xtype: 'datefield',
                        id: 'profile_date_birth',
                        fieldLabel: 'Дата рождения',
                        readOnly: true,
                        format: 'd.m.Y'
                    }]
                },{
                    style: 'margin: 5px;',
                    xtype: 'fieldset',             
                    title: 'Приватность и защита',
                    items: 
                    [{
                        xtype: 'checkbox',
                        id: 'change_password',
                        fieldLabel: 'Изменить пароль',
                        labelWidth: 130,
                        listeners: 
                        {
                            'change': function(_, newValue, oldValue)
                            {
                                if(newValue == true)
                                {
                                    Ext.getCmp('old_Password').setValue();
                                    Ext.getCmp('old_Password').enable();
                                    Ext.getCmp('new_Password').enable();
                                    Ext.getCmp('new_Password2').enable();
                                }
                                else
                                {
                                    Ext.getCmp('old_Password').setValue();
                                    Ext.getCmp('new_Password').setValue();
                                    Ext.getCmp('new_Password2').setValue();
                                    
                                    Ext.getCmp('old_Password').disable();
                                    Ext.getCmp('new_Password').disable();
                                    Ext.getCmp('new_Password2').disable();
                                }
                            }
                        }    
                    },{    
                        id: 'profile_login',                        
                        xtype: 'textfield',
                        fieldLabel: 'Логин',
                        labelWidth: 130,
                        readOnly: true                 
                    },{
                        id:'old_Password',
                        xtype: 'textfield',
                        fieldLabel: 'Пароль',
                        inputType: 'password',
                        disabled: true,
                        labelWidth: 130,
                        //value: USER.PASSWORD                  
                    },
                    {
                        xtype: 'form',   
                        bodyStyle: 'border:none',                     
                        fieldDefaults: 
                        {
                            labelWidth: 130,
                            msgTarget: 'side',
                            autoFitErrors: false
                        },
                        defaults: 
                        {
                            inputType: 'password',
                            disabled: true
                        },
                        defaultType: 'textfield',
                        items: 
                        [{
                            id:'new_Password',
                            fieldLabel: 'Новый пароль',
                            name: 'pass',
                            itemId: 'pass',
                            allowBlank: false,
                            listeners: 
                            {
                                validitychange: function(field)
                                {
                                    field.next().validate();
                                },
                                blur: function(field)
                                {
                                    field.next().validate();
                                }
                            }
                        }, {
                            id:'new_Password2',
                            fieldLabel: 'Подтвердите пароль',
                            name: 'pass-cfrm',
                            vtype: 'password',
                            initialPassField: 'pass' 
                        }]
                    }]
                }]
                
            },{
                bodyStyle: 'background: transparent; border: none; ',
                style: 'margin: 5px;',
                html: 
                    '<p style = "text-indent: 20px;"><b>Внешний вид сайтов</b></p>'+
                    '<p style = "text-indent: 20px;">Некоторые сайты изменяют свою цветовую схему в зависимости от ваших предпочтений. Выберите цветовую схему, которую вы хотите использовать для этих сайтов.</p>'+
                    '<div class="radio-form" > '+
                        '<label class="radio-control">'+
                            '<input type="radio" name="money" value="neptun" checked="checked"/>'+
                            '<span class="radio-input">'+
                                '<i><img src="images/buble.png"/></i>'+
                                '<span>Buble</span>'+
                            '</span>'+
                        '</label>'+
                        '<label class="radio-control">'+
                            '<input type="radio" name="money" value="dark"  />'+
                            '<span class="radio-input">'+
                                '<i><img src="images/dark.png" heigh = "10px"/></i>'+
                                '<span>Dark</span>'+
                            '</span>'+
                        '</label>'+
                        '<label class="radio-control">'+
                            '<input type="radio" name="money" value="gray"  />'+
                            '<span class="radio-input">'+  
                                '<i><img src="images/gray.png" heigh = "10px"/></i>'+
                                '<span>Gray</span>'+
                            '</span>'+
                        '</label>'+                    
                    '</div>'                
            }]
        },{
            region: 'south',
            bodyStyle: 'border: none; padding: 5px',
            layout: 'hbox',
            items:
            [{
                xtype: 'button', 
                text: 'Сохранить',
                style: 'margin: 5px',
                flex: 1,
                handler: function()
                { 
                    radios = document.getElementsByName('money');
                    
                    // Перебираем все элементы коллекции
                    for (var i = 0; i < radios.length; i++) 
                    {
                        if (radios[i].checked) 
                        {                         
                            themeName = radios[i].value; // Выводим значение выбранной радио-кнопки

                            var link = document.getElementById('theme-css');
                            var dop_link = document.getElementById('dop_theme-css');
        
                            if (themeName === 'neptun') {
                                link.href = '../ext4/ext4/resources/css/ext-all-neptune.css';
                                dop_link.href = 'css/style_neptune.css';
                            } else if (themeName === 'dark') {
                                link.href = '../ext4/ext4/resources/css/ext-all-access.css';
                                dop_link.href = 'css/style_access.css';
                            } else if (themeName === 'gray') {
                                link.href = '../ext4/ext4/resources/css/ext-all-gray.css';
                                dop_link.href = 'css/style_gray.css';
                            } 

                            break; // Прерываем цикл, так как выбрано одно значение
                        }
                    } 

                    if(Ext.getCmp('change_password').getValue() == true)
                    {
                        if(Ext.getCmp('old_Password').getValue() == '' || Ext.getCmp('new_Password').getValue() == '' || 
                            Ext.getCmp('new_Password2').getValue() == '')
                            alert('Пароли не совпадают');
                        else
                        {
                            password_old = (Ext.getCmp('old_Password').getValue().length > 0) ?  MD5(CONSTANTS.HASH + Ext.getCmp('old_Password').getValue()) : null;
                            password_new = (Ext.getCmp('new_Password').getValue().length > 0) ?  MD5(CONSTANTS.HASH + Ext.getCmp('new_Password').getValue()) : null;

                            Server.Profile.save
                            (
                                {
                                    login: USER.LOGIN,
                                    background: themeName,
                                    password_old: password_old,
                                    password_new: password_new
                                }, 
                                function(data, callback, success)
                                {
                                    if(!success)
                                    {
                                        return;
                                    }

                                     // Смотрим, есть ли сообщение об ошибке. Можем вышибать через exception
                                    if(data.msg){
                                        Ext.Msg.alert('Сообщение', data.msg);
                                    }

                                    // Переприсваиваем тему
                                    USER.BACKGROUND = themeName;

                                    Ext.getCmp('new_Password').setValue();
                                    Ext.getCmp('new_Password2').setValue();                                    
                                }
                            );
                        }                            
                    }
                    else 
                        Server.Profile.save
                        (
                            {
                                login: USER.LOGIN,
                                background: themeName
                            }, 
                            function(data, callback, success)
                            {
                                if(!success)
                                {
                                    return;
                                }

                                // Переприсваиваем тему
                                USER.BACKGROUND = themeName;
                                
                            }
                        ); 

                    
                }
            },{
                xtype: 'button', 
                text: 'Меню', 
                flex: 1,
                style: 'margin: 5px', 
                handler: function()
                { 
                    window_Profile.close();

                    if(USER.ROLE == 'ADMIN')
                        form_Menu(1);
                    else if(USER.LOCAL_BOSS == true)
                        form_Menu(2);  
                    else
                        form_Menu(3);
                }
            }]            
        }],
        listeners: 
        {
            beforeshow: function()
            {
                Server.Profile.getProfile({
                    login: USER.LOGIN
                }, function(data, callback, success){
                    if(!success){
                        return;
                    }
                    Ext.getCmp('profile_name').setValue(data.NAME);
                    Ext.getCmp('profile_surname').setValue(data.FIRST_NAME);
                    Ext.getCmp('profile_middlename').setValue(data.SECOND_NAME);

                    if(data.GENDER == 1) gender = 'Мужской';
                    else if(data.GENDER == 2) gender = 'Женский';

                    Ext.getCmp('profile_gender').setValue(gender);
                    Ext.getCmp('profile_date_birth').setValue(convert_Date(data.DATE_BIRTH));
                    Ext.getCmp('profile_login').setValue(data.LOGIN);
              });
            }
        }
    });

    window_Profile.show(); 
}
