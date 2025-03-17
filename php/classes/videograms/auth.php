<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH . 'DbConnection.php');

/**
 * Класс auth (Авторизация + берём данные пользователя)
 */
class auth {
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
    private $login;				// Логин пользователя
	public  $user_data = [];	// Данные пользователя

	/**
	 */
	public function __construct($login = false){
		$this->CI = DbConnection::getInstance();
		$this->conn = $this->CI->getConnection();

        if($login !== false){
			$this->set_user($login);
		}
	}

	/**
	 */
	public function __destruct(){}

	// Вызов get свойства
	public function __get($name){
		$name = strtoupper($name);
		if(array_key_exists($name, $this->sp_data)){
			return $this->sp_data[$name];
		} else {
			return false;
		}
	}

	// Вызов set свойства
	public function __set($name, $value){
		$name = strtoupper($name);
		if($name === 'LOGIN'){
			$this->set_user($value);
		} else {
			return false;
		}
		return true;
	}

    /* public */
	// Добавляем данные авторизированного пользователя
	public function set_user($login){
		$this->LOGIN = (string) $login;
		$this->user_data = [];

		$data = $this->load_user_data();
		if($data){
			$this->user_data = array(
				'ID_USER' 			=> (string) $data['ID_USER'],
				'LOGIN' 			=> (string) $data['LOGIN'],
				'NAME'				=> (string) $data['NAME'],
				'FIRST_NAME'		=> (string) $data['FIRST_NAME'],
				'SECOND_NAME'		=> (string) $data['SECOND_NAME'],
				'PASS'				=> (string) $data['PASSWORD'],
				'DATE_BIRTH'		=> (string) $data['DATE_BIRTH'],
				'ROLE' 	        	=> (string) $data['ROLE'],
				'ID_RUK'   			=> (int) $data['ID_RUK'],
				'ROLE_SYSTEM' 		=> (int) $data['ROLE_SYSTEM'],
                'DATE_REG'      	=> (string) $data['DATE_REG'],
				'BACKGROUND'    	=> (string) $data['BACKGROUND'],
				'POSITION'   		=> (string) $data['POSITION'],
				'GENDER'   			=> (string) $data['GENDER'],
				'BOSS_ID'   		=> (int) $data['BOSS_ID'],
				'PROFLEVEL'   		=> (string) $data['PROFLEVEL'],
				'CREATING'   		=> (string) $data['CREATING'],
				'KOL_USER_SYSTEM'   => (int) $data['KOL_USER_SYSTEM'],
				'LOCAL_BOSS'		=> (bool) $data['LOCAL_BOSS'],
				'MAIN_BOSS'			=> (bool) ($data['BOSS_ID'] == 0) ? true : false
			);
		}
	}

    // Загружаем данные пользователя
	public function load_user_data(){
		$data = [];

		$sql = "
			SELECT a.id_user, a.login, a.role_system, a.name, a.first_name, a.second_name, a.password, a.date_birth, a.date_reg, a.background, 
					a.position, a.gender, a.boss_id, a.proflevel, a.creating,
					(SELECT name_role FROM public.roles_system k WHERE a.role_system = role_system) as role,
					(SELECT count(*) from public.users where login != 'admin') as kol_users_system,
					(SELECT count(t.*) from public.users t where a.id_user = t.boss_id) as kol_isp
			FROM
				public.users a
			WHERE
				(login = $1)
		";

		$qres = @pg_query_params($this->conn, $sql, [$this->LOGIN]);

		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно прочитать данные пользователя', E_ERROR_READING_DATA);
		}
		if($row = pg_fetch_assoc($qres)){
			$data = [
				'ID_USER'			=> (int) $row['id_user'],
				'LOGIN' 	    	=> (string) $row['login'],
				'NAME' 	    		=> (string) $row['name'],
				'FIRST_NAME' 		=> (string) $row['first_name'],
				'SECOND_NAME' 		=> (string) $row['second_name'],
				'PASSWORD'			=> (string) $row['password'],
				'DATE_BIRTH' 		=> (string) $row['date_birth'],
				'DATE_REG' 	    	=> $row['date_reg'],
				'ROLE_SYSTEM'		=> $row['role_system'],
				'ROLE'				=> $row['role'],
				'ID_RUK'			=> (int) $row['id_ruk'],
				'BACKGROUND'		=> (string) $row['background'],
				'GENDER'			=> (string) $row['gender'],
				'BOSS_ID'			=> (int) $row['boss_id'],
				'PROFLEVEL'			=> (int) $row['proflevel'],
				'CREATING'			=> (int) $row['creating'],
				'POSITION'			=> (string) $row['position'],
				'LOCAL_BOSS'		=> ($row['kol_isp'] > 0) ? true : false,
				'KOL_USER_SYSTEM'	=> (int) $row['kol_users_system']
			];
		}

