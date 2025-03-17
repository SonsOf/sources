<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

/**
 * Абстрактный класс видеограммы.
 */
abstract class Videogram {
	/**
	 * Возвращает данные видеограммы.
	 * @param object $args
	 * @return array
	 */
	abstract public function getData($args);
}