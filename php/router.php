<?php
/**
 * Корневой модуль.
 * Роутер для Ext.Direct
 * На вход _POST
 */
define('BASE_PATH', dirname(__FILE__) . '/../');
define('PHP_PATH', BASE_PATH . 'php/');
define('CONFIG_PATH', PHP_PATH . 'config/');
define('CLASS_PATH', PHP_PATH . 'classes/');
define('CLASS_VIDEOGRAMS_PATH', CLASS_PATH . 'videograms/');
define('LIB_PATH', PHP_PATH . 'lib/');

require_once(CONFIG_PATH . 'constants.php');
require_once(CONFIG_PATH . 'config.php');

require_once(CONFIG_PATH . 'api.php');

require_once(PHP_PATH . 'functions.php');

// Загружаем классы из папки classes
spl_autoload_register(function($class_name){
	$path = CLASS_PATH . $class_name . '.php';
	if(file_exists($path)){
		require_once($path);
	}
});

// Загружаем классы из папки classes/videograms
spl_autoload_register(function($class_name){
	$path = CLASS_VIDEOGRAMS_PATH . $class_name . '.php';
	if(file_exists($path)){
		require_once($path);
	}
});

function doRpc($cdata){
	global $API;
	global $config;

	try {
		// Класс
		$action = (string) $cdata->action;
		if(!isset($API[$cdata->action])){
			throw new Exception("Вызов неопределённого класса: '{$cdata->action}'", E_UNDEFINED_ACTION);
		}
		$adef = $API[$action];
		doAroundCalls($adef['before'], $cdata);

		// Метод
		$method = (string) $cdata->method;
		if(!isset($adef['methods'][$method])){
			throw new Exception("Вызов неопределённого метода: '$method' в классе '$action'", E_UNDEFINED_METHOD);
		}
		$mdef = $adef['methods'][$method];
		doAroundCalls($mdef['before'], $cdata);

		// Параметры
		$params = (isset($cdata->data) && is_array($cdata->data))? $cdata->data : [];

		// Результат
		$result = [
			'type' => 'rpc',
			'tid' => $cdata->tid,
			'action' => $action,
			'method' => $method
		];

		// Выполнение запроса
		$class = new $action();
		$result['result'] = call_user_func_array([$class, $method], $params);

		doAroundCalls($mdef['after'], $cdata, $result);
		doAroundCalls($adef['after'], $cdata, $result);
	} catch(Exception $e){
		$result['type'] = 'exception';
		$result['message'] = $e->getMessage();
		$result['code'] = $e->getCode();
		$result['file'] = $e->getFile();
		$result['line'] = $e->getLine();
		$result['trace'] = $e->getTrace();
		$result['where'] = $e->getTraceAsString();

		// Дополнительные данные при ошибке в БД
		if(/*$config['debug'] &&*/ ($e instanceof DbException)){
			$result['db_code'] = $e->getDbCode();
			$result['db_message'] = $e->getDbMessage();
		}
	}

	return $result;
}

function doAroundCalls(&$fns, &$cdata, &$returnData = null){
	if(!$fns){
		return;
	}
	if(is_array($fns)){
		foreach($fns as $f){
			$f($cdata, $returnData);
		}
	} else {
		$fns($cdata, $returnData);
	}
}

class BogusAction {
	public $action;
	public $method;
	public $data;
	public $tid;
}

$isForm = false;
$isUpload = false;
$raw_data = file_get_contents('php://input');
if($raw_data){
	header('Content-Type: text/javascript');
	$data = json_decode($raw_data);
} else if(isset($_POST['extAction'])){
	$isForm = true;
	$isUpload = ($_POST['extUpload'] == 'true');
	$data = new BogusAction();
	$data->action = $_POST['extAction'];
	$data->method = $_POST['extMethod'];
	$data->tid = isset($_POST['extTID'])? $_POST['extTID'] : null;
	$data->data = [$_POST, $_FILES];
} else {
	exit('Ошибка запроса');
}

$response = null;
if(is_array($data)){
	$response = [];
	foreach($data as $d){
		$response[] = doRpc($d);
	}
} else {
	$response = doRpc($data);
}

$response = json_encode(
	$response,
	JSON_UNESCAPED_UNICODE |
	JSON_UNESCAPED_SLASHES |
	($config['debug']? JSON_PRETTY_PRINT : 0)
);

if($isForm && $isUpload){
	echo("<html><body><textarea>$response</textarea></body></html>");
} else {
	echo $response;
}