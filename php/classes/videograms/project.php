<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH . 'DbConnection.php');

/**
 * Класс project (Проекты и его внутренности)
 */
class project {
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
	private $conn;					// Наше соединение
	private $id_project;			// Идентификатор проекта

	public $NAME_PROJECT;
	public $DATE_CREATE_PROJECT;
	public $DATE_CLOSE_PROJECT;
	public $ID_USER_CREATE_PROJECT;
	public $TASKS;

	/**
	 */
	public function __construct($id_project = false){
		$this->CI = DbConnection::getInstance();
		$this->conn = $this->CI->getConnection();

        if($id_project !== false){
			$this->set_project($id_project);
		}
	}

	/**
	 */
	public function __destruct(){}

	// Вызов get свойства
	public function __get($name){
		$name = strtoupper($name);
		if(array_key_exists($name, $this->task)){
			return $this->task[$name];
		} else {
			return false;
		}
	}

	// Вызов set свойства
	public function __set($name, $value){
		$name = strtoupper($name);
		if($name === 'ID_PROJECT'){
			$this->set_project($value);
		} else {
			return false;
		}
		return true;
	}

    /* public */
	// Добавляем данные авторизированного пользователя
	public function set_project($id_project){

		$this->ID_PROJECT = (int) $id_project;

        // Загружаем данные проекта
		$data   = $this->load_project();

        // Загружаем задания проекта
		$tasks  = $this->load_tasks_project();

		if($data){
			$this->NAME_PROJECT             = (string) $data['NAME_PROJECT'];
            $this->DATE_CREATE_PROJECT      =  $data['DATE_CREATE_PROJECT'];
            $this->DATE_CLOSE_PROJECT       =  $data['DATE_CLOSE_PROJECT'];
            $this->ID_USER_CREATE_PROJECT   = (int) $data['ID_USER'];
            $this->TASKS                    = $tasks;
		}
	}

    // Загружаем данные проекта
	public function load_project($args = null){
		$result = [
			'total' => 0,
			'data'	=> []
		];
		$total = &$result['total'];
		$data = &$result['data'];

		$id_project = ($args) ? ((is_object($args) && $args->id_project) ? $args->id_project : $args) : $this->ID_PROJECT;

		$sql = "
			SELECT id_project, name, date_create, date_close, id_user
			FROM
				public.projects
			WHERE
				(id_project = $1)
		";
		$qres = @pg_query_params($this->conn, $sql, [$id_project]);

		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно загрузить проект', E_ERROR_READING_DATA);
		}
		if($row = pg_fetch_assoc($qres)){
			$record = [
				'ID_PROJECT'			=> (int) $row['id_project'],
				'NAME_PROJECT'			=> (string) $row['name'],
				'DATE_CREATE_PROJECT'	=> $row['date_create'],
				'DATE_CLOSE_PROJECT'	=> $row['date_close'],
				'ID_USER'				=> (int) $row['id_user'],
			];
		}

		pg_free_result($qres);

		$data[] = $record;
		$total = count($data);
		return ($args) ? $result : $record;
	}


     // Загружаем задания проекта
	public function load_tasks_project($args = null){
		$result = [
			'total' => 0,
			'data'	=> []
		];
		$total = &$result['total'];
		$data = &$result['data'];
		
		$id_project = ($args && $args->id_project) ? $args->id_project : $this->ID_PROJECT;

		$sql = "
			SELECT a.id_task, a.task_name, a.date_create, a.date_end, a.description, a.priority, a.status, a.id_project, (
                SELECT
                    priority_name
                FROM
                    public.priority k
                WHERE
                    a.priority = k.priority
            ) priority_name,
            (
                SELECT
                    status_name
                FROM
                    public.status k
                WHERE
                    a.status = k.status
            ) status_name
			FROM
				public.task a
			WHERE
				(id_project = $1)
		";
		$qres = @pg_query_params($this->conn, $sql, [$id_project]);

		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно прочитать задания проекта', E_ERROR_READING_DATA);
		}
		$rows = pg_fetch_all($qres);


		if($rows){
			foreach($rows as $row){
				$task_users = $this->load_task_users($row['id_task']);
	
	
				$data[] = [
					'ID_TASK'			    => (int) $row['id_task'],
					'TASK_NAME'			    => (string) $row['task_name'],
					'DATE_CREATE_TASK'	    => $row['date_create'],
					'DATE_END_TASK'	        => $row['date_end'],
					'DESCRIPTION_TASK'      => (string) $row['description'],
					'PRIORITY'              => (int) $row['priority'],
					'PRIORITY_NAME'         => (string) $row['priority_name'],
					'STATUS'                => (int) $row['status'],
					'STATUS_NAME'           => (string) $row['status_name'],
					'ID_PROJECT'			=> (int) $row['id_project'],
					'TASK_USERS'            => (array) $task_users
				];
			}
		}

		pg_free_result($qres);

		$total = count($data);

		return ($args && $args->id_project) ? $result : $data;
	}


     // Загружаем исполнителей проекта
	public function load_task_users($args){
		$result = [
			'total' => 0,
			'data'	=> []
		];
		$total = &$result['total'];
		$data = &$result['data'];

		$id_task = ($args && is_object($args) && $args->id_task) ? $args->id_task : $args;

		$sql = "
			SELECT a.id_task, a.id_project, a.id_user, a.role_project, (
                SELECT
                    name_role
                FROM
                    public.roles_project k
                WHERE
                    a.role_project = k.role_project
            ) as name_role
			FROM
				public.task_users a
			WHERE
				(id_task = $1)
		";
		$qres = @pg_query_params($this->conn, $sql, [$id_task]);

		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно загрузить исполнителей задания', E_ERROR_READING_DATA);
		}
		if($row = pg_fetch_assoc($qres)){
			$data = [
				'ID_PROJECT'	        => (int) $row['id_project'],
				'ID_TASK'	            => (int) $row['id_task'],
				'ID_USER'	            => (int) $row['id_user'],
                'NAME_ROLE_PROJECT'     => (string) $row['name_role'],
				'ROLE_PROJECT'	        => (int) $row['role_project']
			];
		}

		$total = count($data);

		pg_free_result($qres);

		return ($args && is_object($args) && $args->id_task) ? $result : $data;
	}

}