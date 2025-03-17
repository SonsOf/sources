

function initializeHospitalDropZone(v) 
{
    var gridView = v,
        
    grid = gridView.up('gridpanel');

    grid.dropZone = Ext.create('Ext.dd.DropZone', v.el, 
    {
        getTargetFromEvent: function(e) 
        {
            return e.getTarget('.hospital-target');
        },

        onNodeEnter : function(target, dd, e, data)
        {
            Ext.fly(target).addCls('hospital-target-hover');
        },

        onNodeOut : function(target, dd, e, data)
        {
            Ext.fly(target).removeCls('hospital-target-hover');
        },

        onNodeOver : function(target, dd, e, data)
        {
            return Ext.dd.DropZone.prototype.dropAllowed;
        },

        onNodeDrop : function(target, dd, e, data)
        {
            var rowBody = Ext.fly(target).findParent('.x-grid-rowbody-tr', null, false),
                mainRow = rowBody.previousSibling,
                hospital = gridView.getRecord(mainRow),
                targetEl = Ext.get(target),
                html = targetEl.dom.innerHTML,
                patients = hospital.get('patients');
                
            if (!patients) 
            {
                patients = [];
                hospital.set('patients', patients);
            }

            patients.push(data.patientData.fio);
            html = patients.join(', ');
            targetEl.update(html);
            Ext.Msg.alert('Drop gesture', 'Dropped patient ' + data.patientData.fio +
                ' on hospital ' + hospital.get('TASK_NAME'));

                otpravit_v_gruppu(data.patientData.id7, hospital.get('TASK_NAME'))
			return true;
        }
    });
}

function otpravit_v_gruppu()
{

    alert('Назначаем ');
}


Ext.require(['*']);
var store_Users;
function function_Purpose_of_tasks(var_id_project) 
{
    var store_Tasks = Ext.create('Ext.data.Store', {        
        fields: [
            {name: 'TASK_NAME',     type: 'string'},
            {name: 'DESCRIPTION', 	type: 'string'}
        ],
        proxy: {
            type: 'direct',
            directFn: Server.project.load_tasks_project,
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

                proxy.setExtraParam('id_project', var_id_project);
            }
        }
    });
    
    var patientView = Ext.create('Ext.view.View', 
    {
        store: 'users',
        height: 400,
        cls: 'patient-view',
        tpl: new Ext.XTemplate
        (
            '<tpl for=".">' +
                '<div class="patient-source">'+
                    '<table style="border: 1px dashed grey;">'+
                        '<tbody>' +
                            '<tr style="border: 1px dashed grey;">'+
                                '<td class="patient-label">Задача</td>'+
                                '<td class="patient-name2">{fio}</td>'+
                            '</tr><tr style="border: 1px dashed grey;">'+
                                '<td class="patient-label">Описание</td>'+
                                '<td class="patient-name2">{}</td>'+
                            '</tr><tr style="border: 1px dashed grey;">'+
                                '<td class="patient-label">Приоритет</td>'+
                                '<td class="patient-name2">{}</td>'+
                            '</tr>' +
                        '</tbody>'+
                    '</table>'+
                '</div>' +     
            '</tpl>'
        ),
        itemSelector: 'div.patient-source',
        overItemCls: 'patient-over',
        selectedItemClass: 'patient-selected',
        singleSelect: true,
        
        listeners: {
            render: initializePatientDragZone
        }
    });    


    


    var grid_Tasks = Ext.create('Ext.grid.Panel', {
        title: 'Задачи',
        region: 'center',
        height: 400,
        margins: '0 5 5 0',
        sortableColumns: false,
        store: store_Tasks,
        columns: [{
            dataIndex: 'TASK_NAME',
            header: 'Наименование задачи',
            width: 200
        }, {
            dataIndex: 'DESCRIPTION',
            header: 'Описание',
            width: 150
        }],
        features: [{
            ftype:'rowbody',
            setup: function(rows, rowValues) {
                Ext.grid.feature.RowBody.prototype.setup.apply(this, arguments);
                rowValues.rowBodyDivCls = 'hospital-target';
            },
            getAdditionalData: function(data) {
                var patients = data.patients,
                    html;
                if (patients) {
                    html = patients.join(', ');
                } else {
                    html = '<div style = "color: grey;">Перечень сотрудников...</div>';
                }
                return {
                    rowBody: html
                };
            }
        }],
        viewConfig: {
            listeners: {
                render: initializeHospitalDropZone
            }
        }
    });

    var grid_Tasks2 = Ext.create('Ext.grid.Panel', {
        title: 'Задачи',
        region: 'center',
        margins: '0 5 5 0',
        height: 200,
        sortableColumns: false,
        store: 'users',
        columns: [{
            dataIndex: 'fio',
            header: 'Наименование задачи',
            width: 200
        }],
        features: [{
            ftype:'rowbody',
            setup: function(rows, rowValues) {
                Ext.grid.feature.RowBody.prototype.setup.apply(this, arguments);
                rowValues.rowBodyDivCls = 'hospital-target';
            }
        }],
        viewConfig: {
            listeners: {
                render: initializePatientDragZone
            }
        }
    });
    
    var window_Autorization = new Ext.Window({
        layout: 'border',
        width: 800,
        height: 300,
        items: 
        [{
            region: 'west',
            width: 400,
            items: grid_Tasks2
        },{
            region: 'center',
            items: grid_Tasks 
        }]
    });
    window_Autorization.show();
};

function initializePatientDragZone(v) {
    v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(), {

        getDragData: function(e) {
            var sourceEl = e.getTarget(v.itemSelector, 10), d;
            if (sourceEl) {
                d = sourceEl.cloneNode(true);
                d.id = Ext.id();
                return (v.dragData = {
                    sourceEl: sourceEl,
                    repairXY: Ext.fly(sourceEl).getXY(),
                    ddel: d,
                    patientData: v.getRecord(sourceEl).data
                });
            }
        },

        getRepairXY: function() {
            return this.dragData.repairXY;
        }
    });
}
