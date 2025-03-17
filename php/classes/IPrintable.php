<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

/**
 * Интерфейс печати машинограммы.
 */
interface IPrintable {
	/**
	 * Возвращает настройки принтера для печати машинограммы (dtd, xsl файлы и т.д.).
	 * @param array $config конфиг принтера
	 * @return array
	 */
	public function getPrintSettings($config);

	/**
	 * Возвращает данные для печати машинограммы.
	 * @param object $args
	 * @return array
	 */
	public function getPrintData($args);

	/**
	 * Очищает временные данные сформированные при печати машинограммы (файлы изображений, штрих-кодов и т.д.).
	 * @param object $args
	 */
	public function clearPrintData($args);
}