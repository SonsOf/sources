<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(PHP_PATH .    'functions.php');
require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH . 'DbConnection.php');

/**
 * Видеограмма registration.
 */
class registration {
	/**
	 * Инстанс соединения c базой данных
	 * @var objectне
	 */
	private $CI;
	private $CI2;

	/**
	 * Соединение с базой данных
	 * @var resource
	 */
	private $conn;
	private $conn2;

	/**
	 */
	public function __construct(){
		$this->CI = DbConnection::getInstance();
		$this->conn = $this->CI->getConnection();

		//$this->CI2 = DbConnection::getInstance(true);
		//$this->conn2 = $this->CI2->getConnection();
	}

	/**
	 */
	public function __destruct(){}

	/**
	 * Регистрируем пользователя
	 * @param object $args
	 * @return array
	 */
	public function registr($args){
		global $config;

		// Проверяем на наличие обязательных переменных
		if(empty($args->first_name)){
			throw new DbException('Не указана фамилия пользователя! ', ERROR_REGISTR);
		} else if(empty($args->name)){
			throw new DbException('Не указано имя пользователя! ', ERROR_REGISTR);
		} else if(empty($args->login)){
			throw new DbException('Вы не указали свой логин! ', ERROR_REGISTR);
		} else if(empty($args->password)){
			throw new DbException('Вы не установили пароль! ', ERROR_REGISTR);
		}

		// Проверяем, заполнены ли второстененные переменные. Если нет - обнуляем под БД 
		if(empty($args->second_name)){
			$args->second_name = null;
		} else if(empty($args->date_birth)){
			$args->date_birth = null;
		} else{
			// Обрабатываем дату для совместимости с PostgreSql
			$args->date_birth = pg_escape_string($args->date_birth);
		}

		/** Проверка на логин */
		$sql = "SELECT * FROM public.users WHERE login = $1";
		$res =  @pg_query_params($this->conn, $sql, [$args->login]);
		$rows = pg_fetch_assoc($res);

		if($rows){
			throw new DbException(ERROR_REGISTR,'Пользователь ' . $args->login .' уже существует! ', ERROR_REGISTR);
		}

		// Запрашиваем данные от REST API
		/*$rest = makeRequest(URL_DATA_WORKER, (array) $data);

		if ($rest) {
			forEach($rest as $key => $record){
				if($record->p704 == $data->p704){
					$data->ceh 	= $record->ceh;
					$result['success'] = true;
					break;
				}
			}
		}*/
		

		// Запись в таблицу
		$res = DbTableHelper::insert($this->conn, 'public.users', (array) $args);
		if(!$res){
			$err = DbTableHelper::getLastError();
			throw new DbException($err, 'Ошибка при регистрации пользователя! ', ERROR_REGISTR);
		} 
		// Сохраняем изменения
		$this->CI->commitTransaction();

		/*
		// Запись в таблицу
		$res = DbTableHelper::insert($this->conn2, 'public.users', (array) $args);
		if(!$res){
			$err = DbTableHelper::getLastError();
			throw new DbException($err, 'Ошибка при регистрации пользователя в таблицу 2! ', ERROR_REGISTR);
		}
		// Сохраняем изменения
		$this->CI2->commitTransaction();*/
	}
}