<?php
defined('BASE_PATH') || exit('Прямой доступ к скрипту не поддерживается');

/**
 * Array2XML: A class to convert array in PHP to XML
 * It also takes into account attributes names unlike SimpleXML in PHP
 * It returns the XML in form of DOMDocument class for further manipulation.
 * It throws exception if the tag name or attribute name has illegal chars.
 *
 * Author : Lalit Patel
 * License: Apache License 2.0
 *          http://www.apache.org/licenses/LICENSE-2.0
 * Modified by egorovss
 * Usage:
 *       $xml = Array2XML::convert('root_node_name', $php_array);
 *       echo($xml->saveXML());
 *       or
 *       $xml = new DOMDocument();
 *       ...
 *       Array2XML::init($xml);
 *       Array2XML::convert('root_node_name', $php_array);
 *       echo($xml->saveXML());
 */

class Array2XML {

	private static $xml = null;

	/**
	 * Initialize the root XML node [optional].
	 * @param DOMDocument $document [optional] root node document
	 */
	public static function init($document){
		if($document instanceof DOMDocument){
			static::$xml = $document;
		} else {
			static::$xml = new DOMDocument('1.0' , 'UTF-8');
		}
	}

	/**
	 * Convert an Array to XML.
	 * @param string $node_name name of the root node to be converted
	 * @param array $arr array to be converted
	 * @return DOMDocument
	 */
	public static function &convert($node_name, $arr = []){
		$xml = static::getXMLRoot();
		$xml->appendChild(static::convertNode($node_name, $arr));
		static::$xml = null;
		return $xml;
	}

	/**
	 * Convert an Array to XML node.
	 * @param string $node_name name of the root node to be converted
	 * @param array $arr array to be converterd
	 * @return DOMNode
	 */
	private static function &convertNode($node_name, $arr = []){
		$xml = static::getXMLRoot();
		$node = $xml->createElement($node_name);
		if(is_array($arr)){
			if(isset($arr['@attributes'])){
				foreach($arr['@attributes'] as $key => $value){
					if(!static::isValidTagName($key)){
						throw new Exception("Недопустимый символ в имени атрибута. Атрибут '$key' в узле '$node_name'", E_USER_ERROR);
					}
					$node->setAttribute($key, static::bool2str($value));
				}
				unset($arr['@attributes']);
			}
			if(isset($arr['@value'])){
				$node->appendChild($xml->createTextNode(static::bool2str($arr['@value'])));
				unset($arr['@value']);
				return $node;
			} else if(isset($arr['@cdata'])){
				$node->appendChild($xml->createCDATASection(static::bool2str($arr['@cdata'])));
				unset($arr['@cdata']);
				return $node;
			}
		}
		if(is_array($arr)){
			foreach($arr as $key => $value){
				if(!static::isValidTagName($key)){
					throw new Exception("Недопустимый символ в имени тега. Тег '$key' в узле '$node_name'", E_USER_ERROR);
				}
				if(is_array($value) && is_numeric(key($value))){
					foreach($value as $k=>$v){
						$node->appendChild(static::convertNode($key, $v));
					}
				} else {
					$node->appendChild(static::convertNode($key, $value));
				}
				unset($arr[$key]);
			}
		}
		if(!is_array($arr)) {
			$node->appendChild($xml->createTextNode(static::bool2str($arr)));
		}
		return $node;
	}

	/**
	 * Get the root XML node, if there isn't one, create it.
	 * @return DOMDocument
	 */
	private static function getXMLRoot(){
		if(empty(static::$xml)){
			static::init();
		}
		return static::$xml;
	}

	/**
	 * Get string representation of boolean value.
	 * @param boolean $v boolean value
	 * @return string
	 */
	private static function bool2str($v){
		$v = ($v === true) ? 'true' : $v;
		$v = ($v === false) ? 'false' : $v;
		return $v;
	}

	/**
	 * Check if the tag name or attribute name contains illegal characters.
	 * @param string $tag tag name
	 * @return boolean
	 */
	private static function isValidTagName($tag){
		$pattern = '/^[a-z_]+[a-z0-9\:\-\.\_]*[^:]*$/i';
		return (preg_match($pattern, $tag, $matches) && ($matches[0] == $tag));
	}
}