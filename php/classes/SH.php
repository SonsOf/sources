<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(PHP_PATH . 'functions.php');
require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH . 'DbConnection.php');

/**
 * Общие функции.
 */
class SH {
	/**
	 * Соединение с базой данных.
	 * @var resource
	 */
	private $conn;

	/**
	 */
	public function __construct(){
		$this->conn = DbConnection::connect();
	}

	/**
	 */
	public function __destruct(){}

	/**
	 * Возвращает список заказов.
	 * @param object $args
	 * @return array
	 */

	 // Справочник сотрудников предприятия
	public function getDataWorker($args){

		// Запрашиваем данные от REST API
		$data = makeRequest(URL_DATA_WORKER, (array) $args);

		return $data;
	}

	// Справочник должностей
	public function getDataPost($args){

		// Запрашиваем данные от REST API
		$data = makeRequest(URL_DATA_POST, (array) $args);

		return $data;
	}

	// Справочник по структуре предприятия
	public function getDataStructure($args){

		// Запрашиваем данные от REST API
		$data = makeRequest(URL_DATA_STRUCTURE, (array) $args);

		return $data;
	}

	// Вытаскиваем роли системы
	public function getRolesSystem(){
		$data = [];

		$sql = "
			SELECT distinct
                role_system, name_role
			FROM
				public.roles_system
			ORDER BY
				role_system
		";
		$qres = @pg_query($this->conn, $sql);
		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно прочитать данные ролей', E_ERROR_READING_DATA);
		}

		while($row = pg_fetch_assoc($qres)){
			$data[] = [
				'role_system'   => (int) $row['role_system'],
				'name_role'     => (string) $row['name_role']
			];
		}
		pg_free_result($qres);

