var win;
//	Настройки терминала
var terminalConfig = {
	autoExit:				true,			//	Разрешить автоматический выход из сессии 
	autoExitExitTime:		3 * 1000,	//	ещё через autoExitExitTime выход
	refreshInterval:		100,			//	точность вывода времени, мс
	exitTimerId:			null,
	refreshTimerId:			null,
	timeoutMessageBox:		null,			//	Сообщение об окончании сессии
	lastActivity:			null
};
Ext.onReady(function() 
{   

	// document.body
	var docBody = Ext.getBody();

   	// Провайдер Ext.direct (см. php/api.php, php/config/api.php)
	Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

	// Ошибка Ext.direct (от "сервер недоступен" до неперехваченного "throw" в php-скрипте)
	Ext.direct.Manager.on('exception', function(e){

		// Формируем сообщение
		var errorMsg;

		// Если ошибка БД замаскирована
		if(e.db_message){
			errorMsg = `${escapeHTML(e.db_message)} (${e.db_code})`;
		}
		if(e.message){
			errorMsg = `${escapeHTML(e.message)} (${e.code})`;
		}

		showTimeoutMessage(errorMsg);
	});


	// Выводим маску
	docBody.mask('Загрузка настроек...');

	// Загружаем настройки приложения
	Server.App.getSettings(function(settings, e, success){
		// Скрываем маску
		docBody.unmask();
		
		// Проверяем статус
		// При ошибке выполнится обработчик события Ext.direct.Manager.exception (см. выше)
		if(!success){
			return;
		}

		// Проверяем загрузились ли настройки
		if(!settings || !Ext.isObject(settings)){
			var errMsg = 'Невозможно загрузить настройки приложения';
			Ext.Msg.alert('Ошибка', errMsg);
			return;
		}

		// Применяем настройки
		Ext.apply(window, settings);
	});


	// Выводим маску
	docBody.mask('Проверка базы данных...');

	Server.App.getDB(function(result, e, success){
		// Скрываем маску
		docBody.unmask();

		// Проверяем статус
		// При ошибке выполнится обработчик события Ext.direct.Manager.exception (см. выше)
		if(!success){
			return;
		}

		if(result.msg){
			Ext.Msg.alert('Сообщение', result.msg);
		}

		// Загружаем неизменяющиеся данные (классификаторы, списки и т.д.)
		preloadStores(function(){
			// Скрываем маску
			docBody.unmask();
		});
	});


	// Загружаем экраны видеограмм
	initHeader();
	addListeners();
	form_Autorization();
	//form_Administration();
	//form_Registration();
	//form_Menu();
	//form_Profile();
	//form_Entrusted_By_Me();
	//form_Entrusted_To_Me();




	// Загружает неизменяющиеся данные (классификаторы, списки и т.д.)
	function preloadStores(callback){

		// Пользователи системы
		Ext.create('Ext.data.Store', {
			storeId: 'users',
			fields: [
				{name: 'id_user', 		type: 'int'},
				{name: 'login', 		type: 'string'},
				{name: 'fio', 			type: 'string'},
				{name: 'name', 			type: 'string'},
				{name: 'first_name', 	type: 'string'},
				{name: 'second_name', 	type: 'string'},
				{name: 'gender', 		type: 'string'},
				{name: 'date_birth', 	type: 'date', format: 'dd.mm.yyyy'},
				{name: 'date_reg', 		type: 'date', format: 'dd.mm.yyyy'},
				{name: 'role_system', 	type: 'string'},
				{name: 'name_role', 	type: 'int'},
				{name: 'position', 		type: 'string'},
				{name: 'proflevel', 	type: 'int'},
				{name: 'creating', 		type: 'int'}
			],
			proxy: {
				type: 'direct',
				directFn: Server.SH.getUsers,
				reader: 'json'
			}
		});

		// Роли системы
		Ext.create('Ext.data.Store', {
			storeId: 'roles_system',
			fields: [
				{name: 'role_system', 	type: 'int'},
				{name: 'name_role', 	type: 'string'}
			],
			proxy: {
				type: 'direct',
				directFn: Server.SH.getRolesSystem,
				reader: 'json'
			}
		});

		// Роли проекта
		Ext.create('Ext.data.Store', {
			storeId: 'roles_task',
			fields: [
				{name: 'role_task', 	type: 'int'},
				{name: 'name_role', 	type: 'string'}
			],
			proxy: {
				type: 'direct',
				directFn: Server.SH.getRolesTask,
				reader: 'json'
			}
		});

		// Статусы проектов и задач
		Ext.create('Ext.data.Store', {
			storeId: 'status',
			fields: [
				{name: 'status', 		type: 'int'},
				{name: 'status_name', 	type: 'string'}
			],
			proxy: {
				type: 'direct',
				directFn: Server.SH.getStatus,
				reader: 'json'
			}
		});

		// Приоритеты задач
		Ext.create('Ext.data.Store', {
			storeId: 'priority',
			fields: [
				{name: 'priority', 		type: 'int'},
				{name: 'priority_name', type: 'string'}
			],
			proxy: {
				type: 'direct',
				directFn: Server.SH.getPriority,
				reader: 'json'
			}
		});

		// Приоритеты задач
		Ext.create('Ext.data.Store', {
			storeId: 'type_task',
			fields: [
				{name: 'id_type', 		type: 'int'},
				{name: 'name_type', 	type: 'string'}
			],
			proxy: {
				type: 'direct',
				directFn: Server.SH.getTypeTask,
				reader: 'json'
			}
		});

		// Приоритеты задач
		Ext.create('Ext.data.Store', {
			storeId: 'input_task',
			fields: [
				{name: 'creating', 		type: 'int'},
				{name: 'name', 			type: 'string'}
			],
			proxy: {
				type: 'direct',
				directFn: Server.SH.getInputTask,
				reader: 'json'
			}
		});	

		
		// Что нужно загрузить, перечисляем id stores
		var storesIdsToLoad = [
			'users',
			'roles_system',
			'roles_task',
			'status',
			'priority',
			'type_task',
			'input_task'
		];

		// Формируем задачу загрузки
		var storesLoadTask = storesIdsToLoad.map(function(storeId){
			return {
				storeId: storeId,
				loaded: false
			};
		});

		// Запускаем загрузку
		storesLoadTask.forEach(function(task){
			Ext.StoreMgr.lookup(task.storeId).load({
				callback: function(){
					task.loaded = true;

					// Все ли загружены?
					var taskComplete = storesLoadTask.every(function(t){
						return t.loaded;
					});

					if(taskComplete){
						// Предзагрузка завершена
						if(Ext.isFunction(callback)){
							callback(storesIdsToLoad);
						}
					}
				}
			});
		});
	}
});

