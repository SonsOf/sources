<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH .   'DbConnection.php');

require_once(CLASS_VIDEOGRAMS_PATH . 'Entrusted_by_me.php');

/**
 * Класс admin (Панель администратора)
 */
class admin {
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

    public function __construct(){
		$this->CI = DbConnection::getInstance();
		$this->conn = $this->CI->getConnection();
	}

    /**
	 */
	public function __destruct(){}

    // Загружаем данные проекта
	public function getData($args = null){
        $result = [
            'total' => 0,
            'data'  => []
        ];

        $r_data     = &$result['data'];
        $r_total    = &$result['total'];

       // Запрос
		$sql = "
            SELECT a.id_user, a.login, a.role_system, a.name, a.first_name, a.second_name, (first_name || ' ' || name || ' ' || second_name) as fio,
                    a.password, a.gender, a.date_birth, a.date_reg, a.position, a.boss_id, a.proflevel, a.creating,
                    (SELECT name_role FROM public.roles_system k WHERE a.role_system = role_system) as name_role,
                    (SELECT first_name || ' ' || name || ' ' || second_name FROM public.users k WHERE a.boss_id = k.id_user) as fio_boss,
					STRING_AGG(c.topic_name, ', ' ORDER BY c.id_topic) topics_user
            FROM
                public.users a
			LEFT JOIN public.topic_user b ON a.id_user = b.id_user
			LEFT JOIN public.topic c ON b.id_topic = c.id_topic
            WHERE
                (a.id_user != 999999)
			group by  a.id_user
        ";
        $qres = @pg_query($this->conn, $sql);

		if(!$qres){
			$err = pg_last_error($this->conn);
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
                    'fio_boss'		=> (string) $row['fio_boss'],
					'proflevel'		=> (int) $row['proflevel'],
                    'creating'		=> (int) $row['creating'],
					'topics_user'	=> (string) $row['topics_user']
				];
			}
		}

		$r_total = count($r_data);

		pg_free_result($qres);

		return $result;
	}

	 // Загружаем данные проекта
	 public function save($args){
        $result = [
            'msg' 		=> '',
            'success'  	=> true
        ];

        $r_data     = &$result['data'];
        $r_total    = &$result['total'];

		$data = new stdClass();
		$data->creating = $args->creating;

		// Обновляем заявку
		$res = DbTableHelper::update($this->conn, 'public.users', (array) $data, [
			'id_user' => $args->id_user
		]);
		if(!$res){
			$err = DbTableHelper::getLastError();
			throw new DbException($err, 'Невозможно оизменить данные пользователя', E_ERROR_EXECUTING_SQL_QUERY);
		}

		unset($data);

		$result['msg']	= 'Данные пользователя успешно изменены!';

		// Сохраняем изменения
		$this->CI->commitTransaction();

		return $result;
	}
}