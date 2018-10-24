<?php

/**
 * @Author: liutingxie
 * @Date:   2017-11-10 16:06:41
 * @Last Modified by:   liutingxie
 * @Last Modified time: 2018-01-18 10:38:32
 */



function storm_currency() {
  echo storm_currency_view::display();
}

class storm_currency_view {

	public static function registerShortcode() {

		if(!shortcode_exists('storm_currency')) {
		  add_shortcode('storm_currency', array(__CLASS__, 'stormCurrency_shortcode'));
		}

	}

	public static function stormCurrency_shortcode($atts){

		if(isset($atts['currency'])) {
			ob_start();
	    	self::display($atts['currency']);
	    	return ob_get_clean();
		}

	}

	public static function display($name){
		$uid = uniqid('stormCurrency');

		$fsymnum = storm_currency::limit();

		$tsym = storm_currency::getSymbol();


		$url = get_site_url();
		?>

		<script type="text/javascript"> var stormjQuery = jQuery; </script>
		<script type="text/javascript">
			stormjQuery(document).ready(function() {
				window.currencyUrl = '<?php echo $url; ?>';
			});
		</script>
		<script type="text/template" id="currency-load-coin-template">
			<tr role="row">
				<td>
					<div class="currency-icon"></div>
				</td>
				<td class="fullname">
					<div class="half-height coinname"></div>
					<div class="half-height half-style name"></div>
				</td>
				<td class="price align-centet"></td>
				<!-- <td class="mktcap"></td> -->
				<td class="totalvolume24h hidden-xs-down">
					<div class="half-height volume24hour"></div>
					<div class="half-height volume24hourto"></div>
				</td>
				<td class="lastupdate hidden-lg-down">
					<div class="half-height update"></div>
					<div class="half-height half-style market"></div>
				</td>
				<td class="percent hidden-min-down">
					<i class="dashicons circle-icon 1hour"></i>
					<span class="change1hour"></span>
				</td>
				<td class="percent hidden-sm-down">
					<i class="dashicons circle-icon 24hour"></i>
					<span class="change24hour"></span>
				</td>
			</tr>
		</script>
		<div class="storm-currency currency_container table-responsive" id="stormCurrency" data-currencyuid="<?php echo $uid; ?>">
			<div class="currency-list-data" display="none">
				<input type="hidden" id="fsymnum" value="<?php echo $fsymnum; ?>">
				<input type="hidden" id="tsym" value="<?php echo $tsym; ?>">
			</div>
			<div class="segment">
				<div class="currency-search-container row">
					<div class="search-button-container input-group input-group-lg col-md-9 col-sm-12">
						<input type="text" class="coin-search" placeholder="<?php _e('Search Currencies', 'StormCurrency');?>">
						<div class="currency-search-coin-list" rel="search"></div>

					</div>
					<div class="currency-clear-coin-list col-md-3 col-sm-12">
						<button type="button" class="btn btn-primary btn-lg btn-block"><?php _e('Clear', 'StormCurrency'); ?></button>
					</div>
				</div>

				<div class="notified text-info">
					<span class="dashicons info"></span><?php _e('Only showing currency pairs that have traded at least once in the last 7 days.', 'StormCurrency'); ?>
				</div>
			</div>
 		 	<nav class="coinslist navbar navbar-expand-md navbar-light bg-light" role="navigation">
 		 		<a class="navbar-brand h1">Coins</a>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				    <span class="navbar-toggler-icon"></span>
				 </button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav">
						<li class="nav-item btclist" data-tsym="btc">
					    	<a href="#/btc" class="nav-link"><?php _e('BTC Toplist', 'StormCurrency'); ?></a>
					  	</li>
					  	<li class="nav-item usdlist" data-tsym="usd">
					    	<a href="#/usd" class="nav-link active"><?php _e('USD Toplist', 'StormCurrency'); ?></a>
					  	</li>
					  	<li class="nav-item ethlist" data-tsym="eth">
					    	<a href="#/eth" class="nav-link"><?php _e('ETH Toplist', 'StormCurrency'); ?></a>
					  	</li>
					  	<li class="nav-item eurlist" data-tsym="eur">
					    	<a href="#/eur" class="nav-link"><?php _e('EUR Toplist', 'StormCurrency'); ?></a>
					  	</li>
					  	<li class="nav-item jpylist" data-tsym="jpy">
					    	<a href="#/jpy" class="nav-link"><?php _e('JPY Toplist', 'StormCurrency'); ?></a>
					  	</li>
					  	<li class="nav-item krwlist" data-tsym="krw">
					    	<a href="#/krw" class="nav-link"><?php _e('KRW Toplist', 'StormCurrency'); ?></a>
					  	</li>
					</ul>
				</div>
			</nav>
			<table class="currency_table table table-hover table-bordered">
				<thead>
					<tr>
						<!-- <th>#</th> -->
						<th class="align-left" colspan="2"><?php _e('Name', 'StormSlider'); ?><i class="dashicons"></i></th>
						<th class="align-centet"><?php _e('Price', 'StormSlider'); ?><i class="dashicons"></i></th>
						<!-- <th><?php _e('Market Cap', 'StormSlider'); ?></th> -->
						<th class="align-right order hidden-xs-down"><?php _e('Volumn 24h', 'StormSlider'); ?><i class="dashicons arrow-down"></i></th>
						<th class="align-right hidden-lg-down"><?php _e('Last Trade', 'StormSlider'); ?><i class="dashicons"></i></th>
						<th class="align-centet hidden-min-down"><?php _e('%1h', 'StormSlider'); ?><i class="dashicons"></i></th>
						<th class="align-centet hidden-sm-down"><?php _e('%24h', 'StormSlider'); ?><i class="dashicons"></i></th>
						<!-- <th><?php _e('%7d', 'StormSlider'); ?></th> -->
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
			<div class="currency-loader-container">
				<div class="currency-loading"></div>
				<div class="currency-overlay"></div>
			</div>
		</div>
		<?php
	}
}

storm_currency_view::registerShortcode();
