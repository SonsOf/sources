<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

/**
 * Приложение.
 */
class App {
	/**
	 */
	public function __construct(){}

	/**
	 */
	public function __destruct(){}

	/**
	 * Проверяет и ставит базу через dump.sql.
	 * @return array
	 */
	public function getDB(){
		// Проверяем, устанавливается ли соединение к БД. Если нет - то запускаем вложенный dump базы данных и создаем БД
		$result = DBConnection::check_connect();
		return $result;
	}

	/**
	 * Возвращает настройки приложения.
	 * @return array
	 */
	public function getSettings(){
			return [
			'API' => $this->getApi(),
			'INFO' => $this->getInfo(),
			'CONFIG' => $this->getConfig(),
			'CONSTANTS' => $this->getConstants(),
			'DATABASE' => $this->getDatabaseConfig()
			//'USER' => $this->getUserInfo(),
			/*'ROLE' => array(
				'group' => $this->getUserRolesGroup(),
				'roles' => $this->getUserRoles()
			)*/
		];
	}

	/**
	 * Возвращает API приложения.
	 * @return array
	 */
	public function getApi(){
		require(CONFIG_PATH . 'api.php');
		$v_api = $API;
		return $v_api;
	}

	/**
	 * Возвращает информацию о приложении.
	 * @return array
	 */
	public function getInfo(){
		require(CONFIG_PATH . 'app.php');
		$v_app = $app;
		return $v_app;
	}

	/**
	 * Возвращает конфиг приложения.
	 * @return array
	 */
	public function getConfig(){
		require(CONFIG_PATH . 'config.php');
		$v_config = $config;
		return $v_config;
	}

	/**
	 * Возвращает конфиг БД.
	 * @return array
	 */
	public function getDatabaseConfig(){
		require(CONFIG_PATH . 'database.php');
		$v_db = $db;
		return $v_db;
	}

	/**
	 * Возвращает константы приложения.
	 * @return array
	 */
	public function getConstants(){
		// см. constants.php
		// Все константы
		$all_constants = get_defined_constants(true);

		// Константы пользователя
		$constants = $all_constants['user'];

		// Удаляем константы путей (см. router.php, api.php, *_printer.php)
		unset($constants['BASE_PATH']);
		unset($constants['PHP_PATH']);
		unset($constants['CONFIG_PATH']);
		unset($constants['CLASS_PATH']);
		unset($constants['LIB_PATH']);

		// Десереализуем константы
		foreach($constants as $key => $val){
			if(false !== ($v = @unserialize($val))){
				$constants[$key] = $v;
			}
		}
		return $constants;
	}
}