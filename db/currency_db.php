<?php

/**
 * @Author: liutingxie
 * @Date:   2017-11-10 10:32:27
 * @Last Modified by:   liutingxie
 * @Last Modified time: 2018-01-03 11:29:21
 */

class storm_currency {

	public static $count = null;

	// Return the count of found sliders
	public static function count() {
		return self::$count;
	}

	public static function limit() {
		// Get currency per page value
		$per_page = get_option('currency-screen-setting');
		if( empty($per_page['per_page']) || $per_page['per_page'] < 1 ) {
			$per_page['per_page'] = 20;
		}

		return $per_page['per_page'];
	}

	public static function getSymbol() {
		//Get currency default symbol
		$symbol = get_option('currency-screen-setting');
		if( empty($symbol['symbol']) ) {
			$symbol['symbol'] = 'usd';
		}

		return $symbol['symbol'];
	}

	public static function getId() {
		global $wpdb;

		$where = '';
		$order = '';

		if( isset($_GET['paged']) ){

			$paged  = esc_html($_GET['paged']);
			$order = "ORDER BY id ASC";
		}
		else
		{
			$paged = 1;
		}

		if( isset($_GET['search']) ){
			$search_tag = esc_html(stripslashes($_GET['search']));
		}
		else
		{
			$search_tag = '';
		}

		if( $search_tag ){
			$where = "WHERE name LIKE '%".$search_tag."%' ";
		}

		$per_page = self::limit();

		$limit = $per_page * $paged - $per_page;

		$currency = $wpdb->get_results("SELECT SQL_CALC_FOUND_ROWS * FROM ".$wpdb->prefix.CURRENCY_DB_TABLE." $where $order LIMIT $limit, $per_page", ARRAY_A);
	 	$found_count = $wpdb->get_col("SELECT FOUND_ROWS()");

	 	self::$count = (int) $found_count[0];

	  	return $currency;
	}

	public static function getCurrencyName($name) {
		if(empty($name))  return false;

		global $wpdb;

		$table_name = $wpdb->prefix . CURRENCY_DB_TABLE;

		//get currency
		if($name == 'ALL') {
			$currency = $wpdb->get_results("SELECT coinname, name FROM ". $table_name, ARRAY_A);
		}
		else {
			$currency = $wpdb->get_row($wpdb->prepare("SELECT coinname, name FROM ". $table_name ." WHERE name = '%s'", $name), ARRAY_A);
		}

		return $currency;

	}

	public static function getOrderByIndex($index) {
		if(empty($index))  return false;

		global $wpdb;

		$table_name = $wpdb->prefix . CURRENCY_DB_TABLE;

		$order = "ORDER BY id ASC";

		$maxnum = 60;
		//get currency
		$currency = $wpdb->get_results("SELECT SQL_CALC_FOUND_ROWS coinname, name FROM ".$wpdb->prefix.CURRENCY_DB_TABLE." $order LIMIT $index, $maxnum", ARRAY_A);

		return $currency;
	}

	public static function add($name){
		global $wpdb;

		$upload = wp_upload_dir();
		$currencyData = file_get_contents($upload['basedir'] . '/cryptocurrency-json.js');
		$currencyData = json_decode($currencyData, true);

		$coinName = $currencyData[strtoupper($name)];

		// Add
		$wpdb->insert($wpdb->prefix . CURRENCY_DB_TABLE, array(
			'coinname' => $coinName,
			'name' => $name,
			'date_create' => current_time('mysql'),
			'date_modified' => current_time('mysql')
		), array('%s', '%s', '%s', '%s'));

		return $wpdb->insert_id;

	}

	public static function remove($id){

		if(empty($id)) return false;

		global $wpdb;

		$table_name = $wpdb->prefix . CURRENCY_DB_TABLE;

		// Delete

		$wpdb->delete($table_name, array('id' => $id), array('%d'));

		return true;
	}

	public static function update($id, $name) {
		if(empty($id)) return false;

		global $wpdb;

		$table_name = $wpdb->prefix . CURRENCY_DB_TABLE;

		// Update
		$wpdb->update($table_name, array(
			'name' => $name,
			'date_modified' => current_time('mysql')
		), array('id' => $id), array('%s', '%s'));

		return true;
	}

	public static function deletePost($name) {
		if(empty($name)) return false;

		global $wpdb;

		$table_name = $wpdb->prefix . 'posts';

		//Delete post
		$wpdb->delete($table_name, array('post_title' => $name), array('%s'));

		return true;

	}

	public static function importCoin($name, $coinname) {
		global $wpdb;

		//check the coin name exists
		$wpdb->replace($wpdb->prefix . CURRENCY_DB_TABLE, array(
			'name' => $name,
			'coinname' => $coinname,
			'date_create' => current_time('mysql'),
			'date_modified' => current_time('mysql')
		), array('%s', '%s', '%s', '%s'));

		return $wpdb->insert_id;
	}


	public static function removeAll() {
		global $wpdb;
		$table_name = $wpdb->prefix . CURRENCY_DB_TABLE;
		$wpdb->query("TRUNCATE TABLE $table_name");

		$page = get_page_by_title( 'CryptoCurrency' );
		$args = array(
			'post_parent' => $page->ID,
			'post_type' => 'coins'
		);

		$posts = get_children( $args );

		// echo count($posts);
		if( is_array($posts) && count($posts ) > 0) {
			//Delete all the children of the parent coins
	        wp_defer_term_counting( true );
	        wp_defer_comment_counting( true );
	        $wpdb->query( 'SET autocommit = 0;' );

			foreach ( $posts as $post ) {
				wp_delete_post( $post->ID, true);
			}

			$wpdb->query( 'COMMIT;' );
	        wp_defer_term_counting( false );
	        wp_defer_comment_counting( false );
		}
	}
}