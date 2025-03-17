<?php
/**
 * Корневой модуль.
 * Генератор API для Ext.Direct
 */
header('Content-Type: text/javascript');

/** Преобразуем используемые пути в константы */
define('BASE_PATH', dirname(__FILE__) . '/../');
define('PHP_PATH', BASE_PATH . 'php/');
define('CONFIG_PATH', PHP_PATH . 'config/');
define('CLASS_PATH', PHP_PATH . 'classes/');
define('LIB_PATH', PHP_PATH . 'lib/');

/** Подключаем библиотеки */
require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');
require_once(CONFIG_PATH . 'api.php');
require_once(PHP_PATH . 'functions.php');

$actions = [];

/** Работаем по файлу /config/api.php получаем методы для передачи их в JS */
foreach($API as $aname => &$a){
	$methods = [];
	foreach($a['methods'] as $mname => &$m){
		$md = [
			'name' => $mname,
			'len' => $m['len']
		];
		if(isset($m['formHandler']) && $m['formHandler']){
			$md['formHandler'] = true;
		}
		$methods[] = $md;
	}
	$actions[$aname] = $methods;
}

/** Объединяем всё для вывода */
$cfg = [
	'url' => $config['ext_direct']['router'],
	'type' => $config['ext_direct']['type'],
	'timeout' => $config['ext_direct']['timeout'],
	'actions' => $actions,
	'namespace' => $config['ext_direct']['namespace']
];

/** Выводим наш REMOTING_API для вывода в init.js */
echo('Ext.app.REMOTING_API = ' . json_encode($cfg) . ';');