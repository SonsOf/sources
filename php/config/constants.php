<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(PHP_PATH .    'functions.php');

/** 
 * Ссылки 
 */

 define('URL_DATA_WORKER', "api.startatom.ru/web/rest/employee");
 define('URL_DATA_POST', "api.startatom.ru/web/rest/post");
 define('URL_DATA_STRUCTURE', "api.startatom.ru/web/rest/structure");
 define('MAIN_ADMIN', 'admin');

/**
 * Ошибки
 */
define('E_INVALID_PARAMS',					E_USER_ERROR + 1);

define('E_UNDEFINED_ACTION',				E_USER_ERROR + 2);
define('E_UNDEFINED_METHOD',				E_USER_ERROR + 3);

define('E_DB_CONFIG_FILE_NOT_FOUND',		E_USER_ERROR + 4);
define('E_DB_CONFIG_NOT_FOUND',				E_USER_ERROR + 5);
define('E_DB_CONNECTION_ERROR',				E_USER_ERROR + 6);

define('E_NO_ROLE',							E_USER_ERROR + 7);
define('E_ERROR_READING_USER_DATA',			E_USER_ERROR + 8);
define('E_USER_DATA_NOT_FOUND',				E_USER_ERROR + 9);
define('E_ERROR_READING_USER_ROLES',		E_USER_ERROR + 10);
define('E_USER_ROLES_NOT_FOUND',			E_USER_ERROR + 11);

define('E_USER_NOT_FOUND',					E_USER_ERROR + 12);

define('E_ERROR_SENDING_EMAIL',				E_USER_ERROR + 13);

define('E_ERROR_READING_DATA',				E_USER_ERROR + 14);
define('E_ERROR_READING_METADATA',			E_USER_ERROR + 15);
define('E_ERROR_EXECUTING_SQL_QUERY',		E_USER_ERROR + 16);
define('E_DATA_NOT_FOUND',					E_USER_ERROR + 17);

define('E_ERROR_CREATE_DB',					E_USER_ERROR + 18);
define('ERROR_REGISTR',						E_USER_ERROR + 19);
define('E_ERROR_PROJECT',					E_USER_ERROR + 20);



/**
 * Период
 */
define('PERIOD__JANUARY', 1);
define('PERIOD__FEBRUARY', 2);
define('PERIOD__MARCH', 3);
define('PERIOD__APRIL', 4);
define('PERIOD__MAY', 5);
define('PERIOD__JUNE', 6);
define('PERIOD__JULY', 7);
define('PERIOD__AUGUST', 8);
define('PERIOD__SEPTEMBER', 9);
define('PERIOD__OCTOBER', 10);
define('PERIOD__NOVEMBER', 11);
define('PERIOD__DECEMBER', 12);
define('PERIOD__1_QUARTER', 13);
define('PERIOD__2_QUARTER', 14);
define('PERIOD__3_QUARTER', 15);
define('PERIOD__4_QUARTER', 16);
define('PERIOD__YEAR', 17);

define('PERIODS', serialize([
	PERIOD__JANUARY => 'январь',
	PERIOD__FEBRUARY => 'февраль',
	PERIOD__MARCH => 'март',
	PERIOD__APRIL => 'апрель',
	PERIOD__MAY => 'май',
	PERIOD__JUNE => 'июнь',
	PERIOD__JULY => 'июль',
	PERIOD__AUGUST => 'август',
	PERIOD__SEPTEMBER => 'сентябрь',
	PERIOD__OCTOBER => 'октябрь',
	PERIOD__NOVEMBER => 'ноябрь',
	PERIOD__DECEMBER => 'декабрь',
	PERIOD__1_QUARTER => 'I квартал',
	PERIOD__2_QUARTER => 'II квартал',
	PERIOD__3_QUARTER => 'III квартал',
	PERIOD__4_QUARTER => 'IV квартал',
	PERIOD__YEAR => 'весь год'
]));

define('PERIODS__MONTHS', serialize([
	PERIOD__JANUARY,
	PERIOD__FEBRUARY,
	PERIOD__MARCH,
	PERIOD__APRIL,
	PERIOD__MAY,
	PERIOD__JUNE,
	PERIOD__JULY,
	PERIOD__AUGUST,
	PERIOD__SEPTEMBER,
	PERIOD__OCTOBER,
	PERIOD__NOVEMBER,
	PERIOD__DECEMBER
]));

define('PERIODS__QUARTERS', serialize([
	PERIOD__1_QUARTER,
	PERIOD__2_QUARTER,
	PERIOD__3_QUARTER,
	PERIOD__4_QUARTER
]));

define('PERIODS__YEAR', serialize([
	PERIOD__YEAR
]));

define('PERIODS__QUARTER_MONTHS', serialize([
	PERIOD__1_QUARTER => [
		PERIOD__JANUARY,
		PERIOD__FEBRUARY,
		PERIOD__MARCH
	],
	PERIOD__2_QUARTER => [
		PERIOD__APRIL,
		PERIOD__MAY,
		PERIOD__JUNE
	],
	PERIOD__3_QUARTER => [
		PERIOD__JULY,
		PERIOD__AUGUST,
		PERIOD__SEPTEMBER
	],
	PERIOD__4_QUARTER => [
		PERIOD__OCTOBER,
		PERIOD__NOVEMBER,
		PERIOD__DECEMBER
	]
]));

// Генерируем ХЭШ
define('HASH', generateHash());

// ДАННЫЕ БД
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');
define('DB_USER', 'postgres');
define('DB_PASS', 'postgres');

define('DB_SCHEME', 'public');

// Путь до файла дампа
define('DUMP_URL', "C:\OSPanel\domains\localhost\sources\dump.sql");
define('DUMP_URL2', "C:\OpenServer\domains\localhost\sources\dump.sql");

// СТРОКА СОЕДИНЕНИЯ
define('CONNECT_STRING', "host=" . DB_HOST . " port=" . DB_PORT . " dbname=" . DB_NAME . " user=" . DB_USER . " password=" . DB_PASS);