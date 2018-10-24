<?php

/**
 * @Author: liutingxie
 * @Date:   2017-11-15 11:09:37
 * @Last Modified by:   liutingxie
 * @Last Modified time: 2017-12-24 16:22:56
 */

function combine_currency_multi_data($limit, $tsym) {

	$nameData = storm_currency::getCurrencyName($limit);
	$fsyms = '';
	foreach ($nameData as $key => $value) {
		$fsyms .= $value['name'] . ',';
	}

	return $fsyms;
	$data = storm_get_currency_multi_curl($fsyms, $tsym);

	$arr = [];

	$arr['toplistcoin'] = json_decode($data[0], ARRAY_A);
	$arr['supplyData'] = json_decode($data[1], ARRAY_A);

	foreach ($nameData as $key => $value) {
		$arr['commomcoin'][$value['name']] = $value['coinname'];
	}

	return $arr;
}