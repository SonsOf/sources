<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH .   'DbConnection.php');
require_once(CLASS_PATH .   'function.php');

require_once(CLASS_VIDEOGRAMS_PATH . 'auth.php');
require_once(CLASS_VIDEOGRAMS_PATH . 'project.php');

/**
 * Класс видеограммы "Порученное мною" 
 */
class Entrusted_by_me {
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
	public function getData($args){
        $result = [
            'total' => 0,
            'data'  => []
        ];

        $r_total    = &$result['total'];
        $r_data     = &$result['data'];

        // Идентифицируем пользователя, который делает запрос
        $USER = new auth();
        $USER->LOGIN = (string) $args->login;

        // Получаем проекты пользователя
        $projects = $USER->getYourTask();

        foreach($projects as $key=>$rec){
            // Получаем проект
            $PROJECT = new project();
            $PROJECT->ID_PROJECT = $rec['ID_PROJECT'];

            // Загружаем данные проекта
            $r_data[] = $PROJECT;

            // Очищаем память по загруженному проекту
            unset($PROJECT);
        }

        // Очищаем пользователя 
        unset($USER);

        // Высчитываем тотал по проектам
		$r_total = count($r_data) ;

		return $result;
	}


    // Создание проекта
	public function saveTask($args){
        $result = [
            'msg'       => '',
            'data'      => [],
            'success'   => true
        ];

        $tasks = $args->tasks;

        // Создаем объект для записи проекта
        $_task                 = new stdClass();

        // Преобразуем строку в формат, понятный для функции strtotime()
        $formatted_date = str_replace('.', '-', $args->date_start); // заменяем точки на дефисы
        // Преобразуем строку в временную метку Unix
        $timestamp = strtotime($formatted_date);
        // Используем функцию date(), чтобы сформировать строку даты в формате YYYY-MM-DD
        $date_create = date('Y-m-d', $timestamp);

        // Задаем данные для записи
        $_task->date_create          = $date_create;
        $_task->id_user              = (int) $args->id_autor;

        $task_user = new stdClass();
        $task_user->id_user     =  $args->id_user;


        foreach($tasks as $task){
            // Заполняем объект данными проекта
            $_task->task_name            = (string) $task->task_name;
            $_task->task_information     = (string) $task->task_information;
            $_task->task_lasting         = (int) $task->task_lasting;
            $_task->priority             = (int) $task->priority;
            $_task->id_type              = 1;
            $_task->id_topic             = (int) $task->id_topic;
            $_task->id_user              = (int) $args->id_autor;
            $_task->order                = (int) $task->order;

            $sql = "
                SELECT nextval('public.id_task_seq');
            ";
            $qres = @pg_query($this->conn, $sql);
            if(!$qres){
                $err = pg_last_error($this->conn);
                throw new DbException($err, 'Ошибка при поиске идентификатора задачи!', E_ERROR_READING_DATA);
            }

            // Сохраняем ключевые поля
            $_task->id_task = (int) pg_fetch_result($qres, 0);
            pg_free_result($qres);

            // Сохраняем проект
            $res = DbTableHelper::insert($this->conn, 'public.task', (array) $_task);

            // Записался ли проект?
            if(!$res){
                $err = DbTableHelper::getLastError();
                throw new DbException($err, 'Невозможно добавить задачу!', E_ERROR_EXECUTING_SQL_QUERY);
            }

            $task_user->id_task     = $_task->id_task;
            $task_user->role_task   = 1;

            $sql = "
                SELECT nextval('public.id_task_user_seq');
            ";
            $qres = @pg_query($this->conn, $sql);
            if(!$qres){
                $err = pg_last_error($this->conn);
                throw new DbException($err, 'Ошибка при поиске идентификатора исполнителя задачи!', E_ERROR_READING_DATA);
            }
            // Сохраняем ключевые поля
            $task_user->id_task_user = (int) pg_fetch_result($qres, 0);
            pg_free_result($qres);



            // Сохраняем проект
            $res = DbTableHelper::insert($this->conn, 'public.task_user', (array) $task_user);

            // Записался ли проект?
            if(!$res){
                $err = DbTableHelper::getLastError();
                throw new DbException($err, 'Невозможно добавить исполнителей в задачу!', E_ERROR_EXECUTING_SQL_QUERY);
            }
        }
        
        $result['msg'] = 'Задача успешно создана!';
        $result['data'] = (array) $task;

        // Очищаем память по загруженному проекту
        unset($_task);
        unset($task);
        unset($task_user);
        // Сохраняем изменения
		$this->CI->commitTransaction();

		return $result;
	}


