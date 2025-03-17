<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

/**
 * Настройки базы данных
 */

$db['database']         = 'postgres';
$db['host']             = 'localhost';      // Или другой хост
$db['port']             = 5432;             // Порт по умолчанию для PostgreSQL
$db['username']         = 'postgres';       // Имя пользователя
$db['password']         = 'postgres';       // Пароль
$db['connect_string']   = 'host=localhost port=5432 dbname=postgres user=postgres password=postgres';


$db2['database'] = 'AS';
$db2['host'] = 'localhost';      // Или другой хост
$db2['port'] = 5432;             // Порт по умолчанию для PostgreSQL
$db2['username'] = 'postgres';   // Имя пользователя
$db2['password'] = 'postgres';   // Пароль
$db2['connect_string']   = 'host=localhost port=5432 dbname=AS user=postgres password=postgres';