		pg_free_result($qres);

		return $data;
	}

	// Регистрируем главного админа
	private function reg_main_admin($args){

		// Создаём новый std класс для записи данных
		$admin_reg 				= new stdClass();
		$admin_reg->id_user		= 999999;
		$admin_reg->name		= 'Имя';
		$admin_reg->first_name 	= 'Фамилия';
		$admin_reg->second_name = 'Отчество';
		$admin_reg->date_birth  = pg_escape_string(date('Y-m-d H:i:s'));
		$admin_reg->role_system	= 1;
		$admin_reg->login		= $args->login;
		$admin_reg->boss_id		= 999999;
		$admin_reg->password 	= $args->password;

		// Запись в таблицу
		$res = DbTableHelper::insert($this->conn, 'public.users', (array) $admin_reg);
		if(!$res){
			$err = DbTableHelper::getLastError();
			throw new DbException($err, 'Ошибка при регистрации пользователя! ', E_ERROR_EXECUTING_SQL_QUERY);
		} 

		// Сохраняем изменения
		$this->CI->commitTransaction();
	}

    // Проверяет существует ли пользователь
	public function is_exist(){
		return isset($this->user_data['LOGIN']);
	}

	// Проверяет существует ли СП
	public function check_password($password){
		return ($this->user_data['PASS'] == $password);
	}

	/**
	 * Возвращает список заявок.
	 * @param object $args
	 * @return array
	 */
	public function sing_in($args){
		$result = [
			'success' 	=> true,
			'msg' 		=> '',
			'data'		=> []
		];
		// Берем наш класс
		$USER = new auth();
		// Подтягиваем данные по логину
		$USER->LOGIN = $args->login;

		// Если пользователь существует
		if($USER->is_exist()){
			if($USER->check_password($args->password)){
				unset($USER->user_data['PASS']);
				if(isset($USER->user_data['ROLE'])){
					$result['data'] 	= $USER->user_data;
				} else {
					$result['success'] 	= false;
					$result['msg']		= 'Ваша учётная запись не подтверждена администратором';
				}
			} else {
				$result['success'] 	= false;
				$result['msg']		= 'Неправильный логин или пароль';
			}
		} else {
			if($USER->LOGIN === MAIN_ADMIN){
				$USER->reg_main_admin($args);
				$result['success'] 	= false;
				$result['msg']		= 'Учетная запись <b color="red">' . MAIN_ADMIN . '</b> отсутствала! <br> Вы зарегистрированы как ' . MAIN_ADMIN;
			} else {
				$result['success'] 	= false;
				$result['msg']		= 'Пользователь ' . $USER->LOGIN . ' не существует';
			}
		}
		unset($USER);

		return $result;
	}

	/**
	 *  Возвращаем перечень проектов созданных пользоватедем
	 */
	public function getYourTask($args = null){
		$result = [
			'total' => 0,
			'data'	=> []
		];
		$total = &$result['total'];
		$data = &$result['data'];

		if($args && $args->login){
			$USER = new auth();
			$USER->LOGIN = $args->login;

			$id_user = $USER->user_data['ID_USER'];
			unset($USER);
		} else {
			$id_user = $this->user_data['ID_USER'];
		}

		$sql = "
			SELECT a.id_task, a.task_name, a.task_information, a.task_lasting, a.date_create, a.date_start, a.date_finish, a.id_user, 
					a.priority as id_priority, a.status as id_status, a.id_type, a.id_direction,
					(SELECT first_name || ' ' || name || ' ' || second_name FROM public.users k WHERE a.id_user = k.id_user) as fio,
					(SELECT status_name FROM public.status k WHERE a.status = k.status) as status,
					(SELECT priority_name FROM public.priority k WHERE a.priority = k.priority) as priority,
					(SELECT name_type FROM public.type_task k WHERE a.id_type = k.id_type) as type,
					(SELECT direction_name FROM public.direction k WHERE a.id_direction = k.id_direction) as direction
			FROM
				public.task a
			WHERE
				(id_user = $1)
		";
		$qres = @pg_query_params($this->conn, $sql, [$id_user]);

		if(!$qres){
			$err = pg_last_error($this->conn);
			var_dump($err); exit;
			throw new DBException($err, 'Невозможно найти данные задач', E_ERROR_PROJECT);
		}

		$rows = pg_fetch_all($qres);

		if($rows){
			foreach($rows as $row){
				$data[] = [
					'ID_TASK'					=> (int) $row['id_task'],
					'TASK_NAME'					=> (string) $row['task_name'],
					'TASK_INFORMATION'			=> (string) $row['task_information'],
					'TASK_LASTING'				=> (int) $row['task_lasting'],
					'DATE_CREATE'				=> $row['date_create'],
					'DATE_START'				=> $row['date_start'],
					'DATE_FINISH'				=> $row['date_finish'],
					'ID_USER'					=> (int) $row['id_user'],
					'FIO'						=> (string) $row['fio'],
					'ID_PRIORITY'				=> (int) $row['id_priority'],
					'PRIORITY'					=> (string) $row['priority'],
					'ID_STATUS'					=> (int) $row['id_status'],
					'STATUS'					=> (string) $row['status'],
					'ID_TYPE'					=> (int) $row['id_type'],
					'TYPE'						=> (string) $row['type'],
					'ID_DIRECTION'				=> (int) $row['id_direction'],
					'DIRECTION'					=> (string) $row['direction']
				];
			}
		}

		pg_free_result($qres);

		return ($args && $args->login) ? (object) $result : (object) $data;
	}



	/**
	 *  Возвращаем перечень проектов в которых пользователь исполнитель
	 */
	public function getTaskForUser($args = null){
		$result = [
			'total' => 0,
			'data'	=> []
		];
		$total = &$result['total'];
		$data = &$result['data'];

		if($args && $args->login){
			$USER = new auth();
			$USER->LOGIN = $args->login;

			$id_user = $USER->user_data['ID_USER'];
			unset($USER);
		} else {
			$id_user = $this->user_data['ID_USER'];
		}

		// Ищем проекты, в которых пользователь исполнитель
		$sql = "
			SELECT a.id_project, a.name, a.date_create, a.date_close, a.id_user
			FROM
				public.projects a,
				public.task_users b
			WHERE
					(b.id_user = $1)
				and (b.role_project = 1)
				and (b.id_project = a.id_project)
		";
		$qres = @pg_query_params($this->conn, $sql, [$id_user]);

		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DBException($err, 'Невозможно найти данные проекта', E_ERROR_PROJECT);
		}

		$rows = pg_fetch_all($qres);

		foreach($rows as $row){
			$data[] = [
				'ID_PROJECT'			=> (int) $row['id_project'],
				'NAME_PROJECT'			=> (string) $row['name'],
				'DATE_CREATE_PROJECT'	=> $row['date_create'],
				'DATE_CLOSE_PROJECT'	=> $row['date_close']
			];
		}

		pg_free_result($qres);

		return ($args && $args->login) ? (object) $result : (object) $data;
	}
}