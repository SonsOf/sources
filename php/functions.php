<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

/**
 * Копирует позиции с ключами $keys из массива $src в массив $dst,
 * возвращает массив $dst.
 * @param array $dst массив в который копируются значения
 * @param array $src массив из которого копируются значения
 * @param array $keys копируемые ключи
 * @return array
 */
function array_copy_keys(&$dst, $src, $keys){
	$dst = array_merge($dst, array_intersect_key($src, array_flip($keys)));
	return $dst;
}

/**
 * Создаёт новый массив путём копирования позиции с ключами $keys из массива $src.
 * @param array $src массив из которого копируются значения
 * @param array $keys копируемые ключи
 * @return array
 */
function array_get_keys($src, $keys){
	return array_intersect_key($src, array_flip($keys));
}

/**
 * Создаёт новый массив путём копирования позиции из массива $src кроме
 * позиции с ключами $keys.
 * @param array $src массив из которого копируются значения
 * @param array $keys ключи которые будут исключены при копировании
 * @return array
 */
function array_exclude_keys($src, $keys){
	return array_diff_key($src, array_flip($keys));
}

/**
 * Преобразует многоуровневый массив в одноуровневый.
 * Корневые значения копируются в конечные массивы.
 * Пример:
 * 		array_flatten([
 * 			'x453' => 1,
 * 			[
 * 				'p704' => 1000,
 * 				'x459' => 1
 * 			], [
 * 				'p704' => 1001
 * 			], [
 * 				'x459' => 3,
 * 				[
 * 					'p710' => 'Васильев'
 * 				], [
 * 					'x453' => 2,
 * 					[
 * 						'p704' => 1002
 * 					], [
 * 						'x459' => 4,
 * 						[
 * 							['p710' => 'Лепнов']
 * 						]
 * 					]
 * 				]
 * 			]
 * 		])
 * 		преобразует в:
 * 		[
 * 			[
 * 				[x453] => 1,
 * 				[p704] => 1000,
 * 				[x459] => 1
 * 			], [
 * 				[x453] => 1,
 * 				[p704] => 1001
 * 			], [
 * 				[x453] => 1,
 * 				[x459] => 3,
 * 				[p710] => Васильев
 * 			], [
 * 				[x453] => 2,
 * 				[x459] => 3,
 * 				[p704] => 1002
 * 			], [
 * 				[x453] => 2,
 * 				[x459] => 4,
 * 				[p710] => Лепнов
 * 			]
 * 		]
 *
 * @param array $array исходный массив
 * @param array $outer_params (опционально) корневые значения
 * @return array
 */
function array_flatten($array, $outer_params = []){
	$result = [];
	foreach($array as $value){
		if(!is_array($value)){
			continue;
		}
		$is_all_keys_associative = array_filter(array_keys($value), 'is_string') == array_keys($value);
		$is_all_values_scalar = count(array_filter($value, 'is_array')) === 0;
		if($is_all_keys_associative && $is_all_values_scalar){
			$result[] = array_merge($outer_params, $value);
		} else {
			$this_params = array_merge($outer_params, array_filter($value, function($v){
				return !is_array($v);
			}));
			$result = array_merge($result, array_flatten($value, $this_params));
		}
	}
	return $result;
}

/**
 * Группирует ассоциативный массив.
 * Правила группирования:
 * ',' - группировка с объединением, когда поля группируются на одном уровне
 * ';' - группировка с разделением на уровни
 * Примеры описания правил:
 * array(array('a', 'b'), array('c', 'd'))  = 'a,b;c,d'
 * array(array('a', 'b'), 'с')              = 'a,b;c'
 * array('a,b', 'с')                        = 'a,b;c'
 * array('a', 'b', 'c')                     = 'a,b,c'
 * array('a')                               = 'a'
 * @param array $input исходный массив
 * @param array/string $group_by правила группирования
 * @return array сгруппированный массив
 */
function array_group($input, $group_by){
	$result = [];
	$sort_groups = [];
	// Функция группировки
	function group_row(&$result, $row, $groups, $level){
		foreach($result as $i => $a){
			foreach($groups[$level] as $f){
				if($a[$f] != $row[$f]){
					continue 2;
				}
			}
			$key = $i;
		}
		if(!isset($key)){
			$a = [];
			$a['id'] = count($result);
			foreach($groups[$level] as $f){
				$a[$f] = $row[$f];
			}
			$a['items'] = [];
			$length = array_push($result, $a);
			$key = $length - 1;
		}
		foreach($groups[$level] as $f){
			unset($row[$f]);
		}
		if(isset($groups[$level + 1])){
			group_row($result[$key]['items'], $row, $groups, $level + 1);
		} else {
			$row['id'] = count($result[$key]['items']);
			array_push($result[$key]['items'], $row);
		}
	}
	// Формируем массив по которому будем группировать
	if(is_array($group_by)){
		foreach($group_by as $k => $v){
			if(is_array($v)){
				$sort_groups[$k] = $v;
			} else {
				$sort_groups[$k] = split(',', $v);
			}
		}
	} else {
		$g = split(';', $group_by);
		foreach($g as $k => $v){
			array_push($sort_groups, split(',', $v));
		}
	}
	// Группируем
	foreach($input as $row){
		group_row($result, $row, $sort_groups, 0);
	}
	return $result;
}

/**
 * Преобразует первый символ строки в верхний регистр, остальные в нижний.
 * Для многобайтных кодировок.
 * @param string $str исходная строка
 * @param string $encoding (optional) исходная кодировка
 * @return string
 */
function mb_ucfirst($str, $encoding = null){
	return (
		mb_strtoupper(mb_substr($str, 0, 1, $encoding), $encoding).
		mb_strtolower(mb_substr($str, 1, mb_strlen($str, $encoding) - 1, $encoding), $encoding)
	);
}

/**
 * Преобразует первый символ каждого слова в верхний регистр, остальные в нижний.
 * Для многобайтных кодировок.
 * @param string $str исходная строка
 * @param string $encoding (optional) исходная кодировка
 * @return string
 */
function mb_ucwords($str, $encoding = null){
	return mb_convert_case($str, MB_CASE_TITLE, $encoding);
}


/**
 * Генерируем хэш для хэш-пароля
 */
function generateHash(){
	/*$hash = '';
	$hashLength = 8; // длина хэша

	// Рандомно определяем символьную единицу и добавляем к хэшу, пока не достигнем нужной длины 
	for($i = 0; $i < $hashLength; $i++) {
		$hash .= chr(mt_rand(33, 126)); // символ из ASCII-table
	}*/

	$hash = 'AtomSkills';

	return $hash;
}


// Функция запроса к REST API
function makeRequest($url, $args){

	$url = ($args) ? $url.'?'. http_build_query($args) : $url;

	// Инициализируем новый сеанс с CURL
	$curl = curl_init($url);

	// При неудачном сеансе - выходим
	if ($curl === false) return false;

	// Задаем параметр для сеанса: возврат ответа в виде строки, а не напрямую в браузер
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

	// Выполнение запроса и запись резултата
	$result = curl_exec($curl);

	// Закрытие сеанса
	curl_close($curl);

	// Передаем массив PHP, конвектируемый из JSON-формата
	return json_decode($result);
}


// Подключение к базе вне класса
function db_connect(){
	$conn_string = "host=localhost port=5432 dbname=postgres user=postgres password=postgres";
	$conn = @pg_connect($conn_string);
	return $conn;
}

function db_disconnect($conn){
	pg_close($conn);
}