<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

$API = [
	/**
	 * Класс разрабатываемого приложения
	 */
	'App' => [
		'methods' => [
			'getSettings' => [
				'len' => 0
			],
			'getDB' => [
				'len' => 0
			],
			'getApi' => [
				'len' => 0
			],
			'getInfo' => [
				'len' => 0
			],
			'getConfig' => [
				'len' => 0
			],
			'getConstants' => [
				'len' => 0
			],
			'getDatabaseConfig' => [
				'len' => 0
			]
		]
	],
	/**
	 * Класс общих функций
	 */
	'SH' => [
		'methods' => [
			'getDataWorker' => [
				'len' => 1
			],
			'getDataPost' => [
				'len' => 1
			],
			'getDataStructure' => [
				'len' => 1
			],
			'getRolesSystem' => [
				'len' => 1
			],
			'getRolesTask' => [
				'len' => 1
			],
			'getStatus' => [
				'len' => 1
			],
			'getPriority' => [
				'len' => 1
			],
			'getTypeTask' => [
				'len' => 1
			],
			'getTopicList' => [
				'len' => 1
			],
			'getInputTask' => [
				'len' => 1
			],
			'getUsers' => [
				'len' => 1
			]
		]
	],

	/**
	 * Класс пользователь
	 */
	'auth' => [
		'methods' => [
			'sing_in' => [
				'len' => 1
			],
			'getYourTask' => [
				'len' => 1
			]
		]
	], 
	/**
	 * Класс пользователь
	 */
	'admin' => [
		'methods' => [
			'getData' => [
				'len' => 1
			],
			'save' => [
				'len' => 1
			]
		]
	], 
	/**
	* Класс регистрации регистрация
	*/
   'registration' => [
	   'methods' => [
		   'registr' => [
			   'len' => 1
		   ]
	   ]
	],
	/**
	 * Класс проекта
	 */
	'project' => [
		'methods' => [
			// Получение проекта по номеру
			'set_project' => [
				'len' => 1
			],
			// Загрузка данных проекта
			'load_project' => [
				'len' => 1
			],
			// Загрузка заданий проекта
			'load_tasks_project' => [
				'len' => 1
			],
			// Загрузка исполнителей задания проекта
			'load_task_users' => [
				'len' => 1
			]
		]
	], 
	/**
		* Класс видеограммы "Поручено мною"
	*/
	'Entrusted_by_me' => [
		'methods' => [
			'getData' => [
				'len' => 1
			],
			'saveTask' => [
				'len' => 1
			],
			'getUsers' => [
				'len' => 1
			],
			'getWorkingDate' => [
				'len' => 1
			],
			'getPlan' => [
				'len' => 1
			]
		]
	],
	/**
		* Класс видеограммы "Поручено мне"
	*/
	'Entrusted_to_me' => [
		'methods' => [
			'getTaskToMe' => [
				'len' => 1
			],
			'saveReports' => [
				'len' => 1
			]
		]
	],
	/**
		* Класс видеограммы "Профиль"
	*/
	'Profile' => [
		'methods' => [
			'getProfile' => [
				'len' => 1
			],
			'save' => [
				'len' => 1
			]
		]
	],
	/**
		* Класс видеограммы "Отчеты"
	*/
	'Reports' => [
		'methods' => [
			'getReportsForDay' => [
				'len' => 1
			]
		]
	],
	'readXML' => [
		'methods' => [
			'save' => [
				'len' => 1,
				'formHandler' => true
			]
		]
	],
	/**
	* Класс печати 
	*/
	'printer' => [
		'methods' => [
			'Print_PDF' => [
				'len' => 1
			]
		]
	]
];