<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

/**
 * Общие настройки
 */
// Режим отладки
$config['debug'] = false;

// Общий таймаут
$config['timeout'] = 10 * 60 * 1000;    // 10 мин.

// Формат даты при работе с сервером (js-эквивалент database.php -> $db['date_format'])
$config['date_format'] = 'd.m.Y H:i:s';

// Каталог с файлами видеограмм
$config['videograms']['directory'] = 'js/videograms';

// Ext.Direct
$config['ext_direct']['router'] = 'php/router.php';
$config['ext_direct']['type'] = 'remoting';
$config['ext_direct']['namespace'] = 'Server';
$config['ext_direct']['timeout'] = 3 * 60 * 1000;    // 3 мин.

// Принтеры
$config['printers']['xml'] = 'php/classes/printer.php';


/**
 * Роли.
 * Чем меньше индекс тем выше приоритет группы. Группа может включать несколько ролей
 */
$config['roles'] = [
	1 => ['admin']
];
