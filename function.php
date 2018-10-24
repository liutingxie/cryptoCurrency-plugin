<?php

/**
 * Plugin Name: Crypto Currency
 * Description: Create cypto currency
 * Version: 1.0
 * Author: storm
 */

define( 'CURRENCY_DB_TABLE', 'cryptocurrency');
define( 'CURRENCY_DIR', plugin_dir_path( __FILE__ ) );
require_once( CURRENCY_DIR . '/db/currency_db.php' );
// require_once( CURRENCY_DIR . '/currency-multi-combine.php' );
require_once( CURRENCY_DIR . '/curl/currency_curl.php' );
// require_once( CURRENCY_DIR . '/curl/currency-multi-curl.php' );
require_once( CURRENCY_DIR . '/ajax/ajax_currency.php' );
require_once( CURRENCY_DIR . '/views/currency_front_view.php' );
require_once( CURRENCY_DIR . '/views/currency_coin_view.php' );
require_once( CURRENCY_DIR . '/template-page.php');

function custom_post_type() {

// Set UI labels for Custom Post Type
    $labels = array(
      'name'                => _x( 'Coins', 'Post Type General Name', 'StormCurrency' ),
        'singular_name'       => _x( 'Coin', 'Post Type Singular Name', 'StormCurrency' ),
        'menu_name'           => __( 'Coins', 'StormCurrency' ),
        'parent_item_colon'   => __( 'Parent Coin', 'StormCurrency' ),
        'all_items'           => __( 'All Coins', 'StormCurrency' ),
        'view_item'           => __( 'View Coin', 'StormCurrency' ),
        'add_new_item'        => __( 'Add New Coin', 'StormCurrency' ),
        'add_new'             => __( 'Add New', 'StormCurrency' ),
        'edit_item'           => __( 'Edit Coin', 'StormCurrency' ),
        'update_item'         => __( 'Update Coin', 'StormCurrency' ),
        'search_items'        => __( 'Search Coin', 'StormCurrency' ),
        'not_found'           => __( 'Not Found', 'StormCurrency' ),
        'not_found_in_trash'  => __( 'Not found in Trash', 'StormCurrency' ),
    );

// Set other options for Custom Post Type

    $args = array(
        'label'               => __( 'coins', 'StormCurrency' ),
        'description'         => __( 'Coin news and reviews', 'StormCurrency' ),
        'labels'              => $labels,
        // Features this CPT supports in Post Editor
        'supports'            => array( 'title', 'editor'),
        // You can associate this CPT with a taxonomy or custom taxonomy.
        'taxonomies'          => array( 'genres' ),
        /* A hierarchical CPT is like Pages and can have
        * Parent and child items. A non-hierarchical CPT
        * is like Posts.
        */
        'hierarchical'        => false,
        'public'              => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_nav_menus'   => true,
        'show_in_admin_bar'   => true,
        'menu_position'       => 5,
        'can_export'          => true,
        'has_archive'         => true,
        'exclude_from_search' => false,
        'publicly_queryable'  => true,
        'capability_type'     => 'page',
    );

    // Registering your Custom Post Type
    register_post_type( 'coins', $args );

}

/* Hook into the 'init' action so that the function
* Containing our post type registration is not
* unnecessarily executed.
*/

add_action( 'init', 'custom_post_type', 0 );

function cryptoCurrency() {
    add_menu_page( 'Crypto Currency', 'CryptoCurrency', 'delete_pages', 'cryptocurrency', 'cryptocurrency_router', plugins_url('image/currency-icon.png', __FILE__) );
}

add_action( 'admin_menu', 'cryptoCurrency' );


function cryptocurrency_router() {

  $screen = get_current_screen();

  if( strpos( $screen->base, 'cryptocurrency' ) !== false ) {
    require_once( CURRENCY_DIR . '/views/currency_list.php' );
  }

}

add_action('admin_enqueue_scripts', 'add_currency_scripts');

function add_currency_scripts() {

    $screen = get_current_screen();

    if( strpos($screen->base, 'cryptocurrency') !== false ) {

        wp_enqueue_script( 'jquery' );
        wp_enqueue_style( 'currency-css', plugins_url('css/currency.css', __FILE__) );
        wp_enqueue_script( 'currency-js', plugins_url('js/currency-backed.js', __FILE__) );

    }
}

add_action('wp_head', 'myplugin_ajaxurl');

function myplugin_ajaxurl() {

   echo '<script type="text/javascript">
           var ajaxurl = "' . admin_url('admin-ajax.php') . '";
         </script>';
}

add_action( 'wp_enqueue_scripts', 'currency_wp_enqueue_scripts' );

