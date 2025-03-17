<?php
/**
 * Корневой модуль.
 * Печать
 * На вход _POST
 */
define('BASE_PATH',         dirname(__FILE__) . '/../../');
define('PHP_PATH',          BASE_PATH . 'php/');
define('CONFIG_PATH',       PHP_PATH . 'config/');
define('CLASS_PATH',        PHP_PATH . 'classes/');
define('LIB_PATH',          PHP_PATH . 'lib/');
define('PHPEXCEL_PATH',     LIB_PATH . 'PHPExcel/');



require_once(FPDF_PATH . 'fpdf.php');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(PHP_PATH . 'functions.php');

// создаем PDF документ
$pdf=new FPDF();
$pdf->AddFont('Arial', '', 'Arial.php');

// устанавливаем заголовок документа
$pdf->SetTitle("kakorin.com test pdf");

// создаем страницу
$pdf->AddPage('P');
$pdf->SetDisplayMode('real','default');

// устанавливаем шрифт Ариал
$pdf->SetFont('Arial');
// устанавливаем цвет шрифта
$pdf->SetTextColor(250,60,100);
// устанавливаем размер шрифта
$pdf->SetFontSize(10);

// добавляем текст
$pdf->SetXY(10,10);
$pdf->Write(0,'Коммерческое предложение');


// выводим документа в браузере
$pdf->Output('iskspb.ru.pdf','I');
