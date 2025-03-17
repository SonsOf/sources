<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CLASS_PATH . 'DbConnection.php');

/**
 * Текущий пользователь.
 */
class CurrentUser {
	/**
	 * Данные пользователя.
	 * @var array
	 */
	private static $data = [];

	/**
	 * Роли пользователя.
	 * @var array
	 */
	private static $roles = [];

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
	 * Возвращает данные пользователя: ФИО, таб. номер, цех и т.д.
	 * @return array
	 */
	public static function getInfo(){
		// Кеш
		if(!empty(static::$data)){
			return static::$data;
		}

		$conn = DbConnection::connect();

		$sql = "
			SELECT
				ce24,
				p704,
				initcap(trim(c393)) p7051,
				initcap(trim(c394)) p7052,
				initcap(trim(c395)) p7053,
				initcap(trim(p710)) p710,
				x453, x459,
				x745 as p700s
			FROM
				mm069.ab050h19
			WHERE
					(lower(ce24) = lower(current_user))
		";
		$qres = @pg_query($conn, $sql);
		if(!$qres){
			$err = pg_last_error($conn);
			throw new DbException($err, 'Невозможно прочитать данные пользователя', E_ERROR_READING_USER_DATA);
		}
		if($row = pg_fetch_assoc($qres)){
			static::$data = [
				'ce24' => (string) $row['ce24'],
				'p704' => (int) $row['p704'],
				'p7051' => (string) $row['p7051'],
				'p7052' => (string) $row['p7052'],
				'p7053' => (string) $row['p7053'],
				'p710' => (string) $row['p710'],
				'p710f' => ((string) $row['p7051']) . ' ' . ((string) $row['p7052']) . ' ' . ((string) $row['p7053']),
				'x453' => (int) $row['x453'],
				'x459' => (int) $row['x459'],
				'p700s' => (string) $row['p700s']
			];
		} else {
			throw new Exception('Не найдены данные пользователя', E_USER_DATA_NOT_FOUND);
		}
		pg_free_result($qres);

		return static::$data;
	}

	/**
	 * Возвращает роли пользователя.
	 * @return array
	 */
	public static function getRoles(){
		// Кеш
		if(!empty(static::$roles)){
			return static::$roles;
		}

		$conn = DbConnection::connect();

		/*$sql = "
			WITH RECURSIVE cte AS (
				SELECT oid FROM pg_roles WHERE rolname = current_user
				UNION ALL
				SELECT m.roleid FROM cte JOIN pg_auth_members m ON (m.member = cte.oid)
			)
			SELECT oid, pg_get_userbyid(oid) FROM cte;
		";*/
		$sql = "
			SELECT
				rolname
			FROM
				pg_roles
			WHERE
					pg_has_role(current_user, oid, 'member')
		";
		$qres = @pg_query($conn, $sql);
		if(!$qres){
			$err = pg_last_error($conn);
			throw new DbException($err, 'Невозможно прочитать роли пользователя', E_ERROR_READING_USER_ROLES);
		}
		if($roles = pg_fetch_all_columns($qres)){
			static::$roles = $roles;
		} else {
			throw new Exception('Не найдены роли пользователя', E_USER_ROLES_NOT_FOUND);
		}
		pg_free_result($qres);

		return static::$roles;
	}

	/**
	 * Возвращает номер группы ролей пользователя.
	 * Выбирается группа с минимальным номером для которой есть совпадения ролей группы и ролей пользователя.
	 * @param array $roles группы ролей
	 * Формат: array(номер_группы_1 => array('роль_1', 'роль_2', ...), номер_группы_2 => array('роль_3', ...))
	 * @return number номер группы ролей или -1 если группа не найдена
	 */
	public static function getRolesGroup($roles){
		$userRoles = static::getRoles();
		ksort($roles);
		foreach($roles as $group_num => $roles_group){
			if(array_intersect($roles_group, $userRoles)){
				return $group_num;
			}
		}
		return -1;
	}

	/**
	 * Проверяет есть ли у пользователя указанные роли.
	 * @param string/array $roles проверяемые роли
	 * @param boolean $strict (optional) если равно true, то проверяет наличие всех ролей
	 * @return boolean true - если есть хотябы одна из ролей / есть все роли (при strict = true), false иначе
	 */
	public static function hasRole($roles, $strict = false){
		$userRoles = static::getRoles();
		$roles = is_array($roles)? $roles : [$roles];
		foreach($roles as $role){
			if(is_string($role)){
				$exist = in_array($role, $userRoles);
			} else if(is_array($role)){
				$exist = static::hasRole($role, $strict);
			} else {
				$exist = false;
			}
			if($exist && !$strict){
				return true;
			}
			if(!$exist && $strict){
				return false;
			}
		}
		return false;
	}
}