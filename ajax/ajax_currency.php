<?php

/**
 * @Author: liutingxie
 * @Date:   2017-11-10 10:44:12
 * @Last Modified by:   liutingxie
 * @Last Modified time: 2017-12-31 21:13:25
 */
add_action('wp_ajax_currencyScreenSetting', 'currency_screen_setting_ajax');
add_action('wp_ajax_nopriv_currencyScreenSetting', 'currency_screen_setting_ajax');

function currency_screen_setting_ajax() {
	$data = [];
    if($_POST['data']) {
        $data['per_page'] = $_POST['data'][0];
        $data['symbol'] = $_POST['data'][1];
    }

	update_option('currency-screen-setting', $data);

	die();
}

add_action('wp_ajax_currencyImport', 'currency_import');
add_action('wp_ajax_nopriv_currencyImport', 'currency_import');

function currency_import() {

    if( current_user_can( 'delete_plugins' ) ) {
        $dir = wp_upload_dir();
        $json_name = $dir['basedir'] . '/cryptocurrency-json.js';
        $data = file_get_contents( $json_name );
        storm_import_data( json_decode( $data, true ) );
    }
    else {
        _e( 'You do not have enough permission to import sliders', 'StormSlider' );
    }

	die();
}

function storm_import_data($data) {
    if( isset( $data ) ) {
        global $wpdb;
        $page = get_page_by_title( 'CryptoCurrency' );
        if(!$page->ID) {
            $parentId = create_currency_parent_page();
        }
        else {
            $parentId = $page->ID;
        }
        wp_defer_term_counting( true );
        wp_defer_comment_counting( true );
        $wpdb->query( 'SET autocommit = 0;' );
        foreach ( $data as $key => $value ) {
            $sliderId = storm_currency::importCoin( $key, $value );

            if($sliderId) {
                storm_currency_create_page( $key, $parentId );
            }
        }
        $wpdb->query( 'COMMIT;' );
        wp_defer_term_counting( false );
        wp_defer_comment_counting( false );
    }

    die();
}

add_action('wp_ajax_currencyRemoveAllCryptoCurrency', 'currency_remove');
add_action('wp_ajax_nopriv_currencyRemoveAllCryptoCurrency', 'currency_remove');

function currency_remove() {

    //Remove all cryptocurrency data
	if( current_user_can( 'delete_plugins' ) ) {
	    storm_currency::removeAll();
	}

	die();
}

add_action('wp_ajax_loadcoinlist', 'currency_load_coin_list');
add_action('wp_ajax_nopriv_loadcoinlist', 'currency_load_coin_list');

function currency_load_coin_list() {
    $limit = !empty($_POST['limit']) ? $_POST['limit'] : 'ALL';
    $symbol = !empty($_POST['symbol']) ? $_POST['symbol'] : 'btc';

    $url = 'https://www.cryptocompare.com/api/data/toplistvolumesnapshot/?limit=' . $limit . '&symbol=' . $symbol;
    $data = storm_get_currency_curl($url);

    $nameData = storm_currency::getCurrencyName($limit);

    $arr = [];
    $arr['toplistcoin'] = $data['Data'];

    foreach ($nameData as $key => $value) {
        $arr['commomcoin'][$value['name']] = $value['coinname'];
    }

    die(json_encode($arr));
}

add_action('wp_ajax_loadcoinpage', 'currency_load_coin_page');
add_action('wp_ajax_nopriv_loadcoinpage', 'currency_load_coin_page');

function currency_load_coin_page() {
    $fsyms = !empty($_POST['fsyms']) ? $_POST['fsyms'] : 'BTC';
    $tsyms = !empty($_POST['tsyms']) ? $_POST['tsyms'] : 'BTC';

    $url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms='.$fsyms.'&tsyms='.$tsyms;

    $data = storm_get_currency_curl($url);

    die(json_encode($data['RAW']));
}
