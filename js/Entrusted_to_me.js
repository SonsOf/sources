/* 
    БЛОК ПРОГРАММЫ "ПОРУЧЕННО МНЕ"
    1. Работа с задачами (проставление факта выполнения)
    2. Просмотр плана работ 
*/

function form_Entrusted_To_Me()
{  
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    DT_Date = new Date();
    DT_Mounth = DT_Date.getMonth()+1;

    /* Содержание блока "Работа с задачами"  */
    store_Working_With_Tasks = Ext.create('Ext.data.Store', {        
        fields:
        [
            { name: 'topic'}, { name: 'task_name'}, { name: 'id_task'}, { name: 'task_information'},
            { name: 'task_lasting'}, { name: 'priority'}, { name: 'report_execution'}, { name: 'report_comment'}, { name: 'max'}
        ],
        groupField: 'topic',
        proxy: {
            type: 'direct',
            directFn: Server.Entrusted_to_me.getTaskToMe,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            }
        },
        autoLoad: true,
        listeners: {
            beforeload: function(store){
                var proxy = store.getProxy();

                Ext.Ajax.abort();

                var period = '';

                if(Ext.getCmp('period_Mounth_Employee_Workload1').getValue() < 10)
                    period = '0'+Ext.getCmp('period_Mounth_Employee_Workload1').getValue();
                else
                    period = Ext.getCmp('period_Mounth_Employee_Workload1').getValue();
                    
                period +='.'+Ext.getCmp('period_MGod_Employee_Workload1').getValue();

                proxy.setExtraParam('id_user', USER.ID_USER);
                proxy.setExtraParam('create', period);
            }
        }
    });

    var passNumberVType = {
        passNumber: function(val, field){
            var passNumberRegex = /^\d{4}\s\d{6}$/;
            return passNumberRegex.test(val);
        },
        passNumberText: 'Серия и номер паспорта должны содержать только цифры и между ними должен стоять пробел!',
        passNumberMask: /[\d\s]/
    };

    var columns_Working_With_Tasks = 
    [{
        header: 'Тематика работы',
        align: 'center',
        dataIndex: 'topic',
        hidden: true
    },{
        header: 'Наименование',
        align: 'center',
        dataIndex: 'task_name',
        flex: 1,
        renderer: columnWrap
    },{
        header: 'Описание',
        align: 'center',
        dataIndex: 'task_information',
        flex: 2,
        renderer: columnWrap
    },{            
        header: 'Длительность</br>выполнения',
        align: 'center',
        dataIndex: 'task_lasting',
        width: 120
    },{
        header: 'Приоритет',
        align: 'center',
        dataIndex: 'priority',
        width: 100  
    },{
        header: "Факт выполнения",
        width: 200,
        columns: 
        [{
            header: 'Общий</br>процент</br>готовности',
            align: 'center',
            dataIndex: 'report_execution',
            width: 100,
            editor: {
                xtype: 'textfield',
                id: 'report_execution_edit',
                allowBlank: false,
                msgTarget :'side',
                maskRe : /[0-9:]/,

                msg:'Значение поля "Общий процент готовности" не должно превышать значение 100% и быть меньше ранее установленного!'
                
            }
        },{
            header: 'Общий</br>процент</br>готовности_old',
            align: 'center',
            hidden: true,
            dataIndex: 'max'
        },{
            header: 'Содержание работ',
            align: 'center',
            dataIndex: 'report_comment',
            width: 300,
            editor: {
                id: 'report_comment',
                xtype: 'textarea'
            },
            renderer: columnWrap
        }]
    }];

    grid_Working_With_Tasks = Ext.create('Ext.grid.Panel', 
    {
        width: '100%',
        height: viewportHeight - 100,
        store: store_Working_With_Tasks,        
        columns: columns_Working_With_Tasks,
        plugins: 
        [
            rowEditing = Ext.create('Ext.grid.plugin.RowEditing',
            {
                saveBtnText: 'Сохранить', // Измененное название кнопки сохранения
                cancelBtnText: 'Отменить', // Измененное название кнопки отмены
                listeners: 
                {
                    /*'edit': function(editor, context) 
                    {
                        
                        var selection = editor.grid.getView().getSelectionModel().getSelection()[0];

                        if(selection.get('report_execution_old') > selection.get('report_execution') || selection.get('report_execution') > 100)
                            alert('jdewe');

                    }*/
                    'validateedit': function(editor, e) {
                        var selection = editor.grid.getView().getSelectionModel().getSelection()[0];
                        
                        if(selection.get('max') > Ext.getCmp('report_execution_edit').getValue() || Ext.getCmp('report_execution_edit').getValue() > 100)
                        {
                          e.cancel = true;
                          e.record.data[e.field] = e.value;
                          Ext.getCmp('report_execution_edit').setValue();
                          Ext.getCmp('report_execution_edit').focus();
                        }
                        else 
                        {
                            e.cancel = false;
                        }

                        
                      },
                      edit: function(editor, context) {
                        // Выполняем необходимые действия при сохранении
                        var record = context.record;
                        var fieldName = context.field;
                        var newValue = context.value;

                        Server.Entrusted_to_me.saveReports
                        (
                            {
                                id_user: USER.ID_USER,
                                id_task: record.get('id_task'),
                                comment: Ext.getCmp('report_comment').getValue(),
                                execution: Ext.getCmp('report_execution_edit').getValue(),
                                date_report: Ext.getCmp('date_report').getValue()
                            }, 
                            function(result, callback, success)
                            {
                                if(!success)
                                {
                                    return;
                                }
                                
                                // Смотрим, есть ли сообщение об ошибке. Можем вышибать через exception
                                if(result.msg){
                                    Ext.Msg.alert('Сообщение', result.msg);
                                }
                            }
                        );
                    }
                }                
            }
        )],
        features: 
        [{
            id: 'group',
            ftype: 'grouping'
        }]
    });

    /*** Содержание блока "Просмотр плана работ сотрудников" ***/
    store_Employee_Workload = Ext.create('Ext.data.Store',
    {
        proxy:
        {
            type: 'ajax',
            url: '',
            reader: 
            {
                type: 'json',
                root: 'dan'
            },
            extraParams: {}
        },
        fields:
        [
            { name: 'fio'}, { name: 'task_name'}, { name: 'position'}, { name: 'mes4'},

            { name: 'day0'}, { name: 'day1'}, { name: 'day2'}, { name: 'day3'}, { name: 'day4'}, { name: 'day5'}, { name: 'day6'}, { name: 'day7'}, { name: 'day8'}, { name: 'day9'},
            { name: 'day10'}, { name: 'day11'}, { name: 'day12'}, { name: 'day13'}, { name: 'day14'}, { name: 'day15'}, { name: 'day16'}, { name: 'day17'}, { name: 'day18'}, { name: 'day19'},
            { name: 'day20'}, { name: 'day21'}, { name: 'day22'}, { name: 'day23'}, { name: 'day24'}, { name: 'day25'}, { name: 'day26'}, { name: 'day27'}, { name: 'day28'},
            { name: 'day29'}, { name: 'day30'}, { name: 'day31'}
        ],
        groupField: 'fio'
        
    });
    
    columns_Employee_Workload = 
    [{
        header: "<div align = 'center'>Задача</div>",		 
        flex: 1,
        dataIndex: 'name_task',
        renderer: function(val, par, rec, rowi, coli)
        {			
            return val+'</br>'+rec.data.priority;
        }
    },{
        header: "ИСПОЛНИТЕЛЬ", 
        align: 'center',
        width: 60, 
        dataIndex: 'fio',
        hidden: true
    }];

    grid_Employee_Workload = Ext.create('Ext.grid.Panel', 
    {
        //title: '<div align = "center">Диаграмма Ганта</div>',
        width: '100%',
        height: viewportHeight - 110,
        renderTo: Ext.getBody(),        
        //store: store_Employee_Workload,
        onLockedViewScroll:Ext.emptyFn ,  // Корректная работа прокрутки после линии
        viewConfig:
        {            
            getRowClass: function(record, rowIndex, rowParams, store)
            {
                return 'row-style-postavshik';
            }
        },
        hideHeaders: true,
        features: 
        [{
            id: 'group',
            ftype: 'grouping'
        }],
        columns: columns_Employee_Workload
    });

    viewport_Entrusted_To_Me = Ext.create('Ext.container.Viewport', 
    {
        layout: 'border',
        items: 
        [{
            region: 'north',
            bodyStyle: 'background: transparent; border: none;',
            html: 
                '<section class="section section-color">'+
                    'Порученное мне'+
                '</section>'            
        },{
            region: 'west',
            bodyStyle: 'border: none;',
            width: 150,
            split: true,
            collapsible: true,
            title: 'Меню',
            header: false,
            layout: 
            {
                type:'vbox',
                padding:'5',
                align:'stretch'
            },
            defaults:{margins:'0 0 5 0'},
            items:
            [{
                xtype:'button',
                iconCls:'icon_Working_With_Tasks',
				iconAlign:'top',
				cls: 'button_Style',
                html:'<span class="button_Content">Работа с</br>задачами</span>',
                //text: 'Работа с задачами',
                flex:2,
                handler: function() 
                {
                    showCenterContent('content1');
                }
            },{
                xtype:'button',
                iconCls:'icon_Calendar',
				iconAlign:'top',
				cls: 'button_Style',
                html:'<span class="button_Content">Календарь</span>',
                //text: 'Календарь',
                flex:2,
                handler: function() 
                {
                    showCenterContent('content2');
                }
            },{
                xtype: 'button',
                cls: 'button_Style',
                html:'<span class="button_Content">Меню</span>', 
                //text: 'Меню', 
                flex:1,
                handler: function()
                { 
                    viewport_Entrusted_To_Me.destroy();
                    
                    if(USER.LOCAL_BOSS == true)
                        form_Menu(2);  
                    else
                        form_Menu(3);
                }
            }]
        }, {
            region: 'center',
            id: 'centerRegion',
            bodyStyle: ' border: none; padding: 5px;',
            layout: 'card',
            activeItem: 0,
            items: 
            [{
                bodyStyle: 'background: white; border: none;',
                itemId: 'content1',
                items:[{      
                    id: 'period_Mounth_God_Employee_Workload1',                                      
                    xtype: 'form',
                    layout: 'column',
                    bodyStyle: 'background: transparent;border: none;',
                    style: 'margin-bottom: 5px;',
                    items:
                    [{
                        id: 'period_Mounth_Employee_Workload1',
                        xtype: 'combo',
                        fieldLabel: 'Отчетный период',

                        labelWidth: 150,
                        width: 250,
                        editable:       false,

                        displayField:   'name',
                        valueField:     'value',

                        queryMode:      'local',                            
                        triggerAction:  'all',   
                        value:   DT_Mounth,                       
                        store: Ext.create('Ext.data.Store', 
                        {
                            fields : ['name', 'value'],
                            data   : 
                            [
                                {name : 'Январь',	value: 1},
                                {name : 'Февраль',  value: 2},
                                {name : 'Март',  	value: 3},
                                {name : 'Апрель',  	value: 4},
                                {name : 'Май',  	value: 5},
                                {name : 'Июнь',  	value: 6},
                                {name : 'Июль',  	value: 7},
                                {name : 'Август',  	value: 8},
                                {name : 'Сентябрь', value: 9},
                                {name : 'Октябрь',  value: 10},
                                {name : 'Ноябрь',  	value: 11},
                                {name : 'Декабрь',  value: 12}
                            ]
                        }),
                        
                    },{
                        id: 'period_MGod_Employee_Workload1',
                        xtype: 'textfield',
                        fieldLabel: 'Год',
                        style: 'margin-left: 5px;',
                        width: 75,
                        labelWidth: 25,
                        value: DT_Date.getUTCFullYear(),
                        maxLength:4,
                        minLength:4,
                        enableKeyEvents: true                                
                    },{
                        id: 'date_report',
                        xtype: 'datefield',
                        fieldLabel: 'Дата отчета',
                        format: 'd.m.Y',
                        value: DT_Date
                    }] 
                },grid_Working_With_Tasks]                
            }, {
                bodyStyle: 'border: none;',
                itemId: 'content2',   
                layout: 'border',             
                items:
                [{
                    region: 'center',
                    bodyStyle: 'border: none;',
                    items: 
                    [{     
                        layout: 'column',
                        bodyStyle: 'border: none;',
                        items:
                        [{ 
                            columnWidth: 1,
                            id: 'period_Mounth_God_Employee_Workload',                                      
                            xtype: 'form',
                            layout: 'column',
                            bodyStyle: 'background: transparent;border: none; padding: 10px',
                            style: 'margin-bottom: 5px;',
                            items:
                            [{
                                id: 'period_Mounth_Employee_Workload',
                                xtype: 'combo',
                                fieldLabel: 'Отчетный период',

                                labelWidth: 150,
                                width: 250,
                                editable:       false,

                                displayField:   'name',
                                valueField:     'value',

                                queryMode:      'local',                            
                                triggerAction:  'all',   
                                value:   DT_Mounth,                       
                                store: Ext.create('Ext.data.Store', 
                                {
                                    fields : ['name', 'value'],
                                    data   : 
                                    [
                                        {name : 'Январь',	value: 1},
                                        {name : 'Февраль',  value: 2},
                                        {name : 'Март',  	value: 3},
                                        {name : 'Апрель',  	value: 4},
                                        {name : 'Май',  	value: 5},
                                        {name : 'Июнь',  	value: 6},
                                        {name : 'Июль',  	value: 7},
                                        {name : 'Август',  	value: 8},
                                        {name : 'Сентябрь', value: 9},
                                        {name : 'Октябрь',  value: 10},
                                        {name : 'Ноябрь',  	value: 11},
                                        {name : 'Декабрь',  value: 12}
                                    ]
                                }),
                                listeners: 
                                {
                                    select: function()
                                    {
                                        Server.Entrusted_by_me.getWorkingDate({},
                                            function(result, callback, success){
                                                if(!success){
                                                    return;
                                                }                            
                                                
                                                columns_Employee_Workload = 
                                                [{
                                                    header: "<div align = 'center'>Задача</div>",		 
                                                    flex: 1,
                                                    dataIndex: 'task_name',
                                                    renderer: function(val, par, rec, rowi, coli)
                                                    {
                                                        return 'Задача: '+val+' (продолжительность '+rec.data.task_lasting+' дн.)</br>'+
                                                                'Описание: '+rec.data.task_information+'</br>'+
                                                                'Тематика: '+rec.data.topic+'</br>';
                                                    }
                                                },{
                                                    header: "ИСПОЛНИТЕЛЬ", 
                                                    align: 'center',
                                                    width: 60, 
                                                    dataIndex: 'fio',
                                                    hidden: true
                                                }];
                            
                                                
                                                    for (i = 1; i <= 31; i++) 
                                                    {
                                                        item = {};
                                                        item.xtype = 'gridcolumn';
                                                        item.text = i;
                                                        item.dataIndex = 'mes'+i;
                                                        item.align = 'center';
                                                        item.width = 30;               
                            
                                                        item.renderer =function(val, metaData)
                                                        { 
                                                            if(val == 1)
                                                                metaData.style = 'background-color: green';
                                                            else if(val == 2)
                                                                metaData.style = 'background-color: orange;';
                                                            else if(val == 3)
                                                                metaData.style = 'background-color: red;';
                                                            else if(val == 4)  
                                                                metaData.style = 'background-color: green;background: repeating-linear-gradient(-60deg, white 0, white 2x, green 1px, green 5px);';
                                                            else if(val == 5)  
                                                                metaData.style = 'background-color: orange;background: repeating-linear-gradient(-60deg, #555 0, #555 2px, orange 1px, orange 5px);';
                                                            else if(val == 6)  
                                                                metaData.style = 'background-color: red;background: repeating-linear-gradient(-60deg, #555 0, #555 2px, red 1px, red 5px);';
                            
                                                            return '';  
                                                        }
                            
                                                        columns_Employee_Workload.push(item);
                                                    } 
                            
                                                    store_Employee_Workload = Ext.create('Ext.data.Store', {        
                                                        fields:
                                                        [
                                                            { name: 'fio'}, { name: 'task_name'}, { name: 'task_information'}, { name: 'task_lasting'}, { name: 'topic'},
                            
                                                            { name: 'mes0'}, { name: 'mes1'}, { name: 'mes2'}, { name: 'mes3'}, { name: 'mes4'}, { name: 'mes5'}, { name: 'mes6'}, { name: 'mes7'}, { name: 'mes8'}, { name: 'mes9'},
                                                            { name: 'mes10'}, { name: 'mes11'}, { name: 'mes12'}, { name: 'mes13'}, { name: 'mes14'}, { name: 'mes15'}, { name: 'mes16'}, { name: 'mes17'}, { name: 'mes18'}, { name: 'mes19'},
                                                            { name: 'mes20'}, { name: 'mes21'}, { name: 'mes22'}, { name: 'mes23'}, { name: 'mes24'}, { name: 'mes25'}, { name: 'mes26'}, { name: 'mes27'}, { name: 'mes28'},
                                                            { name: 'mes29'}, { name: 'mes30'}, { name: 'mes31'}
                                                        ],
                                                        groupField: 'fio',
                                                        proxy: {
                                                            type: 'direct',
                                                            directFn: Server.Entrusted_by_me.getPlan,
                                                            reader: {
                                                                type: 'json',
                                                                root: 'data',
                                                                totalProperty: 'total'
                                                            }
                                                        },
                                                        autoLoad: true,
                                                        listeners: {
                                                            beforeload: function(store){
                                                                var proxy = store.getProxy();
                                                
                                                                Ext.Ajax.abort();
                            
                                                                var period = '';
                            
                                                                if(Ext.getCmp('period_Mounth_Employee_Workload').getValue() < 10)
                                                                    period = '0'+Ext.getCmp('period_Mounth_Employee_Workload').getValue();
                                                                else
                                                                    period = Ext.getCmp('period_Mounth_Employee_Workload').getValue();
                                                                    
                                                                period +='.'+Ext.getCmp('period_MGod_Employee_Workload').getValue();
                                                
                                                                proxy.setExtraParam('id_user', USER.ID_USER);
                                                                proxy.setExtraParam('create', period);
                                                                proxy.setExtraParam('form', 2);
                                                            }
                                                        }
                                                    });
                                                              
                                                    grid_Employee_Workload.reconfigure(store_Employee_Workload, columns_Employee_Workload);
                                                
                                            }); 
                                    }
                                }
                            },{
                                
                                id: 'period_MGod_Employee_Workload',
                                xtype: 'textfield',
                                fieldLabel: 'Год',
                                style: 'margin-left: 5px;',
                                width: 75,
                                labelWidth: 25,
                                value: DT_Date.getUTCFullYear(),
                                maxLength:4,
                                minLength:4,
                                enableKeyEvents: true,
                                listeners: 
                                {
                                    change: function()
                                    {
                                        if(Ext.getCmp('period_MGod_Employee_Workload').getValue().length == 4)
                                        {
                                            Server.Entrusted_by_me.getWorkingDate({},
                                                function(result, callback, success){
                                                    if(!success){
                                                        return;
                                                    }
                                
                                                    Ext.getCmp('number_of_working_days').setValue(result.workingDays);
                                
                                                    columns_Employee_Workload = 
                                                    [{
                                                        header: "<div align = 'center'>Задача</div>",		 
                                                        flex: 1,
                                                        dataIndex: 'task_name',
                                                        renderer: function(val, par, rec, rowi, coli)
                                                        {
                                                            return 'Задача: '+val+' (продолжительность '+rec.data.task_lasting+' дн.)</br>'+
                                                                    'Описание: '+rec.data.task_information+'</br>'+
                                                                    'Тематика: '+rec.data.topic+'</br>';
                                                        }
                                                    },{
                                                        header: "ИСПОЛНИТЕЛЬ", 
                                                        align: 'center',
                                                        width: 60, 
                                                        dataIndex: 'fio',
                                                        hidden: true
                                                    }];
                                
                                                    
                                                        for (i = 1; i <= 31; i++) 
                                                        {
                                                            item = {};
                                                            item.xtype = 'gridcolumn';
                                                            item.text = i;
                                                            item.dataIndex = 'mes'+i;
                                                            item.align = 'center';
                                                            item.width = 30;               
                                
                                                            item.renderer =function(val, metaData)
                                                            { 
                                                                if(val == 1)
                                                                    metaData.style = 'background-color: green';
                                                                else if(val == 2)
                                                                    metaData.style = 'background-color: orange;';
                                                                else if(val == 3)
                                                                    metaData.style = 'background-color: red;';
                                                                else if(val == 4)  
                                                                    metaData.style = 'background-color: green;background: repeating-linear-gradient(-60deg, white 0, white 2x, green 1px, green 5px);';
                                                                else if(val == 5)  
                                                                    metaData.style = 'background-color: orange;background: repeating-linear-gradient(-60deg, #555 0, #555 2px, orange 1px, orange 5px);';
                                                                else if(val == 6)  
                                                                    metaData.style = 'background-color: red;background: repeating-linear-gradient(-60deg, #555 0, #555 2px, red 1px, red 5px);';
                                
                                                                return '';  
                                                            }
                                
                                                            columns_Employee_Workload.push(item);
                                                        } 
                                
                                                        store_Employee_Workload = Ext.create('Ext.data.Store', {        
                                                            fields:
                                                            [
                                                                { name: 'fio'}, { name: 'task_name'}, { name: 'task_information'}, { name: 'task_lasting'}, { name: 'topic'},
                                
                                                                { name: 'mes0'}, { name: 'mes1'}, { name: 'mes2'}, { name: 'mes3'}, { name: 'mes4'}, { name: 'mes5'}, { name: 'mes6'}, { name: 'mes7'}, { name: 'mes8'}, { name: 'mes9'},
                                                                { name: 'mes10'}, { name: 'mes11'}, { name: 'mes12'}, { name: 'mes13'}, { name: 'mes14'}, { name: 'mes15'}, { name: 'mes16'}, { name: 'mes17'}, { name: 'mes18'}, { name: 'mes19'},
                                                                { name: 'mes20'}, { name: 'mes21'}, { name: 'mes22'}, { name: 'mes23'}, { name: 'mes24'}, { name: 'mes25'}, { name: 'mes26'}, { name: 'mes27'}, { name: 'mes28'},
                                                                { name: 'mes29'}, { name: 'mes30'}, { name: 'mes31'}
                                                            ],
                                                            groupField: 'fio',
                                                            proxy: {
                                                                type: 'direct',
                                                                directFn: Server.Entrusted_by_me.getPlan,
                                                                reader: {
                                                                    type: 'json',
                                                                    root: 'data',
                                                                    totalProperty: 'total'
                                                                }
                                                            },
                                                            autoLoad: true,
                                                            listeners: {
                                                                beforeload: function(store){
                                                                    var proxy = store.getProxy();
                                                    
                                                                    Ext.Ajax.abort();
                                
                                                                    var period = '';
                                
                                                                    if(Ext.getCmp('period_Mounth_Employee_Workload').getValue() < 10)
                                                                        period = '0'+Ext.getCmp('period_Mounth_Employee_Workload').getValue();
                                                                    else
                                                                        period = Ext.getCmp('period_Mounth_Employee_Workload').getValue();
                                                                        
                                                                    period +='.'+Ext.getCmp('period_MGod_Employee_Workload').getValue();
                                                    
                                                                    proxy.setExtraParam('id_user', USER.ID_USER);
                                                                    proxy.setExtraParam('create', period);
                                                                    proxy.setExtraParam('form', 2);
                                                                }
                                                            }
                                                        });
                                                                  
                                                        grid_Employee_Workload.reconfigure(store_Employee_Workload, columns_Employee_Workload);
                                                    
                                                });
                                        }
                                    }
                                }                                
                            }]
                        },{                            
                            bodyStyle: 'border: none; padding: 5px;',
                            buttonAlign: 'right',
                            items: 
                            [{
                                xtype: 'button',
                                flex: 1,
                                width: 50,
                                height: 50,                                
                                iconCls:'icon_Find',
                                handler: function()
                                {
                                    window_Profile = new Ext.Window
                                    ({ 
                                        title: 'Условные обозначения',
                                        width: 230,
                                        height: 180, 
                                        modal: true,
                                        resizable: false, //изменение размера
                                        bodyStyle: 'border: none; background: white; ',
                                        layout: 'fit',
                                        items:
                                        [{
                                            html:
                                            '<div style = "margin:5px; border: none;">'+
                                                '<input type = "text" style = "width: 25px; background-color: green; border: none;" readonly> Обычная (не выполнена)</br>'+
                                                '<input type = "text" style = "width: 25px; background-color: orange; border: none;" readonly> Важная (не выполнена)</br>'+
                                                '<input type = "text" style = "width: 25px; background-color: red; border: none;" readonly> Сверхважная (не выполнена)</br>'+
                                                '<input type = "text" style = "width: 25px; background-color: green; border: none; background: repeating-linear-gradient(-60deg, #555 0, #555 2px, green 1px, green 5px);"  readonly> Важная (выполнена)</br>'+
                                                '<input type = "text" style = "width: 25px; background-color: orange; border: none; background: repeating-linear-gradient(-60deg, #555 0, #555 2px, orange 1px, orange 5px);"  readonly> Важная (выполнена)</br>'+
                                                '<input type = "text" style = "width: 25px; background-color: red; border: none; background: repeating-linear-gradient(-60deg, #555 0, #555 2px, red 1px, red 5px);"  readonly> Сверхважная (выполнена)</br>'+
                                            '</div>'
                                        }]
                                    });

                                    window_Profile.show(); 
                                }
                            }]                            
                        }] 
                    },grid_Employee_Workload]
                }]
            }]
        }],
        listeners: 
        {
            beforerender: function()
            {
                Server.Entrusted_by_me.getWorkingDate({},
                function(result, callback, success){
                    if(!success){
                        return;
                    }
                    

                    columns_Employee_Workload = 
                    [{
                        header: "<div align = 'center'>Задача</div>",		 
                        flex: 1,
                        dataIndex: 'task_name',
                        renderer: function(val, par, rec, rowi, coli)
                        {
                            return 'Задача: '+val+' (продолжительность '+rec.data.task_lasting+' дн.)</br>'+
                                    'Описание: '+rec.data.task_information+'</br>'+
                                    'Тематика: '+rec.data.topic+'</br>';
                        }
                    },{
                        header: "ИСПОЛНИТЕЛЬ", 
                        align: 'center',
                        width: 60, 
                        dataIndex: 'fio',
                        hidden: true
                    }];

                    
                        for (i = 1; i <= 31; i++) 
                        {
                            item = {};
                            item.xtype = 'gridcolumn';
                            item.text = i;
                            item.dataIndex = 'mes'+i;
                            item.align = 'center';
                            item.width = 30;               

                            item.renderer =function(val, metaData)
                            { 
                                if(val == 1)
                                    metaData.style = 'background-color: green';
                                else if(val == 2)
                                    metaData.style = 'background-color: orange;';
                                else if(val == 3)
                                    metaData.style = 'background-color: red;';
                                else if(val == 4)  
                                    metaData.style = 'background-color: green;background: repeating-linear-gradient(-60deg, white 0, white 2x, green 1px, green 5px);';
                                else if(val == 5)  
                                    metaData.style = 'background-color: orange;background: repeating-linear-gradient(-60deg, #555 0, #555 2px, orange 1px, orange 5px);';
                                else if(val == 6)  
                                    metaData.style = 'background-color: red;background: repeating-linear-gradient(-60deg, #555 0, #555 2px, red 1px, red 5px);';

                                return '';  
                            }

                            columns_Employee_Workload.push(item);
                        } 

                        store_Employee_Workload = Ext.create('Ext.data.Store', {        
                            fields:
                            [
                                { name: 'fio'}, { name: 'task_name'}, { name: 'task_information'}, { name: 'task_lasting'}, { name: 'topic'},

                                { name: 'mes0'}, { name: 'mes1'}, { name: 'mes2'}, { name: 'mes3'}, { name: 'mes4'}, { name: 'mes5'}, { name: 'mes6'}, { name: 'mes7'}, { name: 'mes8'}, { name: 'mes9'},
                                { name: 'mes10'}, { name: 'mes11'}, { name: 'mes12'}, { name: 'mes13'}, { name: 'mes14'}, { name: 'mes15'}, { name: 'mes16'}, { name: 'mes17'}, { name: 'mes18'}, { name: 'mes19'},
                                { name: 'mes20'}, { name: 'mes21'}, { name: 'mes22'}, { name: 'mes23'}, { name: 'mes24'}, { name: 'mes25'}, { name: 'mes26'}, { name: 'mes27'}, { name: 'mes28'},
                                { name: 'mes29'}, { name: 'mes30'}, { name: 'mes31'}
                            ],
                            groupField: 'fio',
                            proxy: {
                                type: 'direct',
                                directFn: Server.Entrusted_by_me.getPlan,
                                reader: {
                                    type: 'json',
                                    root: 'data',
                                    totalProperty: 'total'
                                }
                            },
                            autoLoad: true,
                            listeners: {
                                beforeload: function(store){
                                    var proxy = store.getProxy();
                    
                                    Ext.Ajax.abort();

                                    var period = '';

                                    if(Ext.getCmp('period_Mounth_Employee_Workload').getValue() < 10)
                                        period = '0'+Ext.getCmp('period_Mounth_Employee_Workload').getValue();
                                    else
                                        period = Ext.getCmp('period_Mounth_Employee_Workload').getValue();
                                        
                                    period +='.'+Ext.getCmp('period_MGod_Employee_Workload').getValue();
                    
                                    proxy.setExtraParam('id_user', USER.ID_USER);
                                    proxy.setExtraParam('create', period);
                                    proxy.setExtraParam('form', 2);
                                }
                            }
                        });
                                  
                        grid_Employee_Workload.reconfigure(store_Employee_Workload, columns_Employee_Workload);
                    
                });
            }
        }
    });

    function showCenterContent(itemId) {
        var centerPanel = Ext.getCmp('centerRegion');
        centerPanel.getLayout().setActiveItem(centerPanel.down('#' + itemId));
    }
    
}
