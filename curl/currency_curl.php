<?php

/**
 * @Author: liutingxie
 * @Date:   2017-11-14 10:07:54
 * @Last Modified by:   liutingxie
 * @Last Modified time: 2017-12-31 21:13:17
 */

function storm_get_currency_curl($url) {

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, 0);

	$res = curl_exec($ch);
	curl_close($ch); //close the handle

	return json_decode($res, ARRAY_A);
}