		return $data;
	}


	// Вытаскиваем роли проекта
	public function getRolesTask(){
		$data = [];

		$sql = "
			SELECT distinct
                role_task, name_role
			FROM
				public.roles_task
			ORDER BY
				role_task
		";
		$qres = @pg_query($this->conn, $sql);
		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно прочитать данные ролей', E_ERROR_READING_DATA);
		}

		while($row = pg_fetch_assoc($qres)){
			$data[] = [
				'role_task' 	=> (int) $row['role_task'],
				'name_role'     => (string) $row['name_role']
			];
		}
		pg_free_result($qres);

		return $data;
	}


	// Вытаскиваем статусы проектов и задач
	public function getStatus(){
		$data = [];

		$sql = "
			SELECT distinct
                status, status_name
			FROM
				public.status
			ORDER BY
				status
		";
		$qres = @pg_query($this->conn, $sql);
		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно прочитать статусы', E_ERROR_READING_DATA);
		}

		while($row = pg_fetch_assoc($qres)){
			$data[] = [
				'status' 		=> (int) $row['status'],
				'status_name'   => (string) $row['status_name']
			];
		}
		pg_free_result($qres);

		return $data;
	}


	// Вытаскиваем  приоритеты задач
	public function getPriority(){
		$data = [];

		$sql = "
			SELECT distinct
                priority, priority_name
			FROM
				public.priority
			ORDER BY
				priority
		";
		$qres = @pg_query($this->conn, $sql);
		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно прочитать статусы', E_ERROR_READING_DATA);
		}

		while($row = pg_fetch_assoc($qres)){
			$data[] = [
				'priority' 		=> (int) $row['priority'],
				'priority_name' => (string) $row['priority_name']
			];
		}
		pg_free_result($qres);

		return $data;
	}


	// Вытаскиваем  типы задач
	public function getTypeTask(){
		$data = [];

		$sql = "
			SELECT distinct
                id_type, name_type
			FROM
				public.type_task
			ORDER BY
				id_type
		";
		$qres = @pg_query($this->conn, $sql);
		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно прочитать статусы', E_ERROR_READING_DATA);
		}

		while($row = pg_fetch_assoc($qres)){
			$data[] = [
				'id_type' 		=> (int) $row['id_type'],
				'name_type' 	=> (string) $row['name_type']
			];
		}
		pg_free_result($qres);

		return $data;
	}


	// Вытаскиваем  темы и категории тем
	public function getTopicList($args = null){
		$data = [];

		$check = "0 = 0";
		if($args->id_user){
			$id_user = $args->id_user;
			$check = $check . " and (c.id_user = $id_user)";
		}

		$sql = "
			SELECT distinct
				a.id_topic, a.topic_name, a.topic_code, a.id_direction, b.direction_name
			FROM
				public.topic a
			LEFT JOIN public.direction b ON a.id_direction = b.id_direction
			LEFT JOIN public.topic_user c ON a.id_topic = c.id_topic
			WHERE
				$check
			ORDER BY
				id_topic
		";

		$qres = @pg_query($this->conn, $sql);
		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно прочитать список тематик', E_ERROR_READING_DATA);
		}

		while($row = pg_fetch_assoc($qres)){
			$data[] = [
				'id_topic' 			=> (int) $row['id_topic'],
				'topic_name' 		=> (string) $row['topic_name'],
				'topic_code' 		=> (string) $row['topic_code'],
				'id_direction' 		=> (string) $row['id_direction'],
				'direction_name' 	=> (string) $row['direction_name']
			];
		}
		pg_free_result($qres);

		return $data;
	}


	// Вытаскиваем  темы и категории тем
	public function getInputTask(){
		$data = [];

		$data[] = [
			'creating'	=> 0,
			'name'		=> 'ЗАПРЕЩЕНО'
		];

		$data[] = [
			'creating'	=> 1,
			'name'		=> 'РАЗРЕШЕНО'
		];

		return $data;
	}


	// Вытаскиваем роли системы
	public function getUsers($args){
		$result = [
			'data'	=> [],
			'total'	=> 0
		];

		$data 	= &$result['data'];
		$total 	= &$result['total'];

		// Проверяем вводимые данные
		$query = (string) (isset($args->query)? $args->query : '');
		// Удаляем проблемы и конвертируем под pg запрос
		$query = str_replace(' ', '', $query);
		$query = pg_escape_string($query);

		// Конвертируем в верхний регистр
		$query = mb_strtoupper($query, 'UTF-8');

		// Проверяем лимиты
		$start = (int) (isset($args->start)? $args->start : 0);
		$limit = (int) (isset($args->limit)? $args->limit : 0);

		/** Условие запроса */
		$check = "(my_upper(first_name || name || second_name) like '%' || ($1) || '%') or (my_upper(name || first_name || second_name) like '%' || ($1) || '%')";

		if(!$args->MAIN_BOSS && $args->LOCALE_BOSS){
			
		}

		// Запрос
		$sql = "
			SELECT a.id_user, a.login, a.role_system, a.name, a.first_name, a.second_name, (first_name || ' ' || name || ' ' || second_name) as fio,
					a.password, a.gender, a.date_birth, a.date_reg, a.position, a.boss_id, a.proflevel, a.creating,
					(SELECT name_role FROM public.roles_system k WHERE a.role_system = role_system) as name_role
			FROM
				public.users a
			WHERE
				$check
			limit
				$limit
			offset
				$start
		";


		$qres = @pg_query_params($this->conn, $sql, [$query]);

		if(!$qres){
			$err = pg_last_error($this->conn);
			var_dump($err); exit;
			throw new DbException($err, 'Невозможно прочитать список пользователей', E_ERROR_READING_DATA);
		}

		$rows = pg_fetch_all($qres);

		if($rows){
			foreach($rows as $row){
				$data[] = [
					'id_user'		=> (int) $row['id_user'],
					'login' 	    => (string) $row['login'],
					'fio' 	    	=> (string) $row['fio'],
					'name' 	    	=> (string) $row['name'],
					'first_name' 	=> (string) $row['first_name'],
					'second_name' 	=> (string) $row['second_name'],
					'gender' 	    => (string) $row['gender'],
					'date_birth' 	=> $row['date_birth'],
					'date_reg' 	    => $row['date_reg'],
					'role_system'	=> (int) $row['role_system'],
					'name_role'		=> (string) $row['name_role'],
					'position'		=> (string) $row['position'],
					'boss_id'		=> (int) $row['boss_id'],
					'proflevel'		=> (int) $row['proflevel'],
					'creating'		=> (int) $row['creating']
				];
			}
		}

		$total = count($data);

		pg_free_result($qres);

		return $data;
	}
}