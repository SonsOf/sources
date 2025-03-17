function form_Reports()
{  

    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    window_Reports = Ext.create('Ext.container.Viewport', 
    {
        layout: 'border',
        items: 
        [{
            region: 'north',
            bodyStyle: 'background: transparent; border: none;',
            html: 
                '<section class="section section-color">'+
                    'Отчеты'+
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
                text: 'Квартальный отчет',
                flex:2,
                handler: function() 
                {
                    showCenterContent('content1');
                }
            },{
                xtype: 'button', 
                text: 'Меню', 
                flex:1,
                handler: function()
                { 
                    window_Reports.destroy();
                    form_Menu();
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
                items:
                [grid = Ext.create('Ext.grid.Panel', 
                {
                    height: viewportHeight - 90,                                
                    //store: myStore,
                    columns: 
                    [{ 
                        header: 'Проект / задача (содержание работ)', 
                        align: 'center',
                        dataIndex: 'name',
                        flex: 2
                    },{ 
                        text: 'Трудоемкость (чел/дн)',
                        align: 'center', 
                        columns: 
                        [{ 
                            header: 'План</br>на квартал', 
                            align: 'center',
                            dataIndex: 'start_Task',
                            width: 100 
                        },{ 
                            text: 'Январь', 
                            align: 'center',
                            dataIndex: 'finish_Task',
                            columns:
                            [{
                                header: 'План',
                                dataIndex: 'finish_Task',
                                width: 60, 
                                align: 'center'
                            },{
                                header: 'Факт',
                                dataIndex: 'finish_Task',
                                width: 60, 
                                align: 'center'
                            }]
                        },{ 
                            text: 'Февраль', 
                            align: 'center',
                            dataIndex: 'finish_Task',
                            columns:
                            [{
                                header: 'План',
                                dataIndex: 'finish_Task',
                                width: 60, 
                                align: 'center'
                            },{
                                header: 'Факт',
                                dataIndex: 'finish_Task',
                                width: 60, 
                                align: 'center'
                            }]
                        },{ 
                            text: 'Март', 
                            align: 'center',
                            dataIndex: 'finish_Task',
                            columns:
                            [{
                                header: 'План',
                                dataIndex: 'finish_Task',
                                width: 60, 
                                align: 'center'
                            },{
                                header: 'Факт',
                                dataIndex: 'finish_Task',
                                width: 60, 
                                align: 'center'
                            }]
                        }]
                    },{ 
                        text: 'Срок</br>выполнения', 
                        dataIndex: 'execution_Priority',
                        align: 'center',
                        width: 120,
                        columns:
                        [{
                            header: 'План', 
                            dataIndex: 'execution_Priority'
                        },{
                            header: 'Факт', 
                            dataIndex: 'execution_Priority'
                        }]
                    },{ 
                        header: 'Примечание', 
                        dataIndex: 'execution_Priority',
                        align: 'center',
                        width: 130 
                    }],
                    bbar: 
                    ['->',{
                        text: 'Печать',
                        handler: function() 
                        {
                            
                        }
                    }]
                })]                
            }]
        }]
    });

    function showCenterContent(itemId) {
        var centerPanel = Ext.getCmp('centerRegion');
        centerPanel.getLayout().setActiveItem(centerPanel.down('#' + itemId));
    }

}