function currency_wp_enqueue_scripts() {
    wp_enqueue_style( 'dashicons' );

    wp_register_script( 'websocket-io', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js' );
    wp_enqueue_script( 'websocket-io' );
    wp_register_script( 'd3-chart', 'https://cdnjs.cloudflare.com/ajax/libs/d3/4.11.0/d3.min.js' );
    wp_enqueue_script( 'd3-chart' );
    wp_enqueue_script( 'ccc-streamer-utilities', plugins_url('js/ccc-streamer-utilities.js', __FILE__) );
    // wp_enqueue_script( 'currency-websocket', plugins_url('js/currency_websocket.js', __FILE__), array('jquery') );
    wp_enqueue_script( 'bootstrap-util', plugins_url('js/util.js', __FILE__), array('jquery') );
    wp_enqueue_script( 'bootstrap-collapse', plugins_url('js/collapse.js', __FILE__), array('jquery') );
    wp_enqueue_script( 'currency-coin-chart', plugins_url('js/currency-chart.js', __FILE__), array('jquery') );
    wp_enqueue_script( 'currency-front', plugins_url('js/currency-front.js', __FILE__), array('jquery') );
    wp_enqueue_script( 'currency-coin-websocket', plugins_url('js/currency-coin-websocket.js', __FILE__), array('jquery') );
    wp_enqueue_style( 'storm-bootstrap', plugins_url('css/bootstrap.min.css', __FILE__) );
    wp_enqueue_style( 'currency-front-css', plugins_url('css/currency_front.css', __FILE__) );
    wp_enqueue_style( 'currency-sprite', plugins_url('css/sprite.css', __FILE__) );

}

add_action( 'init', 'register_currency_form_action' );

function register_currency_form_action() {

    if( isset( $_POST['currency_add_validated'] ) ) {
        if( current_user_can( 'delete_plugins' ) ) {

          $name = $_POST['currency_add_text'];
          $naem = strtoupper( $name );
          $id = storm_currency::add( $name );
          $page = get_page_by_title( 'CryptoCurrency' );

          if($id) {
            storm_currency_create_page( $name, $page->ID );

          }

          header( 'Location: admin.php?page=cryptocurrency' );

          die();

        }
    }

    if(isset($_GET['page']) && $_GET['page'] == 'cryptocurrency' && isset($_GET['action']) && $_GET['action'] == 'remove') {

        if(isset($_GET['id']))
            $id = $_GET['id'];

        if(isset($_GET['name']))
            $name = $_GET['name'];

        storm_currency::remove($id);

        storm_currency::deletePost($name);

        header('Location: admin.php?page=cryptocurrency');

        die();
    }

    //Import all cryptocurrency data
    if( isset( $_POST['currency-import-validated'] ) ) {
        if( current_user_can( 'delete_plugins' ) ) {
            $dir = wp_upload_dir();
            $json_name = $dir['basedir'] . '/cryptocurrency-json.js';
            $data = file_get_contents( $json_name );
            storm_import_data( json_decode( $data, true ) );
        }
        else {
            _e( 'You do not have enough permission to import sliders', 'StormSlider' );
        }
    }

    //Remove all cryptocurrency data
    if( isset( $_POST['currency-remove-validated'] ) )  {
      if( current_user_can( 'delete_plugins' ) ) {
        storm_currency::removeAll();
      }
    }
}

//Remove unique post name, the permalink will not have -2 etc.
add_filter( "wp_unique_post_slug", "url_sanitizer", 10, 6 );
function url_sanitizer( $slug, $post_ID, $post_status, $post_type, $post_parent, $original_slug ) {
    // get original title by $post_ID if needed eg. get_the_title($post_ID)
    if( $post_type == "coins" ) {
        $slug = $original_slug;
    }

    return $slug;
}

function storm_currency_create_page($name, $parent_id) {
    $new_post = array();
    $new_post['post_title'] = $name;
    $new_post['post_name'] = $name;
    $new_post['post_type'] = 'coins';
    $new_post['post_parent'] = $parent_id;
    $new_post['post_content'] = '[storm_currency_coin currency="' . $name . '"]';
    $new_post['post_status'] = 'publish';
    $new_post['page_template'] = 'full-width.php';

     $new_page_id = wp_insert_post( $new_post );

    if ( $new_page_id && ! is_wp_error( $new_page_id ) ){
        update_post_meta( $new_page_id, '_wp_page_template', 'full-width.php' );
    }

    update_option( 'mytheme_installed', true );
}


add_filter('contextual_help', 'currency_contextual_help', 10, 3);

function currency_contextual_help($contextual_help, $screen_id, $screen) {
    if(strpos($screen->base, 'cryptocurrency') !== false) {
      $screen->add_help_tab(array(
        'id' => 'help',
        'title' => 'content Help',
        'content' => '<p>Please read our  <a href="https://support.liutingxie.com/dcumentation.html" target="_blank">Online Documentation</a> carefully, it will likely answer all of your questions.</p><p>You can also check the <a href="https://support.liutingxie.com/" target="_blank">FAQs</a> for additional information, including our support policies and licensing rules.</p>'
      ));
    }
}

register_activation_hook(__FILE__, 'currency_active');

function currency_active() {

    global $wpdb;

    if( !empty($wpdb->charset) ) {
        $charset_collaet = "DEFAULT CHARACTER SET {$wpdb->charset}";
    }
    if( !empty($wpdb->collet) ) {
        $charset_collaet .= "COLLATE {$wpdb->collet}";
    }

    $table_name = $wpdb->prefix . CURRENCY_DB_TABLE;

    $currency = "CREATE TABLE IF NOT EXISTS $table_name (
        id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
        coinname char(50) NOT NULL,
        name char(50) NOT Null,
        date_create datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        date_modified datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (id)
    ) $charset_collaet";

    $wpdb->query($currency);
    active_json();

    $page = get_page_by_title( 'CryptoCurrency' );
    if(!$page->ID) {
      create_currency_parent_page();
    }
}

function active_json() {
    $jsondata = file_get_contents( 'https://www.cryptocompare.com/api/data/coinlist/' );

    $data = json_decode($jsondata, true);

    foreach ($data['Data'] as $key => $value) {
        $file[$key] = $value['CoinName'];
    }

    $dir = wp_upload_dir();
    $json_name = $dir['basedir'] . '/cryptocurrency-json.js';
    file_put_contents($json_name, json_encode($file));
}



function create_currency_parent_page() {
  $args = array();
  $args['post_title'] = 'CryptoCurrency';
  $args['post_name'] = 'CryptoCurrency';
  $args['page_template'] = 'full-width.php';
  $args['post_type'] = 'page';
  $args['post_content'] = '[storm_currency currency="all"]';
  $args['post_status'] = 'publish';

  $info = wp_insert_post( $args );
  return $info;
}