// Инициализация таймера (В него передаем сообщение)
function initTimers(){
	if(!terminalConfig.autoExit){
		return;
	}

	terminalConfig.lastActivity = new Date();

	terminalConfig.exitTimerId = setTimeout(function(){
		showTimeoutMessage();
		stopTimers();

		terminalConfig.timeoutMessageBox.hide();
		terminalConfig.timeoutMessageBox = null;

		// Выходим из терминала
		isTerminal = false;
	}, terminalConfig.autoExitExitTime);
}

function stopTimers(){
	clearTimeout(terminalConfig.exitTimerId);
	clearInterval(terminalConfig.refreshTimerId);
}

function resetTimers(){
	stopTimers();
	initTimers();
}

function showTimeoutMessage(msg){
	terminalConfig.timeoutMessageBox = Ext.Msg.alert('Сообщение',msg + 
		'<hr> Закрытие через <span id="remaining"></span> сек.<br/>'
	);
	resetTimers();
	var rt = Ext.get('remaining');
	terminalConfig.refreshTimerId = setInterval(function(){
		var remaining = Math.ceil(
			(
				(terminalConfig.lastActivity - (new Date())) +
				terminalConfig.autoExitExitTime
			) / 1000
		);
		rt.dom.innerHTML = remaining;
	}, terminalConfig.refreshInterval);
}

