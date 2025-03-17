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
class Entrusted_to_me {
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
	// Создание проекта
	public function getTaskToMe($args){
        $result = [
			'data'	=> [],
			'total'	=> 0
		];

        $GLOB_USER = 0;

        $r_data     = &$result['data'];
        $r_total    = &$result['total'];

        $id_user        = isset($args->id_user) ? $args->id_user : null;
        $date_create    = $args->create;

       $check = "(0 = 0)";

        $check = $check . " and (b.id_user = $id_user) and (to_char(a.date_create, 'mm.yyyy') = '$date_create')";

       $sql = "
            SELECT  b.id_user, a.id_task, a.task_name, a.task_information, a.task_lasting, a.id_topic, 
                    a.status as id_status, a.id_type, a.priority as id_priority, c.execution, c.id_task_user, c.comment,
					(SELECT first_name || ' ' || name || ' ' || second_name FROM public.users k WHERE b.id_user = k.id_user) as fio,
					(SELECT status_name FROM public.status k WHERE a.status = k.status) as status,
					(SELECT priority_name FROM public.priority k WHERE a.priority = k.priority) as priority,
					(SELECT name_type FROM public.type_task k WHERE a.id_type = k.id_type) as type,
                    (SELECT topic_name FROM public.topic k WHERE a.id_topic = k.id_topic) as topic
            FROM
                    public.task a
                LEFT JOIN public.task_user b ON a.id_task = b.id_task
                LEFT JOIN public.report c ON b.id_task_user = c.id_task_user
            WHERE
                $check
            ORDER BY b.id_user ASC, a.priority DESC
       ";

       $qres = @pg_query($this->conn, $sql);

		if(!$qres){
			$err = pg_last_error($this->conn);
			var_dump($err); exit;
			throw new DbException($err, 'Невозможно прочитать данные плана', E_ERROR_READING_DATA);
		}

		$rows = pg_fetch_all($qres);

		if($rows){
			foreach($rows as $row){
				$sql = "
						SELECT MAX(a.execution) 
						FROM 
								public.report a, 
								public.task_user b 
						WHERE b.id_task = $1 and b.id_task_user = $2 and b.id_task_user = a.id_task_user
				";
				$qres = @pg_query_params($this->conn, $sql, [$row['id_task'], $row['id_task_user']]);
				if(!$qres){
					$err = pg_last_error($this->conn);
					throw new DbException($err, 'Ошибка при поиске идентификатора отчета!', E_ERROR_READING_DATA);
				}
				// Сохраняем ключевые поля
				$max_execute = (int) pg_fetch_result($qres, 0);
				pg_free_result($qres);

				$r_data[] = [
					'id_user'		    => (int) $row['id_user'],
                    'fio' 	            => (string) $row['fio'],
					'id_task' 	        => (int) $row['id_task'],
                    'task_name' 	    => (string) $row['task_name'],
					'task_information' 	=> (string) $row['task_information'],
					'task_lasting' 	    => (int) $row['task_lasting'],
					'id_task_user'		=> (int) $row['id_task_user'],
					'id_topic' 	        => (int) $row['id_topic'],
					'topic' 	        => (string) $row['topic'],
					'id_status' 	    => (int) $row['id_status'],
					'status' 	        => (string) $row['status'],
					'id_type' 	        => (int) $row['id_type'],
					'type' 	            => (string) $row['type'],
                    'id_priority' 	    => (int) $row['id_priority'],
					'priority' 	        => (string) $row['priority'],
                    'execution'         => (int) $row['execution'],
					'comment' 	        => (string) $row['comment'],
					'max'				=> $max_execute
				];
			}
		}

        $r_total = count($r_data);

        return $result;
    }

	// Создание проекта
	public function saveReports($args){
        $result = [
			'success'	=> true,
			'msg'		=> ''
		];

		$data = new stdClass();
		$data->date_report	= $args->date_report;
		$data->comment 		= $args->comment;
		$data->execution	= $args->execution;


		$sql = "
			SELECT id_task_user FROM public.task_user WHERE id_user = $1 and id_task = $2
		";
		$qres = @pg_query_params($this->conn, $sql, [$args->id_user, $args->id_task]);
		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Ошибка при поиске идентификатора отчета!', E_ERROR_READING_DATA);
		}
		// Сохраняем ключевые поля
		$data->id_task_user = (int) pg_fetch_result($qres, 0);
		pg_free_result($qres);

		// Сохраняем проект
		$res = DbTableHelper::insert($this->conn, 'public.report', (array) $data);

		// Записался ли проект?
		if(!$res){
			$err = DbTableHelper::getLastError();
			var_dump($err); exit;
			throw new DbException($err, 'Невозможно добавить задачу!', E_ERROR_EXECUTING_SQL_QUERY);
		}

		unset($data);
		// Сохраняем изменения
		$this->CI->commitTransaction();

		$result['msg'] = 'Отчет успешно отправлен';
		return $result;
	}

}