    // Создание проекта
	public function getUsers($args){
        $result = [
			'data'	=> [],
			'total'	=> 0
		];
        $r_total    = &$result['total'];
        $r_data     = &$result['data'];

        $check = 'and (0 = 0)'; 
        if(!$args->main_boss && $args->local_boss){
            $id_user    = $args->id_user;
            $check      = $check . " and (a.boss_id = $id_user)";
        }

		// Запрос
		$sql = "
			SELECT a.id_user, a.login, a.role_system, a.name, a.first_name, a.second_name, (first_name || ' ' || name || ' ' || second_name) as fio,
					a.password, a.gender, a.date_birth, a.date_reg, a.position, a.boss_id, a.proflevel, a.creating,
					(SELECT name_role FROM public.roles_system k WHERE a.role_system = role_system) as name_role
			FROM
				public.users a
            WHERE
                (id_user != 999999)
                $check
		";


		$qres = @pg_query($this->conn, $sql);

		if(!$qres){
			$err = pg_last_error($this->conn);
			var_dump($err); exit;
			throw new DbException($err, 'Невозможно прочитать список пользователей', E_ERROR_READING_DATA);
		}

		$rows = pg_fetch_all($qres);

		if($rows){
			foreach($rows as $row){
				$r_data[] = [
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

		$r_total = count($r_data);

		pg_free_result($qres);

		return $result;
    }


    // Создание проекта
	public function getWorkingDate($args = null){

        $year   = ($args && isset($args->year)) ? $args->year : date('Y');
        $month  = ($args && isset($args->month)) ? $args->month : date('m');

        return getWorkingDaysInMonth($year, $month);
    }


    // Создание проекта
	public function getPlan($args){
        $res = [
			'data'	=> [],
			'total'	=> 0
		];

        $GLOB_USER = 0;

        $r_data     = &$res['data'];
        $r_total    = &$res['total'];

        $id_user        = isset($args->id_user) ? $args->id_user : null;
        $date_create    = $args->create;

       $check = "(0 = 0)";

       if($args->form == 1){
            $check = $check . " and (a.id_user = $id_user) and (to_char(a.date_create, 'mm.yyyy') = '$date_create')";
       } else {
            $check = $check . " and (b.id_user = $id_user) and (to_char(a.date_create, 'mm.yyyy') = '$date_create')";
       }

       $sql = "
            SELECT  b.id_user, a.id_task, a.task_name, a.task_information, a.task_lasting, a.id_topic, 
                    a.status as id_status, a.id_type, a.priority as id_priority, c.execution,
					(SELECT first_name || ' ' || name || ' ' || second_name FROM public.users k WHERE b.id_user = k.id_user) as fio,
					(SELECT status_name FROM public.status k WHERE a.status = k.status) as status,
					(SELECT priority_name FROM public.priority k WHERE a.priority = k.priority) as priority,
					(SELECT name_type FROM public.type_task k WHERE a.id_type = k.id_type) as type,
                    (SELECT topic_name FROM public.topic k WHERE a.id_topic = k.id_topic) as topic,
                    (
                        CASE 
                            WHEN a.priority = 1 and c.execution is null THEN 1 
                            WHEN a.priority = 2 and c.execution is null THEN 2 
                            WHEN a.priority = 3 and c.execution is null THEN 3 
                            WHEN a.priority = 1 and c.execution is not null and c.execution < 100 THEN 1 
                            WHEN a.priority = 2 and c.execution is not null and c.execution < 100 THEN 2 
                            WHEN a.priority = 3 and c.execution is not null and c.execution < 100 THEN 3 
                            WHEN a.priority = 1 and c.execution = 100 THEN 4 
                            WHEN a.priority = 2 and c.execution = 100 THEN 5 
                            WHEN a.priority = 3 and c.execution = 100 THEN 6 
                        END
                    ) as ordering
            FROM
                    public.task a
                LEFT JOIN public.task_user b ON a.id_task = b.id_task
                LEFT JOIN public.report c ON b.id_task_user = c.id_task_user
            WHERE
                $check
            ORDER BY b.id_user ASC, a.priority DESC, ordering ASC
       ";

       $qres = @pg_query($this->conn, $sql);

		if(!$qres){
			$err = pg_last_error($this->conn);
			throw new DbException($err, 'Невозможно прочитать данные плана', E_ERROR_READING_DATA);
		}

		$rows = pg_fetch_all($qres);

		if($rows){
            $z = 1;
			foreach($rows as $row){
                if($GLOB_USER != $row['id_user']){
                    $GLOB_USER = (int) $row['id_user'];
                    $z = 1;
                }
				$result = [
					'id_user'		    => (int) $row['id_user'],
                    'fio' 	            => (string) $row['fio'],
					'id_task' 	        => (int) $row['id_task'],
                    'task_name' 	    => (string) $row['task_name'],
					'task_information' 	=> (string) $row['task_information'],
					'task_lasting' 	    => (int) $row['task_lasting'],
					'id_topic' 	        => (int) $row['id_topic'],
					'topic' 	        => (string) $row['topic'],
					'id_status' 	    => (int) $row['id_status'],
					'status' 	        => (string) $row['status'],
					'id_type' 	        => (int) $row['id_type'],
					'type' 	            => (string) $row['type'],
                    'id_priority' 	    => (int) $row['id_priority'],
					'priority' 	        => (string) $row['priority'],
                    'execution'         => (int) $row['execution'],
                    'ordering'          => (int) $row['ordering']
				];

                for($k = $z; $k < $z + $row['task_lasting']; $k++){
                    if($k == 1){$result['mes1'] = $row['ordering'];} 
                    if($k == 2){$result['mes2'] = $row['ordering'];} 
                    if($k == 3){$result['mes3'] = $row['ordering'];} 
                    if($k == 4){$result['mes4'] = $row['ordering'];} 
                    if($k == 5){$result['mes5'] = $row['ordering'];} 
                    if($k == 6){$result['mes6'] = $row['ordering'];} 
                    if($k == 7){$result['mes7'] = $row['ordering'];} 
                    if($k == 8){$result['mes8'] = $row['ordering'];} 
                    if($k == 9){$result['mes9'] = $row['ordering'];} 
                    if($k == 10){$result['mes10'] = $row['ordering'];} 
                    if($k == 11){$result['mes11'] = $row['ordering'];}
                    if($k == 12){$result['mes12'] = $row['ordering'];}
                    if($k == 13){$result['mes13'] = $row['ordering'];} 
                    if($k == 14){$result['mes14'] = $row['ordering'];} 
                    if($k == 15){$result['mes15'] = $row['ordering'];} 
                    if($k == 16){$result['mes16'] = $row['ordering'];} 
                    if($k == 17){$result['mes17'] = $row['ordering'];} 
                    if($k == 18){$result['mes18'] = $row['ordering'];} 
                    if($k == 19){$result['mes19'] = $row['ordering'];} 
                    if($k == 20){$result['mes20'] = $row['ordering'];} 
                    if($k == 21){$result['mes21'] = $row['ordering'];} 
                    if($k == 22){$result['mes22'] = $row['ordering'];} 
                    if($k == 23){$result['mes23'] = $row['ordering'];} 
                    if($k == 24){$result['mes24'] = $row['ordering'];} 
                    if($k == 25){$result['mes25'] = $row['ordering'];}
                    if($k == 26){$result['mes26'] = $row['ordering'];} 
                    if($k == 27){$result['mes27'] = $row['ordering'];} 
                    if($k == 28){$result['mes28'] = $row['ordering'];} 
                    if($k == 29){$result['mes29'] = $row['ordering'];}
                    if($k == 30){$result['mes30'] = $row['ordering'];}
                    if($k == 31){$result['mes31'] = $row['ordering'];break;}
                }

                $z = $z + $row['task_lasting'];
                $r_data[] = $result;
                $result = [];
			}
		}

        $r_total = count($r_data);

        return $res;
    }
}