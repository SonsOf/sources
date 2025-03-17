<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

/**
 * Класс для работы со строками.
 */
class StrHelper {
	/**
	 * Мнемокоды спецсимволов
	 * @var array
	 */
	private static $mnemonics = [
		'&#8470;', '&#216;', '&#177;',
		'&#176;', '&#8804;', '&#8805;',
		'&#8800;', '&#8776;', '&#247;',
		'&#8721;', '&#178;', '&#179;',
		'&#8734;', '&#171;', '&#187;',
		'&#968;', '&#948;', '&#949;',
		'&#963;', '&#964;', '&#931;'
	];

	/**
	 * Спецсимволы
	 * @var array
	 */
	private static $mnemonics_utf8 = [
		'№', 'Ø', '±',
		'°', '≤', '≥',
		'≠', '≈', '÷',
		'∑', '²', '³',
		'∞', '«', '»',
		'ψ', 'δ', 'ε',
		'σ', 'τ', 'Σ'
	];

	/**
	 * Форматирует строку с именованными аргументами.
	 * @example
	 * 	print_r(StrHelper::sprintfn("second: %(second)s ; first: %(first)s", array(
	 * 		'first' => '1st',
	 * 		'second'=> '2nd'
	 * 	)));
	 * @param array/string $format форматируемая строка или массив строк
	 * @param array $args массив типа ['arg_name' => 'arg value', ...] которым производится замена
	 * @return array/string/false результат форматирования или false если ошибка
	 */
	public static function sprintfn($format, array $args = []){
		if(is_array($format)){
			foreach($format as &$f){
				$f = static::sprintfn($f, $args);
			}
			return $format;
		}
		$arg_nums = array_slice(array_flip(array_keys([0 => 0] + $args)), 1);
		for($pos = 0; preg_match('/(?<=%)\(([a-zA-Z_]\w*)\)/', $format, $match, PREG_OFFSET_CAPTURE, $pos);){
			$arg_pos = $match[0][1];
			$arg_len = strlen($match[0][0]);
			$arg_key = $match[1][0];
			if(!array_key_exists($arg_key, $arg_nums)){
				return false;
			}
			$format = substr_replace($format, $replace = $arg_nums[$arg_key] . '$', $arg_pos, $arg_len);
			$pos = $arg_pos + strlen($replace);
		}
		return vsprintf($format, array_values($args));
	}

	/**
	 * Конвертирует в массиве мнемокоды в соответствующие символы юникода.
	 * @param mixed &$input исходный массив
	 * @return mixed
	 */
	public static function mnemonics2unicode(&$input){
		if(is_string($input)){
			$input = str_replace(static::$mnemonics, static::$mnemonics_utf8, $input);
		} else if(is_array($input)){
			foreach($input as &$value){
				static::mnemonics2unicode($value);
			}
		} else if(is_object($input)){
			$vars = array_keys(get_object_vars($input));
			foreach($vars as &$var){
				static::mnemonics2unicode($input->$var);
			}
		}
		return $input;
	}

	/**
	 * Конвертирует в массиве символы юникода в соответствующие мнемокоды.
	 * @param mixed &$input исходный массив
	 * @return mixed
	 */
	public static function unicode2mnemonics(&$input){
		if(is_string($input)){
			$input = str_replace(static::$mnemonics_utf8, static::$mnemonics, $input);
		} else if(is_array($input)){
			foreach($input as &$value){
				static::unicode2mnemonics($value);
			}
		} else if(is_object($input)){
			$vars = array_keys(get_object_vars($input));
			foreach($vars as &$var){
				static::unicode2mnemonics($input->$var);
			}
		}
		return $input;
	}

	/**
	 * Конвертирует массив в указанную кодировку.
	 * @param string $enc_from исходная кодировка
	 * @param string $enc_to конечная кодировка
	 * @param mixed &$input исходный массив
	 * @return mixed
	 */
	public static function iconv_array(&$input, $enc_from, $enc_to){
		if(is_string($input)){
			$input = iconv($enc_from, $enc_to, $input);
		} else if(is_array($input)){
			foreach($input as &$value){
				static::iconv_array($value, $enc_from, $enc_to);
			}
		} else if(is_object($input)){
			$vars = array_keys(get_object_vars($input));
			foreach($vars as &$var){
				static::iconv_array($input->$var, $enc_from, $enc_to);
			}
		}
		return $input;
	}

	/**
	 * Возвращает строку в которой символы одной раскладки клавиатуры заменены на
	 * символы из другой.
	 * @param string $str исходная строка
	 * @param integer $direction (по-умолчанию 'английский -> русский') направление:
	 *                           0 - 'русский -> английский',
	 *                           1 - 'английский -> русский',
	 *                           2 - совмещённое, когда преобразование происходит одновременно в обе стороны
	 * @return string
	 */
	private function switchKbLayout($str, $direction = 1){
		// TODO: решить проблему с пересекающимися символами
		$replaces = [
			'й' => 'q', 'ц' => 'w', 'у' => 'e', 'к' => 'r', 'е' => 't', 'н' => 'y',
			'г' => 'u', 'ш' => 'i', 'щ' => 'o', 'з' => 'p', 'х' => '[', 'ъ' => ']',

			'ф' => 'a', 'ы' => 's', 'в' => 'd', 'а' => 'f', 'п' => 'g', 'р' => 'h',
			'о' => 'j', 'л' => 'k', 'д' => 'l', 'ж' => ';', 'э' => '\'',

			'я' => 'z', 'ч' => 'x', 'с' => 'c', 'м' => 'v', 'и' => 'b', 'т' => 'n',
			'ь' => 'm', 'б' => ',', 'ю' => '.', '.' => '/', 'ё' => '`',

			'Й' => 'Q', 'Ц' => 'W', 'У' => 'E', 'К' => 'R', 'Е' => 'T', 'Н' => 'Y',
			'Г' => 'U', 'Ш' => 'I', 'Щ' => 'O', 'З' => 'P', 'Х' => '{', 'Ъ' => '}',

			'Ф' => 'A', 'Ы' => 'S', 'В' => 'D', 'А' => 'F', 'П' => 'G', 'Р' => 'H',
			'О' => 'J', 'Л' => 'K', 'Д' => 'L', 'Ж' => ':', 'Э' => '"',

			'Я' => 'Z', 'Ч' => 'X', 'С' => 'C', 'М' => 'V', 'И' => 'B', 'Т' => 'N',
			'Ь' => 'M', 'Б' => '<', 'Ю' => '>', ',' => '?', 'Ё' => '~',

			'"' => '@', '№' => '#', ';' => '$', ':' => '^', '?' => '&'
		];
		switch($direction){
			case 0:
				return strstr($str, $replaces);
			case 1:
				return strstr($str, array_flip($replaces));
			case 2:
				return strstr($str, array_merge($replaces, array_flip($replaces)));
			default:
				return $str;
		}
	}
}