<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH .   'DbConnection.php');

require_once(CLASS_VIDEOGRAMS_PATH . 'auth.php');
require_once(CLASS_VIDEOGRAMS_PATH . 'project.php');

/**
 * Класс Entrusted_by_me (Проекты и его внутренности)
 */
class Profile {
	/**
	 * Инстанс соединения c базой данных
	 * @var object
	 */
	private $CI;
	/**
	 * Соединение с базой данных
	 * @var resource
     *
	 */
	private $conn;				// Наше соединение
    private $PROJECT;		    // ПРОЕКТ

    public function __construct(){
		$this->CI = DbConnection::getInstance();
		$this->conn = $this->CI->getConnection();
	}

    /**
	 */
	public function __destruct(){}

    // Загружаем данные пользователя в профиль
	public function getProfile($args = null){
		$data = [];

		// Берем наш класс пользователя
		$USER = new auth();
		// Подтягиваем данные по логину
		$USER->LOGIN = $args->login;

		$data = $USER->user_data;

		unset($USER);
		unset($data['PASS']);

		return $data;
	}

	// Корректируем данные профиля
	public function save($args){
		$result = [
			'success'	=> 'true',
			'msg'		=> ''
		];

		$data = new stdClass();
		$data->background = isset($args->background) ? $args->background : 'neptun';

		// Проверяем пароль... Если указан и совпадает, то берем новый для обновления
		if($args->password_old && $args->password_new){
			// Берем наш класс пользователя
			$USER = new auth();
			// Подтягиваем данные по логину
			$USER->LOGIN = $args->login;

			if($USER->user_data['PASS'] != $args->password_old){
				throw new DbException('Неверно указан старый пароль!','Неверно указан старый пароль!', E_ERROR_EXECUTING_SQL_QUERY);
			}

			$data->password = $args->password_new;
			unset($USER);
		}

		// Обновляем заявку
		$res = DbTableHelper::update($this->conn, 'public.users', (array) $data, [
			'login' => $args->login
		]);
		if(!$res){
			$err = DbTableHelper::getLastError();
			throw new DbException($err, 'Невозможно обновить данные профиля', E_ERROR_EXECUTING_SQL_QUERY);
		}

		unset($data);

		$result['msg']	= 'Данные профиля успешно изменены!';

		// Сохраняем изменения
		$this->CI->commitTransaction();

		return $result;
	}


}