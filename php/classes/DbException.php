<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

/**
 * Класс ошибки базы данных PostgreSQL.
 */
class DbException extends Exception {
	/**
	 * Код ошибки.
	 * @var number
	 */
	protected $dbCode;

	/**
	 * Сообщение об ошибке.
	 * @var string
	 */
	protected $dbMessage;

	/**
	 * @param string $db_message сообщение об ошибке
	 * @param string $message (optional) сообщение об ошибке
	 * @param integer $code (optional) код ошибки
	 */
	public function __construct($db_message, $message = null, $code = 0){
		$this->dbCode = $code;
		$this->dbMessage = $db_message;
		if(!$message){
			$message = $db_message;
		}

		// Вызываем конструктор Exception
		parent::__construct($message, $code);
	}

	/**
	 */
	public function __destruct(){}

	/**
	 * Возвращает код ошибки.
	 * @return number
	 */
	public final function getDbCode(){
		return $this->dbCode;
	}

	/**
	 * Возвращает сообщение ошибки.
	 * @return string
	 */
	public final function getDbMessage(){
		return $this->dbMessage;
	}
}