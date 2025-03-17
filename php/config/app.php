<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

/**
 * Приложение
 */
// Код задачи
$app['code'] = 'AtomSkills';

// Название задачи
$app['name'] = 'Программа для AtomSkills';

// Версия (нужна ли?)
$app['version'] = '1.0';

// Дата начала создания задачи
$app['created'] = '18.01.2025';

// URL задачи
$app['url'] = 'https://localhost/sources';

// Разработчики
$app['developers'] = [
	[
		'name' => 'Грязева А.',
		'fullname' => 'Грязева Алена'
	]
];

// Программисты
$app['programmers'] = [
	[
		'name' 		=> 'Егоров С.',
		'fullname' 	=> 'Егоров Сергей',
		'mail' 		=> 'Footballegorov@yandex.ru',
		'size'		=> 'backend'
	], [
		'name' 		=> 'Исаева А.',
		'fullname' 	=> 'Исаева Анастасия',
		'mail' 		=> '-',
		'size' 		=> 'frontend'
	]
];