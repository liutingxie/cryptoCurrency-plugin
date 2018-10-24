<?php

/**
 * @Author: liutingxie
 * @Date:   2017-11-14 10:07:54
 * @Last Modified by:   liutingxie
 * @Last Modified time: 2017-12-24 16:06:37
 */

function storm_get_currency_multi_curl($fsyms, $tsym) {

	$urlArr = array();
	$urlArr[] = 'https://www.cryptocompare.com/api/data/toplistvolumesnapshot/?limit=ALL&symbol=' . strtolower($tsym);
	$urlArr[] = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms='.$fsyms.'&tsyms='.strtoupper($tsym);

	$mh = curl_multi_init();
	foreach ($urlArr as $i => $value) {
		$ch[$i] = curl_init();
		curl_setopt($ch[$i], CURLOPT_URL, $value);
		curl_setopt($ch[$i], CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch[$i], CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch[$i], CURLOPT_HEADER, 0);
		curl_multi_add_handle($mh, $ch[$i]);
	}

	$active = null;
	//execult the handle
	do{
        $mrc = curl_multi_exec($mh, $active);
    }while($mrc == CURLM_CALL_MULTI_PERFORM);

	while ($active && $mrc == CURLM_OK) {
	    if (curl_multi_select($mh) == -1) {
	        usleep(100);
	    }
	    do {
	        $mrc = curl_multi_exec($mh, $active);
	        $info = curl_multi_info_read($mh);
	    } while ($mrc == CURLM_CALL_MULTI_PERFORM);
	}

	foreach ($urlArr as $j => $value) {
		$res[$j] = curl_multi_getcontent($ch[$j]); //get response info
		curl_multi_remove_handle($mh, $ch[$j]); //release
		curl_close($ch[$j]); //close the handle
	}

	curl_multi_close($mh);

	return $res;
}