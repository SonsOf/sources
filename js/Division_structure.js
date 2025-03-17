function form_Division_Structure()
{  

    Ext.define('TreeModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'text', type: 'string'},
            {name: 'leaf', type: 'boolean'}
        ]
    });
    
    // Создаем хранилище для данных дерева
    var store = Ext.create('Ext.data.TreeStore', {
        model: 'TreeModel',
        root: {
            expanded: true,
            children: [
                {
                    text: 'Корень',
                    leaf: false,
                    expanded: true,
                    children: [
                        {
                            text: 'Узел 1',
                            leaf: false,
                            expanded: true,
                            children: [
                                { text: 'Подузел 1.1', leaf: true },
                                { text: 'Подузел 1.2', leaf: true }
                            ]
                        },
                        {
                            text: 'Узел 2',
                            leaf: false,
                            expanded: true,
                            children: [
                                {
                                    text: 'Подузел 2.1',
                                    leaf: false,
                                    expanded: true,
                                    children: [
                                        { text: 'Подподузел 2.1.1', leaf: true },
                                        { text: 'Подподузел 2.1.2', leaf: true }
                                    ]
                                },
                                { text: 'Подузел 2.2', leaf: true }
                            ]
                        }
                    ]
                }
            ]
        }
    });
    
    // Создаем панель дерева
    var treePanel = Ext.create('Ext.tree.Panel', {
        title: 'Пример дерева',
        width: 300,
        height: 400,
        store: store,
        renderTo: Ext.getBody()
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
                        'Структура подразделения'+
                    '</section>'            
            },{
                region: 'center',
                bodyStyle: ' border: none; padding: 5px;',
                items: 
                [treePanel]
            }]
        });
}
