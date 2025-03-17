function form_Administration()
{
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    var grid_List_Of_Employees = Ext.create('Ext.grid.Panel', 
    {
        height: 380,
        layout: 'fit',
        store: Ext.create('Ext.data.Store', {        
            fields: [
                {name: 'id_user'},
                {name: 'fio'},
                {name: 'date_birth', type: 'date', format: 'd.m.Y'},
                {name: 'gender'},
                {name: 'position'},	
                {name: 'fio_boss'},
                {name: 'creating'},
                {name: 'topics_user'}
            ],
            proxy: {
                type: 'direct',
                directFn: Server.admin.getData,
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total'
                }
            },
            listeners: {
                beforeload: function(store){
                    var proxy = store.getProxy();
    
                    Ext.Ajax.abort();
    
                    proxy.setExtraParam('main_boss', USER.MAIN_BOSS);
                    proxy.setExtraParam('local_boss', USER.LOCAL_BOSS);
                    proxy.setExtraParam('id_user', USER.ID_USER);
                }
            },
            autoLoad: true
        }),
        columns: 
        [{
            header: "Табельный</br>номер",
            align: 'center', 
            dataIndex: 'id_user',
            width: 100           
        },{
            header: "ФИО сотрудника",
            align: 'center', 
            dataIndex: 'fio',
            flex: 1,
            renderer: function(val)
            {
                return columnWrap(val);
            }            
        },{
            header: "Пол", 
            align: 'center', 
            dataIndex: 'gender',
            width: 100 ,
            renderer: function(val)
            {
                if(val == 1) return 'Мужской';
                else if(val == 2) return 'Женский';
            }     
        },{
            header: "Дата</br>рождения", 
            align: 'center', 
            dataIndex: 'date_birth',
            width: 100,
            renderer: function(val)
            {
                return convert_Date(val);
            }      
        },{
            header: "Руководитель", 
            align: 'center',
            dataIndex: 'fio_boss',
            flex: 1,
            renderer: function(val)
            {
                return columnWrap(val);
            }      
        },{
            header: "Должность</br>(профессиональный</br>уровень)", 
            align: 'center',
            dataIndex: 'position',
            flex: 1,
            renderer: function(val)
            {
                return columnWrap(val);
            }      
        },{
            header: "Тематики сотрудника", 
            align: 'center',
            dataIndex: 'topics_user',
            flex: 1,
            renderer: function(val)
            {
                return columnWrap(val);
            }      
        },{
            header: "Заведение</br>задач", 
            align: 'center',
            dataIndex: 'creating', 
            width: 100,
            renderer: function(val)
            {
                if(val == 1)
                    return 'Разрешено';
                else if(val == 0)
                    return 'Запрещено'
            },
            editor: {
                id: 'edit_creating',
                xtype: 'combobox', 
                store: 'input_task',
                displayField:   'name',
                valueField:     'creating',
                listeners:
                {
                    change: function()
                    {
                        Server.admin.save
                        (
                            {
                                id_user: grid_List_Of_Employees.getView().getSelectionModel().getSelection()[0].get('id_user'),
                                creating: Ext.getCmp('edit_creating').getValue()
                            }, 
                            function(result, callback, success)
                            {
                                if(!success)
                                {
                                    return;
                                }
                                
                                // Смотрим, есть ли сообщение об ошибке. Можем вышибать через exception
                                if(result.msg){
                                    showTimeoutMessage(result.msg);
                                }
                            }
                        );
                    }

                }
                
            }  
        }],
        plugins: {
            ptype: 'cellediting'
        }
    });    

    window_Administration = new Ext.Window
    ({         
        xtype :'form',
        layout: 'border',
        width: 1200,
        height: 500,
        header: false,
        closable: false,
        resizable: false,
        style: 'background: transparent; border: none;',
        bodyStyle: 'background: white; border: none;',
        items: 
        [{
            region: 'north',
            bodyStyle: 'background: transparent; border: none;',
            html: 
                '<section class="section section-color">'+
                    'Администрирование пользователей'+
                '</section>'            
        },{
            region: 'center',
            bodyStyle: 'padding: 5px; border: none;',
            items: [grid_List_Of_Employees]
        },{            
            region: 'south',
            bodyStyle: 'border: none;',
            items: 
            [{
                xtype: 'container',
                layout: 'hbox',                    
                items: 
                [{
                    xtype: 'button',
                    text: 'Меню',
                    style: 'margin: 5px',
                    flex: 1,
                    handler: function()
                    {
                        window_Administration.close();
                        form_Menu(1);
                    }
                }]
            }]            
        }]
    });

    window_Administration.show(); 
}
