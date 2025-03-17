<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

/**
 * Хелпер таблицы базы данных.
 */
class DbTableHelper {
	/**
	 * Последняя ошибка.
	 * @var string
	 */
	private static $error;

	/**
	 */
	private function __construct(){}

	/**
	 */
	public function __destruct(){}

	/**
	 */
	private function __clone(){}

	/**
	 */
	private function __wakeup(){}

	/**
	 * Описания функций select, insert, update и delete соответствуют описаниям соответствующих
	 * функций драйвера PostgreSQL (pg_select, pg_insert, pg_update и pg_delete) и взяты оттуда.
	 * Данные функции, в случае ошибок, генерируют не сообщения или предупреждения, а исключения.
	 */

	/**
	 * Выбирает записи из базы данных (см. описание pg_select).
	 */
	public static function select($connection, $table_name, $assoc_array, $options = PGSQL_DML_EXEC){
		return forward_static_call(['DbTableHelper', 'execFn'], 'pg_select', func_get_args());
	}

	/**
	 * Заносит данные из массива в таблицу базы данных (см. описание pg_insert).
	 */
	public static function insert($connection, $table_name, $assoc_array, $options = PGSQL_DML_EXEC){
		return forward_static_call(['DbTableHelper', 'execFn'], 'pg_insert', func_get_args());
	}

	/**
	 * Обновляет данные в таблице (см. описание pg_update).
	 */
	public static function update($connection, $table_name, $data, $condition, $options = PGSQL_DML_EXEC){
		return forward_static_call(['DbTableHelper', 'execFn'], 'pg_update', func_get_args());
	}

	/**
	 * Удаляет записи (см. описание pg_delete).
	 */
	public static function delete($connection, $table_name, $assoc_array, $options = PGSQL_DML_EXEC){
		return forward_static_call(['DbTableHelper', 'execFn'], 'pg_delete', func_get_args());
	}

	public static function execFn($fn_name, $fn_args){
		// Результат выполнения функции
		$result = false;

		/**
		 * Для чего это всё сделано:
		 * функции pg_select, pg_insert, pg_update и pg_delete в случае ошибок в параметрах
		 * или в имени таблицы генерируют сообщения E_NOTICE или предупреждения E_WARNING.
		 * E_NOTICE и E_WARNING не являются исключениями, поэтому поймать их в блоке
		 * try - catch нельзя.
		 * Чтобы иметь контроль над ними и чтобы они автоматически не выводились в браузер
		 * здесь используется замена обработчика ошибок с помощью set_error_handler.
		 */

		// Перехватываем сообщения вызванные функцией и генерируем из них исключения
		try {
			// Заменяем обработчик ошибок на время выполнения функции
			set_error_handler(function($err_no, $err_str, $err_file, $err_line, $err_context){
				// Из любого сообщения генерируем исключение
				throw new ErrorException($err_str, $err_no, E_ERROR, $err_file, $err_line);
			});

			// Выполняем функцию
			$result = call_user_func_array($fn_name, $fn_args);
		} catch(Exception $e){
			// Сохраняем ошибку
			static::setError($e->getMessage());
		}

		// Восстанавливаем обработчик ошибок
		restore_error_handler();

		// Возвращаем результат
		return $result;
	}

	/**
	 * Возвращает последнюю ошибку.
	 * @return string
	 */
	public static function getLastError(){
		return static::$error;
	}

	/**
	 * Сохраняет текст ошибки
	 * @param string $error текст ошибки
	 */
	protected static function setError($error){
		static::$error = $error;
	}
}