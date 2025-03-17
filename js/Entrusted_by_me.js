/* 
    БЛОК ПРОГРАММЫ "ПОРУЧЕННОЕ МНОЙ"
    1. Составление работ
    2. Просмотр плана работ сотрудников
    3. Контроль выполнения работ
*/

function form_Entrusted_By_Me()
{  
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    DT_Date = new Date();
    DT_Mounth = DT_Date.getMonth()+1;

    /*** Хранилище данных для заведения задач при составлении плана ***/
    Ext.define('MyModel', 
    {
        extend: 'Ext.data.Model',
        fields: 
        [
            'task_name', 'task_information', 'id_topic', 
            {name:'task_lasting', type:'int'},{name:'priority', type:'int'},
            {                
                name: 'order',
                type: 'int',
                persist: false, // Не сохраняется на сервере
                convert: function(value, record) 
                {
                    var store = record.store;
                    if (store) 
                    {
                        var filteredRecords = store.queryBy(function(item) 
                        {
                            return item.get('priority') === record.get('priority');
                        });

                        return filteredRecords.getCount();
                    }
                    return 0;
                }
            }
        ]
    });

    var myStore = Ext.create('Ext.data.Store', {
        model: 'MyModel',
        proxy: 
        {
            type: 'memory'
        }
    });

    // Флаг для предотвращения бесконечной рекурсии
    var updating = false;

    // Обработчик события update модели
    myStore.on('update', function(store, record, operation) {
        if (!updating) {
            updating = true;
            // Пересчитываем значения в вычисляемом поле для всех записей
            store.each(function(rec) {
                rec.beginEdit();
                rec.endEdit(); // Вызвать пересчет вычисляемого поля
            });
            updating = false;
        }
    }, this);

    /*** Хранилище данных для определения подчиненных при составлении плана ***/
    var users_store = Ext.StoreMgr.get('users');
    users_store.on('beforeload', function(store, record, operation){
        var proxy = store.getProxy();
        Ext.Ajax.abort();

        proxy.setExtraParam('MAIN_BOSS',    USER.MAIN_BOSS);
        proxy.setExtraParam('LOCAL_BOSS',   USER.LOCAL_BOSS);
        proxy.setExtraParam('ID_USER',      USER.ID_USER);
    });

    
    /*
    var change_Project_Select = Ext.create('Ext.data.Store', {        
        fields: [
            {name: 'NAME_PROJECT',  type: 'string'},
            {name: 'DATE_CREATE_PROJECT', 	type: 'date', format: 'dd.mm.yyyy'},
            {name: 'DATE_CLOSE_PROJECT', 	type: 'date', format: 'dd.mm.yyyy'}
        ],
        proxy: {
            type: 'direct',
            directFn: Server.auth.getYourProject,
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            }
        },
        autoLoad: true,
        // Сделано, чтобы передавать дату в формате без времени
        listeners: {
            beforeload: function(store){
                var proxy = store.getProxy();

                Ext.Ajax.abort();

                //proxy.setExtraParam('login', USER.LOGIN);
            }
        }
    });*/   
    
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
        store: Ext.create('Ext.data.JsonStore', {
            fields: ['fio', 'name_task', 'priority', 'day1', 'day2', 'day3'],
            data: [
                    {fio: 'Сотрудник 1', name_task: 'Задача 1', priority: 1, day1: 2, day2: 3, day3: 2},
                    {fio: 'Сотрудник 1', name_task: 'Задача 2', priority: 1, day1: 1, day2: 2, day3: 2},
                    {fio: 'Сотрудник 1', name_task: 'Задача 3', priority: 1, day1: 3, day2: 1, day3: 1},
                    {fio: 'Сотрудник 1', name_task: 'Задача 4', priority: 1, day1: 4, day2: 1, day3: 7},
                    {fio: 'Сотрудник 1', name_task: 'Задача 2', priority: 1, day1: 1, day2: 2, day3: 2},
                    {fio: 'Сотрудник 1', name_task: 'Задача 3', priority: 2, day1: 3, day2: 5, day3: 1},
                    {fio: 'Сотрудник 1', name_task: 'Задача 4', priority: 1, day1: 4, day2: 7, day3: 7},
                    {fio: 'Сотрудник 2', name_task: 'Задача 2', priority: 1, day1: 1, day2: 2, day3: 2},
                    {fio: 'Сотрудник 2', name_task: 'Задача 3', priority: 3, day1: 3, day2: 5, day3: 1},
                    {fio: 'Сотрудник 1', name_task: 'Задача 4', priority: 1, day1: 4, day2: 7, day3: 7},
                    {fio: 'Сотрудник 1', name_task: 'Задача 2', priority: 2, day1: 1, day2: 2, day3: 2},
                    {fio: 'Сотрудник 2', name_task: 'Задача 3', priority: 1, day1: 3, day2: 5, day3: 1},
                    {fio: 'Сотрудник 1', name_task: 'Задача 4', priority: 1, day1: 4, day2: 7, day3: 7}
                  ],
            groupField: 'fio'
        }),
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

    /*** Содержание блока "Контроль выполнения работ" ***/
    filters_Control_Of_Work_Progress =
    [{
        layout: 'column',
        bodyStyle: 'border: none;',
        items:
        [{    
            columnWidth: 1,            
            xtype: 'form',
            layout: 'column',                    
            bodyStyle: 'background: transparent; border: none; padding-bottom: 5px; ',
            items:
            [{
                xtype: 'fieldset',
                title: 'Вид отчёта',
                style: 'margin-right: 5px;',
                bodyStyle: 'border: none;',
                items:
                [{
                    xtype: 'radiogroup',
                    bodyStyle: 'background: transparent;',
                    columns: 2,
                    labelWidth: 150,
                    items: 
                    [{
                        boxLabel: 'Промежуточный контроль (по сотрудникам)', 
                        name: 'parametr_Control_Of_Work_Progress', 
                        inputValue: 1, 
                        checked: true,
                        width: 310
                    },{
                        boxLabel: 'Контроль выполнения (по тематикам работ)', 
                        name: 'parametr_Control_Of_Work_Progress',
                        inputValue: 2,
                        width: 280
                    }],
                    listeners: 
                    {
                        change: function(radioGroup, newValue)
                        {
                            var param_Select_Period = newValue.parametr_Control_Of_Work_Progress;

                            if(param_Select_Period == 1)
                            {
                                Ext.getCmp('period_Day_Control_Of_Work_Progress').show();
                                Ext.getCmp('period_Mounth_God_Control_Of_Work_Progress').hide();
                                
                                /* store_Employee_Workload.getProxy().extraParams =
                                {
                                    
                                };
                                                            
                                store_Employee_Workload.load();*/
                                                        
                                grid_Control_Of_Work_Progress.reconfigure(store_Control_Of_Work_Progress, columns_Control_Of_Work_Progress);
                            }
                            else if(param_Select_Period == 2)
                            {
                                Ext.getCmp('period_Day_Control_Of_Work_Progress').hide();
                                Ext.getCmp('period_Mounth_God_Control_Of_Work_Progress').show();

                                columns_Control_Of_Work_Progress_new = 
                                [{
                                    header: "<div align = 'center'>Тематика</div>",		 
                                    flex: 1,
                                    dataIndex: 'name_task',
                                    renderer: function(val, par, rec, rowi, coli)
                                    {			
                                        return val+'</br>'+rec.data.priority;
                                    }
                                },{
                                    header: "<div align = 'center'>Задача</div>",		 
                                    flex: 1,
                                    dataIndex: 'name_task',
                                    renderer: function(val, par, rec, rowi, coli)
                                    {			
                                        return val+'</br>'+rec.data.priority;
                                    }
                                },{
                                    header: "<div align = 'center'>Описание</div>",		 
                                    flex: 2,
                                    dataIndex: 'name_task',
                                    renderer: function(val, par, rec, rowi, coli)
                                    {			
                                        return val+'</br>'+rec.data.priority;
                                    }
                                },{
                                    header: "<div align = 'center'>Приоритет</div>",		 
                                    width: 100,
                                    dataIndex: 'name_task',
                                    renderer: function(val, par, rec, rowi, coli)
                                    {			
                                        return val+'</br>'+rec.data.priority;
                                    }
                                },{
                                    header: "<div align = 'center'>Исполнитель</div>",		 
                                    flex: 2,
                                    dataIndex: 'name_task',
                                    renderer: function(val, par, rec, rowi, coli)
                                    {			
                                        return val+'</br>'+rec.data.priority;
                                    }
                                },{
                                    header: "<div align = 'center'>Дата</br>завершения</div>",		 
                                    width: 100,
                                    dataIndex: 'name_task',
                                    renderer: function(val, par, rec, rowi, coli)
                                    {			
                                        return val+'</br>'+rec.data.priority;
                                    }
                                }];     
                                            
                                /* store_Employee_Workload.getProxy().extraParams =
                                {
                                    
                                };
                                                            
                                store_Employee_Workload.load();*/
                                                        
                                grid_Control_Of_Work_Progress.reconfigure(store_Control_Of_Work_Progress, columns_Control_Of_Work_Progress_new);
                            }
                        }
                    }
                }]
            },{
                
                xtype: 'fieldset',
                title: 'Уточнение периода',
                style: 'margin-right: 5px;',
                bodyStyle: 'border: none;',
                items:
                [{
                    layout: 'column',
                    bodyStyle: 'background: transparent; border: none;',
                    items:
                    [{
                        id: 'period_Day_Control_Of_Work_Progress',
                        xtype: 'datefield',
                        format: 'd.m.Y',
                        style: 'margin-bottom: 5px;',
                        bodyStyle: 'border: none;',
                        value: DT_Date,
                        width: 100
                    },{      
                        id: 'period_Mounth_God_Control_Of_Work_Progress',  
                        hidden: true,               
                        xtype: 'form',
                        layout: 'column',
                        bodyStyle: 'background: transparent;border: none;',
                        style: 'margin-bottom: 5px;',
                        items:
                        [{
                            xtype: 'label',
                            style: 'margin-top: 3px; margin-right: 5px;',
                            text: 'С '
                        },{
                            xtype: 'textfield',
                            style: 'margin-right: 5px;',
                            width: 50,
                            maxLength:2,
                            minLength:1,
                            enableKeyEvents: true 
                        },{
                            xtype: 'label',
                            style: 'margin-top: 3px; margin-right: 5px;',
                            text: ' по '
                        },{
                            xtype: 'textfield',
                            style: 'margin-right: 5px;',
                            width: 50,
                            maxLength:2,
                            minLength:1,
                            enableKeyEvents: true 
                        },{
                            id: 'period_Mounth_Control_Of_Work_Progress',
                            xtype: 'combo',

                            labelWidth: 60,
                            width: 100,
                            editable:       false,

                            displayField:   'name_2',
                            valueField:     'value',

                            queryMode:      'local',                            
                            triggerAction:  'all',   
                            value:   DT_Mounth,                       
                            store: Ext.create('Ext.data.Store', 
                            {
                                fields : ['name', 'name_2', 'value'],
                                data   : 
                                [
                                    {name : 'Январь',	name_2 : 'Января',  value: 1},
                                    {name : 'Февраль',  name_2 : 'Февраля', value: 2},
                                    {name : 'Март',  	name_2 : 'Мартф',   value: 3},
                                    {name : 'Апрель',  	name_2 : 'Апреля',  value: 4},
                                    {name : 'Май',  	name_2 : 'Мая',     value: 5},
                                    {name : 'Июнь',  	name_2 : 'Июня',    value: 6},
                                    {name : 'Июль',  	name_2 : 'Июля',    value: 7},
                                    {name : 'Август',  	name_2 : 'Августа', value: 8},
                                    {name : 'Сентябрь', name_2 : 'Сентября',value: 9},
                                    {name : 'Октябрь',  name_2 : 'Октября', value: 10},
                                    {name : 'Ноябрь',  	name_2 : 'Ноября',  value: 11},
                                    {name : 'Декабрь',  name_2 : 'Декабря', value: 12}
                                ]
                            })
                        },{
                            id: 'period_MGod_Control_Of_Work_Progress',
                            xtype: 'textfield',
                            //fieldLabel: 'Год',
                            style: 'margin-left: 5px; margin-right: 5px;',
                            width: 50,
                            value: DT_Date.getUTCFullYear(),
                            maxLength:4,
                            minLength:4,
                            enableKeyEvents: true                                
                        },{
                            xtype: 'label',
                            style: 'margin-top: 3px;',
                            text: 'года'
                        }] 
                    }]
                }]
            }]        
            
        }]
    }];

    store_Control_Of_Work_Progress = Ext.create('Ext.data.Store',
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
    
    columns_Control_Of_Work_Progress = 
	[{
		header: "<div align = 'center'>Тематика</div>",		 
		flex: 1,
		dataIndex: 'name_task',
		renderer: function(val, par, rec, rowi, coli)
		{			
			return val+'</br>'+rec.data.priority;
		}
	},{
		header: "<div align = 'center'>Задача</div>",		 
		flex: 1,
		dataIndex: 'name_task',
		renderer: function(val, par, rec, rowi, coli)
		{			
			return val+'</br>'+rec.data.priority;
		}
	},{
		header: "<div align = 'center'>Описание</div>",		 
		flex: 2,
		dataIndex: 'name_task',
		renderer: function(val, par, rec, rowi, coli)
		{			
			return val+'</br>'+rec.data.priority;
		}
	},{
		header: "<div align = 'center'>Приоритет</div>",		 
		width: 100,
		dataIndex: 'name_task',
		renderer: function(val, par, rec, rowi, coli)
		{			
			return val+'</br>'+rec.data.priority;
		}
	},{
		header: "<div align = 'center'>Содержание работ</div>",		 
		flex: 2,
		dataIndex: 'name_task',
		renderer: function(val, par, rec, rowi, coli)
		{			
			return val+'</br>'+rec.data.priority;
		}
	},{
		header: "<div align = 'center'>Процент</br>выполнения</div>",		 
		width: 100,
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

    grid_Control_Of_Work_Progress = Ext.create('Ext.grid.Panel', 
    {
        //title: '<div align = "center">Диаграмма Ганта</div>',
        width: '100%',
        height: viewportHeight - 110,
        /*store: Ext.create('Ext.data.JsonStore', {
            fields: ['fio', 'name_task', 'priority', 'day1', 'day2', 'day3'],
            data: [
                    {fio: 'Сотрудник 1', name_task: 'Задача 1', priority: 1, day1: 2, day2: 3, day3: 2},
                    {fio: 'Сотрудник 1', name_task: 'Задача 2', priority: 1, day1: 1, day2: 2, day3: 2},
                    {fio: 'Сотрудник 1', name_task: 'Задача 3', priority: 1, day1: 3, day2: 1, day3: 1},
                    {fio: 'Сотрудник 1', name_task: 'Задача 4', priority: 1, day1: 4, day2: 1, day3: 7},
                    {fio: 'Сотрудник 1', name_task: 'Задача 2', priority: 1, day1: 1, day2: 2, day3: 2},
                    {fio: 'Сотрудник 1', name_task: 'Задача 3', priority: 2, day1: 3, day2: 5, day3: 1},
                    {fio: 'Сотрудник 1', name_task: 'Задача 4', priority: 1, day1: 4, day2: 7, day3: 7},
                    {fio: 'Сотрудник 2', name_task: 'Задача 2', priority: 1, day1: 1, day2: 2, day3: 2},
                    {fio: 'Сотрудник 2', name_task: 'Задача 3', priority: 3, day1: 3, day2: 5, day3: 1},
                    {fio: 'Сотрудник 1', name_task: 'Задача 4', priority: 1, day1: 4, day2: 7, day3: 7},
                    {fio: 'Сотрудник 1', name_task: 'Задача 2', priority: 2, day1: 1, day2: 2, day3: 2},
                    {fio: 'Сотрудник 2', name_task: 'Задача 3', priority: 1, day1: 3, day2: 5, day3: 1},
                    {fio: 'Сотрудник 1', name_task: 'Задача 4', priority: 1, day1: 4, day2: 7, day3: 7}
                  ],
            groupField: 'fio'
        }),*/
        //store: store_Control_Of_Work_Progress,
        features: 
        [{
            id: 'group',
            ftype: 'grouping'
        }],
        columns: columns_Control_Of_Work_Progress
    });

    viewport_Entrusted_By_Me = Ext.create('Ext.container.Viewport', 
    {
        layout: 'border',
        items: 
        [{
            region: 'north',
            bodyStyle: 'background: transparent; border: none;',
            html: 
                '<section class="section section-color">'+
                    'Порученное мною'+
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
                iconCls:'icon_Working_With_Projects',
				iconAlign:'top',
				cls: 'button_Style',
                html:'<span class="button_Content">Составление</br>плана работ</span>',
                flex:2,
                handler: function() 
                {
                    showCenterContent('content1');
                }
            },{
                xtype:'button',
                iconCls:'icon_Workload_of_Employees',
				iconAlign:'top',
				cls: 'button_Style',
                html:'<span class="button_Content">Просмотр</br>плана работ</br>сотрудников</span>',
                //text: 'Загруженность сотрудников',
                flex:2,
                handler: function() 
                {
                    showCenterContent('content2');
                }
            },{
                xtype:'button',
                iconCls:'icon_Execution_Of_Tasks',
				iconAlign:'top',
				cls: 'button_Style',
                html:'<span class="button_Content">Контроль</br>выполнения</br>работ</span>',
                //text: 'Выполнение задач',
                flex:2,
                handler: function() 
                {
                    showCenterContent('content3');
                }
            },{
                xtype: 'button', 
                ls: 'button_Style',
                html:'<span class="button_Content">Меню</span>',
                //text: 'Меню', 
                flex:1,
                handler: function()
                { 
                    viewport_Entrusted_By_Me.destroy();
                    
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
                layout: 'border',
                items:
                [{
                    
                        region: 'center',
                        autoScroll: true,
                        xtype: 'form',
                        bodyStyle: 'border: none; padding: 5px;',
                        items: 
                        [{
                            layout: 'column',
                            bodyStyle: 'border: none; margin-bottom: 5px;',
                            items:
                            [{
                                width: 600,
                                xtype: 'form',
                                bodyStyle: 'border:none;',
                                style: 'margin-right: 5px;',
                                items:
                                [{      
                                    xtype: 'form',
                                    layout: 'column',
                                    bodyStyle: 'background: transparent;border: none;',
                                    style: 'margin-bottom: 5px;',
                                    items:
                                    [{
                                        id: 'period_Mounth',
                                        xtype: 'combo',
                                        fieldLabel: 'Отчётный период',
            
                                        labelWidth: 110,
                                        width: 210,
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
                                            select: function(val)
                                            {
                                                Server.Entrusted_by_me.getWorkingDate({
                                                    month: Ext.getCmp('period_Mounth').getValue(),
                                                    year: Ext.getCmp('period_MGod').getValue()
                                                },
                                                    function(result, callback, success){
                                                        if(!success){
                                                            return;
                                                        }
                                    
                                                        Ext.getCmp('number_of_working_days').setValue(result.workingDays);
                                                    });
                                            }
                                        }
                                    },{
                                        id: 'period_MGod',
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
                                                if(Ext.getCmp('period_MGod').getValue().length == 4)
                                                {
                                                    Server.Entrusted_by_me.getWorkingDate({
                                                        month: Ext.getCmp('period_Mounth').getValue(),
                                                        year: Ext.getCmp('period_MGod').getValue()
                                                    },
                                                        function(result, callback, success){
                                                            if(!success){
                                                                return;
                                                            }
                                        
                                                            Ext.getCmp('number_of_working_days').setValue(result.workingDays);
                                                        });
                                                }
                                            }
                                        }                                
                                    },{
                                        id: 'number_of_working_days',
                                        name: 'number_of_working_days',
                                        xtype: 'textfield', 
                                        style: 'margin-left: 5px;',
                                        labelWidth: 160,
                                        width: 305,
                                        readOnly: true,
                                        fieldLabel: 'Количество рабочих дней'
                                    }] 
                                },grid_user = Ext.create('Ext.grid.Panel', { 
                                    height: viewportHeight - 150,
                                    title: '<div align = "center">Перечень сотрудников</div>',
                                    store:  Ext.create('Ext.data.Store', {        
                                        fields: [
                                            {name: 'id_user', 		type: 'int'},
                                            {name: 'fio', 			type: 'string'},
                                            {name: 'position', 		type: 'string'}
                                        ],
                                        proxy: {
                                            type: 'direct',
                                            directFn: Server.Entrusted_by_me.getUsers,
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
                                        header: 'Табельный</br>номер', 
                                        dataIndex: 'id_user',
                                        align: 'center',
                                        width: 100,
                                        layout: 'hbox',
                                        items: 
                                        [{
                                            xtype: 'textfield',
                                            flex: 1,
                                            style: 'margin: 5px;'
                                        }]
                                    },{ 
                                        header: 'ФИО сотрудника', 
                                        dataIndex: 'fio',
                                        align: 'center',
                                        flex: 1,
                                        layout: 'hbox',
                                        items: 
                                        [{
                                            xtype: 'textfield',
                                            flex: 1,
                                            style: 'margin: 5px; margin-top: 20px;'
                                        }]
                                    },{ 
                                        header: 'Должность', 
                                        dataIndex: 'position',
                                        align: 'center',
                                        flex: 1,
                                        layout: 'hbox',
                                        items: 
                                        [{
                                            xtype: 'textfield',
                                            flex: 1,
                                            style: 'margin: 5px; margin-top: 20px;'
                                        }],
                                        renderer: columnWrap
                                    }],
                                    listeners:
                                    {
                                        itemclick: function(_, record, item, index, e, eOpts)
                                        {
                                            var proxy = Ext.StoreMgr.get('topic').getProxy();
                                            
                                            proxy.setExtraParam('id_user', record.get('id_user'));
                                                        
                                            Ext.StoreMgr.get('topic').load();

                                            user_task = record.get('id_user');
                                        }
                                    } ,
                                    selModel: Ext.create('Ext.selection.RowModel') // Модель выбора строк                                                   
                                                                  
                                })]                            
                            },{
                                columnWidth: 1,
                                bodyStyle: 'border: none;',
                                items:
                                [
                                    grid = Ext.create('Ext.grid.Panel', 
                                    {

                                        title: '<div align = "center">План задач сотрудника</div>',
                                        height: viewportHeight - 120,                                
                                        store: myStore,
                                        columns: 
                                        [{ 
                                            header: 'Наименование', 
                                            align: 'center',
                                            dataIndex: 'task_name',
                                            flex: 2,
                                            editor: {
                                                xtype: 'textfield',
                                                allowBlank: false,
                                                msgTarget :'side'
                                            }
                                        },{ 
                                            header: 'Описание',
                                            align: 'center',
                                            dataIndex: 'task_information' ,
                                            flex: 3,
                                            editor: {
                                                xtype: 'textfield'
                                            }
                                        },{ 
                                            header: 'Тематика работ',
                                            align: 'center',
                                            dataIndex: 'id_topic', // dataIndex должен соответствовать valueField комбобокса
                                            flex: 2,
                                            renderer: function()
                                            {
                                                return columnWrap(Ext.getCmp('combo_topic').getDisplayValue());
                                            },
                                            editor: {
                                                id: 'combo_topic',
                                                xtype: 'combobox',
                                                displayField: 'topic_name',
                                                valueField: 'id_topic',
                                                store: store_topic = Ext.create('Ext.data.Store', {
                                                    storeId: 'topic',
                                                    fields: [
                                                        {name: 'id_topic'},
                                                        {name: 'topic_name'}
                                                    ],
                                                    proxy: {
                                                        type: 'direct',
                                                        directFn: Server.SH.getTopicList,
                                                        reader: 'json'
                                                    }
                                                }),
                                                checkOnly: true,
                                                editable: false,
                                                flex: 2,
                                                style: 'margin: 5px;',
                                                allowBlank: false,
                                                msgTarget :'side'
                                            }
                                        },{ 
                                            header: 'Продолжительность</br>(кол-во дней)',
                                            align: 'center',
                                            dataIndex: 'task_lasting' ,
                                            width: 160,
                                            editor: {
                                                xtype: 'textfield',
                                                maskRe : /[0-9:]/,
                                                allowBlank: false,
                                                msgTarget :'side'
                                            }
                                        },{ 
                                            header: 'Приоритет', 
                                            dataIndex: 'priority',
                                            align: 'center',
                                            width: 100,
                                            renderer: function(val)
                                            {
                                                if(val == 1 ) return 'Обычная'
                                                else if(val == 2 ) return 'Важная'
                                                else if(val == 3 ) return 'Сверхважная'
                                            },
                                            editor:
                                            {
                                                xtype: 'combobox', 
                                                store: 'priority',
                                                displayField: 'priority_name',
                                                valueField: 'priority',
                                                checkOnly: true,
                                                editable: false,
                                                flex: 1,
                                                style: 'margin: 5px;',
                                                allowBlank: false,
                                                msgTarget :'side'
                                            }
                                        },{ 
                                            header: 'Порядок</br>следования',
                                            align: 'center',
                                            dataIndex: 'order' ,
                                            width: 160,
                                            editor: {
                                                xtype: 'textfield',
                                                maskRe : /[0-9:]/,
                                                allowBlank: false,
                                                msgTarget :'side'
                                            }
                                        }],
                                        bbar: 
                                        [{
                                            id: 'days_plan',
                                            xtype: 'textfield',
                                            fieldLabel: 'Общая продолжительность задач',
                                            labelStyle: 'width: 220px',
                                            style: 'border: none',
                                            readOnly: true,
                                            listeners: {
                                                change: function(field, newVal, oldVal, opts) {
                                                    
                                        //alert(Ext.getCmp('number_of_working_days').getValue());
                                                    
                                                }
                                            }

                                        },'->',{
                                            text: 'Добавить задачу',
                                            handler: function() 
                                            {
                                                if(grid_user.getSelectionModel().hasSelection())
                                                {
                                                    grid_user.disable();
                                                    myStore.insert(0, 'MyModel');
                                                    rowEditing.startEdit(0, 0);
                                                }
                                                else
                                                    showTimeoutMessage('Не выбран сотрудник для составления плана!');
                                                
                                            }
                                        },{
                                            text: 'Удалить задачу',
                                            handler: function() 
                                            {
                                                var selection = grid.getView().getSelectionModel().getSelection()[0];
                                                if (selection) {
                                                    myStore.remove(selection);
                                                }
                                                Ext.getCmp('days_plan').setValue(grid.getStore().sum('task_lasting'));

                                                if(myStore.getCount() == 0)
                                                    /* Открываем доступ к сотрудникам */
                                                    grid_user.enable();
                                            }
                                        }],
                                        plugins: 
                                        [
                                            rowEditing = Ext.create('Ext.grid.plugin.RowEditing',
                                            {
                                                saveBtnText: 'Сохранить', // Измененное название кнопки сохранения
                                                cancelBtnText: 'Отменить', // Измененное название кнопки отмены
                                                listeners: 
                                                {
                                                    'edit': function(editor, context) 
                                                    {
                                                        var store = editor.grid.store;
                                                        
                                                        store.sort('task_name', 'DESC'); 
                                                        store.sort('count', 'ASC'); 

                                                        Ext.getCmp('days_plan').setValue(store.sum('task_lasting'));


                                                    }
                                                }
                                            }
                                        )]
                                    }
                                )]                                
                            }]                        
                        }]
                    },{
                        region: 'south',
                        bodyStyle: 'border: none;',
                        items:
                        [{
                            xtype: 'button',
                            text: 'Сохранить план',
                            handler: function()
                            {
                                if(Ext.getCmp('days_plan').getValue() != Ext.getCmp('number_of_working_days').getValue())
                                {
                                    Ext.MessageBox.show({
                                        title:'Предупреждение',
                                        msg: 'Количество рабочих дней за отчетный период не совпадает с планом. Продолжить?',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function(btn)
                                        {
                                            if(btn == 'yes')
                                            {
                                                var store = Ext.getStore('myStore'); // Получение экземпляра вашего Store
                                                var records = myStore.getRange(); // Получение всех записей из Store
                
                                                // Преобразование записей в массив объектов
                                                var dataToSend = [];
                                                records.forEach(function(record) {
                                                    dataToSend.push(record.data);
                                                });
                
                                                if(Ext.getCmp('period_Mounth').getValue() < 10)
                                                    var_date_start_mounth = '0'+Ext.getCmp('period_Mounth').getValue();
                                                else 
                                                    var_date_start_mounth = Ext.getCmp('period_Mounth').getValue();
                
                                                var_date_start = '01.'+var_date_start_mounth+'.'+Ext.getCmp('period_MGod').getValue();
                
                                                Server.Entrusted_by_me.saveTask
                                                (
                                                    {
                                                        id_autor: USER.ID_USER,
                                                        id_user: user_task,
                                                        date_start: var_date_start,
                                                        tasks: dataToSend
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
                                                
                                                /* Открываем доступ к сотрудникам */
                                                grid_user.enable();
                                                myStore.removeAll();
                                                Ext.getCmp('days_plan').setValue();
                                            }
                                        },
                                        animateTarget: 'mb4',
                                        icon: Ext.MessageBox.QUESTION
                                    });
                                }
                                else{
                                    var store = Ext.getStore('myStore'); // Получение экземпляра вашего Store
                                var records = myStore.getRange(); // Получение всех записей из Store

                                // Преобразование записей в массив объектов
                                var dataToSend = [];
                                records.forEach(function(record) {
                                    dataToSend.push(record.data);
                                });

                                if(Ext.getCmp('period_Mounth').getValue() < 10)
                                    var_date_start_mounth = '0'+Ext.getCmp('period_Mounth').getValue();
                                else 
                                    var_date_start_mounth = Ext.getCmp('period_Mounth').getValue();

                                var_date_start = '01.'+var_date_start_mounth+'.'+Ext.getCmp('period_MGod').getValue();

                                Server.Entrusted_by_me.saveTask
                                (
                                    {
                                        id_autor: USER.ID_USER,
                                        id_user: user_task,
                                        date_start: var_date_start,
                                        tasks: dataToSend
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
                                
                                /* Открываем доступ к сотрудникам */
                                grid_user.enable();
                                myStore.removeAll();
                                                Ext.getCmp('days_plan').setValue();
                                }                        

                                
                                
                            }
                        }]                    
                    
                }]
            },{
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
                                                                proxy.setExtraParam('form', 1);
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
                                                                    proxy.setExtraParam('form', 1);
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
            },{
                bodyStyle: 'border: none;',
                itemId: 'content3',   
                layout: 'border',             
                items:
                [{
                    region: 'north',
                    bodyStyle: 'border: none;',
                    items: filters_Control_Of_Work_Progress
                },{
                    region: 'center',
                    items: [grid_Control_Of_Work_Progress]
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
                                    proxy.setExtraParam('form', 1);
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
