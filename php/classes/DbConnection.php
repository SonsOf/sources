<?php
//defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH . 'DbException.php');

/**
 * Класс для работы с соединениями базы данных.
 */
class DbConnection {
	/**
	 * База данных.
	 * @var string
	 */
	private $database;

	/**
	 * Соединение с базой данных.
	 * @var resource
	 */
	private $conn;

	/**
	 * Начать ли транзакцию при создании соединения.
	 * @var boolean
	 */
	private $autoStartTransaction = true;

	/**
	 * Инстанс класса: основное соединение.
	 * @var object
	 */
	private static $instance;

	/**
	 * Инстансы класса: изолированные соединения.
	 * @var array
	 */
	private static $newInstances = [];

	/**
	 * @param boolean $new если установлено в true, то создаётся новое соединение
	 */
	private function __construct($new = false){
		// Проверяем есть ли файл с настройками
		if(!file_exists($file_path = (CONFIG_PATH . 'database.php'))){
			throw new Exception('Не найден конфигурационный файл базы данных', E_DB_CONFIG_FILE_NOT_FOUND);
		}

		// Загружаем файл с настройками БД
		require($file_path);

		// Есть ли настройки в файле?
		if(!isset($db) || (count($db) === 0)){
			throw new Exception('Не найдены настройки в конфигурационном файле базы данных', E_DB_CONFIG_NOT_FOUND);
		}

		// Настройка ДБ
		if($new){
			$this->database = $db2['database'];
			$this->db_data	= $db2;
		} else {
			$this->database = $db['database'];
			$this->db_data	= $db;
		}

		// Устанавливаем соединение
		$this->connect($new, $this->db_data);

		// Запускаем транзакцию при создании соединения
		if($this->autoStartTransaction){
			$this->startTransaction();
		}
	}

	/**
	 */
	public function __destruct(){
		$this->disconnect();
	}

	/**
	 */
	private function __clone(){}

	/**
	 */
	private function __wakeup(){}

	/**
	 * Создаёт соединение с БД.
	 * @param boolean $new если установлено в true, то создаётся новое соединение
	 */
	private function connect($new, $db){
		try {
			// Если не удается установить соединение, то драйвер pg генерирует warning.
			// Перехватить warning в try - catch нельзя, поэтому меняем обработчик на время подключения:
			set_error_handler(function($errno, $errstr, $errfile, $errline, $errcontext){
				throw new ErrorException($errstr, $errno, E_ERROR, $errfile, $errline);
			});
			
			// Создаём соединение
			$this->conn = @pg_connect($db['connect_string']);


			// Восстанавливаем обработчик
			restore_error_handler();
		} catch(Exception $e){
			// Маскируем под DbException
			throw new DbException($e->getMessage(), 'Невозможно установить соединение с базой данных', E_DB_CONNECTION_ERROR);
		}
	}

	/**
	 * Закрывает соединение с БД.
	 */
	private function disconnect(){
		if($this->conn){
			@pg_close($this->conn);
		}
	}

	/**
	 * Начинает транзакцию.
	 */
	public function startTransaction(){
		if(!@pg_query($this->conn, 'START TRANSACTION')){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно начать транзакцию', E_ERROR_EXECUTING_SQL_QUERY);
		}
	}

	/**
	 * Завершает транзакцию.
	 */
	public function commitTransaction(){
		if(!@pg_query($this->conn, 'COMMIT')){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно завершить транзакцию', E_ERROR_EXECUTING_SQL_QUERY);
		}
	}

	/**
	 * Откатывает транзакцию.
	 */
	public function rollbackTransaction(){
		if(!@pg_query($this->conn, 'ROLLBACK')){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно откатить транзакцию', E_ERROR_EXECUTING_SQL_QUERY);
		}
	}

	/**
	 * Создаёт точку сохранения с именем name.
	 * @param string $name имя точки сохранения
	 */
	public function setSavepoint($name){
		$name = pg_escape_string($name);
		if(!@pg_query($this->conn, "SAVEPOINT $name")){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно создать точку сохранения', E_ERROR_EXECUTING_SQL_QUERY);
		}
	}

	/**
	 * Удаляет точку сохранения с именем name.
	 * @param string $name имя точки сохранения
	 */
	public function releaseSavepoint($name){
		$name = pg_escape_string($name);
		if(!@pg_query($this->conn, "RELEASE SAVEPOINT $name")){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно удалить точку сохранения', E_ERROR_EXECUTING_SQL_QUERY);
		}
	}

