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
class Reports {
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

    // Загружаем данные проекта
	public function getReportsForDay($args){
		$result = [
			'data'	=> [],
			'total'	=> 0
		];
        $r_total    = &$result['total'];
        $r_data     = &$result['data'];

		$check = '0 = 0';
		if($args->id_user){
			$user = $args->id_user;
			$check = $check . "and (a.id_user = $user)"
		}
		if($args->period_Day_Control_Of_Work_Progress){
			// Преобразуем строку в объект DateTime
			$datetime = new DateTime($args->period_Day_Control_Of_Work_Progress);

			// Получаем только дату без времени
			$formattedDate = (string) $datetime->format('d.m.Y');
			$check = $check . "to_char(c.date, 'dd.mm.yyyy') = $formattedDate";
		}

		$sql = "
			SELECT a.id_task, a.task_name, a.task_information, a.task_lasting, date_create, date_start, date_finish, a.priority, a.status, 
					a.id_type, a.id_direction, b.id_user,
					(SELECT name_type FROM public.type_task k WHERE a.id_type = k.id_type) as type,
					(SELECT direction_name FROM public.direction k WHERE a.id_direction = k.id_direction) as direction,
					(SELECT first_name || ' ' || name || ' ' || second_name FROM public.users k WHERE b.id_user = k.id_user) as fio,
					c.reporc, c.execution, c.comment
			FROM public.task a
			LEFT JOIN public.task_user b ON a.id_task = b.id_task
			LEFT JOIN public.report b ON b.id_task_user = c.id_task_user
			WHERE
				$check
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
			

	}
}