<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once 'vendor/autoload.php';
use Tecnick\TCPDF;

require_once(CLASS_PATH . 'DbConnection.php');

/**
 * Класс auth (Авторизация + берём данные пользователя)
 */
class PDFPrint {
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

	/**
	 */
	public function __construct(){
		$this->CI = DbConnection::getInstance();
		$this->conn = $this->CI->getConnection();
	}

	/**
	 */
	public function __destruct(){}

    public function print($args){

        // Создаем новый экземпляр TCPDF
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // Добавляем страницу
        $pdf->AddPage();

        // Печать текста
        $pdf->Write(0, 'Привет, мир!');

        // Печать
        return $pdf->Write(0, 'Привет, мир!');
    }
}
?>