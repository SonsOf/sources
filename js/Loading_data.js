function form_Loading_Data()
{
    Vozvrat_na_dorabotky_W = new Ext.Window
    ({
        width:300,
        height:170,
        header: false,
        closable: false,
        resizable: false, //изменение размера
        bodyStyle: 'border: none; ',
        layout: 'border',
        items: 
        [{
            region: 'north',
            bodyStyle: 'border: none;',
            html: 
                '<section class="section section-color">'+
                    'Загрузка данных'+
                '</section>'            
        }, {
            region: 'center',
            bodyStyle: 'border: none;',
            items: [Ext.create('Ext.form.Panel', 
            {
                id: 'Panel_otpr',
                xtype: 'form',
                bodyStyle: 'border: none; background: transparent;  padding: 5px;',
                items:
                [{
                    xtype: 'filefield',
                    emptyText: 'Выберите документ...',
                    hideLabel: true,
                    labelWidth: 120,
                    anchor: '100%',
                    name: 'loading_data',
                    buttonText: '',
                    buttonConfig:
                    {
                        iconCls: 'upload-icon'
                    },
                    blankText : 'Необходимо выбрать скан-копию документа в формате XML'
                }] ,
                api: {
                    submit: Server.readXML.save
                }
            })]
        }],
        buttons:
        [{
            xtype: 'button',
            text: 'Загрузить',
            handler: function()
            {
                var form = Ext.getCmp('Panel_otpr').getForm();
                
                form.submit
                ({
                    waitMsg: 'Пожалуйста подождите, происходит сохранение документа...',

                    success: function(fp, o)
                    {
                        Vozvrat_na_dorabotky_W.close();
                        form_Menu(1);

                        showTimeoutMessage(o.result.msg);
                    },
                    failure: function(opts,resp) 
                    {
                        showTimeoutMessage(resp.result.msg);
                        Ext.Msg.alert('Ошибка', resp.result.msg);
                    }
				});
            }
        },{
            xtype: 'button',
            text: 'Отмена',
            handler: function()
            {
                Vozvrat_na_dorabotky_W.close();
            }
        }]
    });

    Vozvrat_na_dorabotky_W.show();
}