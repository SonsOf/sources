<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH .   'DbConnection.php');

require_once(CLASS_VIDEOGRAMS_PATH . 'auth.php');
require_once(CLASS_VIDEOGRAMS_PATH . 'project.php');

/**
 * Класс readXML (Проекты и его внутренности)
 */
class readXML {
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
	public function save($args, $files){
            // Результат
            $result = array(
                'success' => true,
                'msg' => '',
            );
            $r_success = &$result['success'];
            $r_msg = &$result['msg'];

            $file = $files['loading_data'];
            $tmp_name = $file['tmp_name'];

            // Файл успешно загружен
            $tmpFilePath = $file['tmp_name']; 
            
            // Проверим, что это действительно XML-файл
            if (strpos($file['type'], 'text/xml') !== false || strpos($file['type'], 'application/xml') !== false) {
                // Обработка файла
                $xml = simplexml_load_file($tmpFilePath);
                if (!$xml) {
                    $r_success = false;
                    $r_msg = "Ошибка при распаковке XML файла";
                    return $result;
                }

                // Получаем отдел
                $departament = (array) $xml['Department'];
                $data = new stdClass();
                $data->departament_name = $departament[0];

                $sql = "SELECT nextval('public.id_dep_seq')";
                $qres = @pg_query($this->conn, $sql);
                if(!$qres){
                    $err = pg_last_error($this->conn);
                    $r_success = false;
                    $r_msg = "Ошибка при поиске идентификатора отдела";
                    return $result;
                }
        
                // Сохраняем ключевые поля
                $data->id_departament = (int) pg_fetch_result($qres, 0);
                pg_free_result($qres);

                 // Сохраняем подразделение
                 $res = DbTableHelper::insert($this->conn, 'public.departaments', (array) $data);
        
                 // Записался ли проект?
                 if(!$res){
                    $err = DbTableHelper::getLastError();
                    var_dump($err); exit;
                    $r_success = false;
                    $r_msg = "Ошибка при добавлении отдела";
                    return $result;
                 }   

                unset($data);

                $sql = "SELECT id_departament from public.departaments where departament_name = $1";
                $qres = @pg_query_params($this->conn, $sql, [$departament[0]]);
                if(!$qres){
                    $err = pg_last_error($this->conn);
                    $r_success = false;
                    $r_msg = "Ошибка при поиске идентификатора отдела";
                    return $result;
                }
                // Сохраняем ключевые поля
                $id_departament = (int) pg_fetch_result($qres, 0);
                pg_free_result($qres);


                // Получение пользователей файла
                $users = $xml->Headcount;
                $users = $users->Employee;

                // Получение справочника тематик
                $topics = $xml->Topics;
                $topics = $topics->Topic;

                $data_direction = [];
                
                // Собираем справочник направления тем
                foreach($topics as $key=>$topic){
                    $rec = (array) $topic[0];
                    $rec = $rec['@attributes'];

                    // Если есть направление и оно еще не добавлено
                    if($rec['TopicUpperLevel'] && !in_array($rec['TopicUpperLevel'], $data_direction)){
                        $data_direction[] = [
                            'direction_name' =>  $rec['TopicUpperLevel']
                        ];
                    }
                }

                /**
                 *  записываем направления тем
                 */

                foreach($data_direction as $key=>$rec){
                    $data = new stdClass();
                    $data->direction_name = $rec['direction_name'];

                    $sql = "SELECT count(*) from public.direction where direction_name = $1";
                    $qres = @pg_query_params($this->conn, $sql, [$data->direction_name]);
                    if(!$qres){
                        $err = pg_last_error($this->conn);
                        throw new DbException($err, 'Ошибка поиске идентичных записей тем', E_ERROR_READING_DATA);
                    }
                    $check = ((int) pg_fetch_result($qres, 0) == 0);
                    pg_free_result($qres);

                    if($check){
                        $sql = "SELECT nextval('public.id_direction_seq')";
                        $qres = @pg_query($this->conn, $sql);
                        if(!$qres){
                            $err = pg_last_error($this->conn);
                            $r_success = false;
                            $r_msg = "Ошибка при поиске идентификатора направления темы";
                            return $result;
                        }
    
                        // Сохраняем ключевые поля
                        $data->id_direction = (int) pg_fetch_result($qres, 0);
                        pg_free_result($qres);
    
                         // Сохраняем подразделение
                        $res = DbTableHelper::insert($this->conn, 'public.direction', (array) $data);
                
                        // Записался ли проект?
                        if(!$res){
                            $err = DbTableHelper::getLastError();
                            $r_success = false;
                            $r_msg = "Ошибка при добавлении отдела";
                            return $result;
                        }   
                    }
                    unset($data);
                }

                // Получение справочника тематик
                $topics = $xml->Topics;
                $topics = $topics->Topic;
                // Собираем справочник направления тем
                foreach($topics as $key=>$topic){
                    $rec = (array) $topic[0];
                    $rec = $rec['@attributes'];

                    // Записываем сам Topic
                    $data = new stdClass();
                    $data->topic_name       = $rec['Name'];
                    $data->topic_code       = $rec['TopicId'];
                    $data->id_departament   = $id_departament;

                    // Если есть направление и оно еще не добавлено
                    if($rec['TopicUpperLevel']){
                        $sql = "SELECT id_direction from direction where direction_name = $1";
                        $qres = @pg_query_params($this->conn, $sql, [$rec['TopicUpperLevel']]);
                        if(!$qres){
                            $err = pg_last_error($this->conn);
                            $r_success = false;
                            $r_msg = "Ошибка при поиске идентификатора направления темы";
                            return $result;
                        }
    
                        // Сохраняем ключевые поля
                        $data->id_direction = (int) pg_fetch_result($qres, 0);
                        pg_free_result($qres);
                    }



                    // Ищем ID топика
                    $sql = "SELECT nextval('public.id_topic_seq')";
                    $qres = @pg_query($this->conn, $sql);
                    if(!$qres){
                        $err = pg_last_error($this->conn);
                        $r_success = false;
                        $r_msg = "Ошибка при поиске идентификатора темы";
                        return $result;
                    }

                    // Сохраняем ключевые поля
                    $data->id_topic = (int) pg_fetch_result($qres, 0);
                    pg_free_result($qres);

                  

                     // Сохраняем подразделение
                    $res = DbTableHelper::insert($this->conn, 'public.topic', (array) $data);
            
                    // Записался ли проект?
                    if(!$res){
                        $err = DbTableHelper::getLastError();
                        $r_success = false;
                        $r_msg = "Ошибка при добавлении темы";
                        return $result;
                    }
                    
                    unset($data);
                }


                $mass = [];
                foreach($users as $user){
                    $rec = (array) $user[0];
                    $rec = $rec['@attributes'];

                    $account    = (array) $user->Account;
                    $Topic_emp  = (object) $user->Topic_emp;

                    $account['@attributes']['Login'];

                    $data = new stdClass();
                    $data->id_user      = $rec['ID'];
                    $data->name         = $rec['Firstname'];
                    $data->first_name   = $rec['Lastname'];
                    $data->second_name  = $rec['Middlename'];
                    $data->proflevel    = $rec['ProfLevel'];
                    $data->creating     = ($rec['ProfLevel'] < 5) ? 0 : 1;
                    $data->role_system  = 2;
                    $data->boss_id      = $rec['Boss_id'];
                    $data->gender       = ($rec['Gender'] == 'М') ? 1 : 2;

                    // Преобразуем строку в временную метку
                    $timestamp = strtotime($rec['Birthday']);
                    // Формируем строку в формате PostgreSQL TIMESTAMP
                    $postgres_timestamp = date("Y-m-d H:i:s", $timestamp);

                    $data->date_birth   = pg_escape_string($postgres_timestamp);
                    $data->position     = $rec['Position'];
                    $data->login        = $account['@attributes']['Login'];
                    $data->password     = md5(HASH.$account['@attributes']['Pass']);

                     // Сохраняем проект
                    $res = DbTableHelper::insert($this->conn, 'public.users', (array) $data);
        
                    // Записался ли проект?
                    if(!$res){
                        $err = DbTableHelper::getLastError();
                        $r_success = false;
                        $r_msg = "Ошибка при добавлении пользователя из XML файла";
                        return $result;
                    }   

                    if($Topic_emp){
                        foreach($Topic_emp->UserTopic as $userTopic){
                            $attributes = $userTopic->attributes();

                            $sql = "SELECT id_topic FROM public.topic WHERE topic_code = $1";
                            $qres = @pg_query_params($this->conn, $sql, [$attributes['TopicId']]);
                            if(!$qres){
                                $err = pg_last_error($this->conn);
                                $r_success = false;
                                $r_msg = "Ошибка при поиске идентификатора темы";
                                return $result;
                            }

                            // Сохраняем ключевые поля
                            $id_topic = (int) pg_fetch_result($qres, 0);
                            pg_free_result($qres);

                            $mass = [
                                'id_user'    => (int) $data->id_user,
                                'id_topic'   => $id_topic
                            ];

                             // Сохраняем проект
                            $res = DbTableHelper::insert($this->conn, 'public.topic_user', $mass);
                
                            // Записался ли проект?
                            if(!$res){
                                $err = DbTableHelper::getLastError();
                                $r_success = false;
                                $r_msg = "Ошибка при добавлении тематик пользователей";
                                return $result;
                            }   
                        }
                    }
                    unset($data);
                }
            } else {
                $r_success = false;
                $r_msg = "Вы пытаетесь загрузить не XML файл";
                return $result;
            }

            // Сохраняем изменения
		    $this->CI->commitTransaction();

            $r_success = true;
            $r_msg = "Данные успешно загружены в БД по XML файлу";
            return $result;
        
    }
}