	/**
	 * Производит откат транозакции до точки сохранения с именем name.
	 * @param string $name имя точки сохранения
	 */
	public function rollackToSavepoint($name){
		$name = pg_escape_string($name);
		if(!@pg_query($this->conn, "ROLLBACK TO SAVEPOINT $name")){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно откатить транзакцию до точки сохранения', E_ERROR_EXECUTING_SQL_QUERY);
		}
	}

	/**
	 * Возвращает ресурс соединения.
	 * @return resource
	 */
	public function __call($name, $arguments){
		if(in_array($name, ['connect', 'getConnection'])){
			return $this->conn;
		}
	}

	/**
	 * Возвращает ресурс соединения.
	 * @return resource
	 */
	public static function __callStatic($name, $arguments){
		if(in_array($name, ['connect', 'getConnection'])){
			return static::getInstance()->getConnection();
		}
	}


	/**
	 * Создаёт и возвращает инстанс класса.
	 * @param boolean $new если установлено в true, то создаётся новое соединение
	 * @return DbConnection
	 */
	public static function getInstance($new = false){
		// Если новое соединение
		if($new){
			// Инстанс нового соединения
			$CI = new static(true);

			// Сохраняем инстанс
			static::$newInstances[] = $CI;

			return $CI;
		}

		// Инстанса основного соединения нет
		if(null === static::$instance){
			static::$instance = new static(false);
		}

		// Возвращаем инстанс основного соединения
		return static::$instance;
	}

	/**
	 * Закрывает основное соединение и удаляет его инстанс.
	 */
	public static function close(){
		static::$instance->disconnect();
		static::$instance = null;
	}

	/**
	 * Закрывает новые соединения и удаляет их инстансы.
	 */
	public static function closeNew(){
		foreach(static::$newInstances as &$instance){
			$instance->disconnect();
		}
		static::$newInstances = [];
	}

	/**
	 * Закрывает все соединения и удаляет их инстансы.
	 */
	public static function closeAll(){
		static::close();
		static::closeNew();
	}

	/**
	 * Проверяем соединение с БД (При входе проверка на загрузку БД из dump базы).
	 */
	public static function check_connect(){
		$result = [
			'success' 	=> true,
			'msg' 		=> ''
		];
		// Создаём соединение
		$conn = @pg_connect(CONNECT_STRING);

		// Подключение установлено, проверяем наличие схемы и ключевой таблицы
		if($conn){
			$sql = "
				SELECT count(*) FROM information_schema.schemata WHERE schema_name = $1
			";
			$qres = @pg_query_params($conn, $sql, [DB_SCHEME]);
			if(!$qres){
				$err = pg_last_error($conn);
				throw new DbException($err, 'Ошибка при опрпделении наличия схемы', E_ERROR_READING_DATA);
			}
			$check = ((int) pg_fetch_result($qres, 0) > 0);

			// Проверяем, есть ли схема public
			if($check){
				$sql = "SELECT to_regclass('public.users')";
				$qres = @pg_query($conn, $sql);
				if(!$qres){
					$err = pg_last_error($conn);
					throw new DbException($err, 'Ошибка при опрпделении наличия таблицы users!', E_ERROR_READING_DATA);
				}
				// ПРоверяем, не пуста ли переменная
				$check = empty(pg_fetch_result($qres, 0));

				if($check){
					$result = DBConnection::start_dump();
				} else { 
					$sql = "SELECT to_regclass('public.task')";
					$qres = @pg_query($conn, $sql);
					if(!$qres){
						$err = pg_last_error($conn);
						throw new DbException($err, 'Ошибка при опрпделении наличия таблицы task!', E_ERROR_READING_DATA);
					}
					// ПРоверяем, не пуста ли переменная
					$check = empty(pg_fetch_result($qres, 0));

					if($check){
						$result = DBConnection::start_dump();
					}
				}				
			} else {
				$result = DBConnection::start_dump();
			}
		} else {
			throw new DbException($err, 'База данных отсутствует!', E_ERROR_READING_DATA);
		}

		return $result;
	}

	/**
	 * Создаем базу данных через файл dump.sql.
	 */
	public static function start_dump(){
		$result = [
			'success' 	=> false,
			'msg' 		=> ''
		];

		// Команда для восстановления базы данных из дампа
		$restoreDbCommand = "psql --username=" . DB_USER . " --dbname=" . DB_NAME ." < " . DUMP_URL;

		// Восстановление базы данных из дампа
		if (!shell_exec($restoreDbCommand)) {
			throw new DbException('Ошибка дампа', 'Не удалось восстановить базу данных из дампа ' . DB_NAME, E_ERROR_CREATE_DB);
		}

		$result['success'] 	= true;
		$result['msg']		= 'Настройка системы завершена, база данных успешно установлена на сервер!';

		return $result;
	}
}