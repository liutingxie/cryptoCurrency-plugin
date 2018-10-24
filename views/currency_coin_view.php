<?php

/**
 * @Author: liutingxie
 * @Date:   2017-11-14 10:02:23
 * @Last Modified by:   liutingxie
 * @Last Modified time: 2018-01-18 09:15:13
 */

class storm_shortcode_currency_coin {
	public static function registert_currency_coin() {
		if(!shortcode_exists( 'storm_currency_coin' )) {
			add_shortcode('storm_currency_coin', array(__CLASS__, 'storm_register_currency_coin'));
		}
	}

	public static function storm_register_currency_coin($atts){
		if(isset($atts['currency'])) {
			ob_start();
	    	self::display($atts['currency']);
	    	return ob_get_clean();
		}

	}

	public static function display($name){

		$currencyData = storm_currency::getCurrencyName($name);
		$fsym = strtoupper($currencyData['name']);
		$tsym = storm_currency::getSymbol();

		?>

		<div class="storm-currency storm-currency-coin storm-currency-<?php echo $fsym; ?>">
			<div class="currency-data" display="none">
				<meta itemprop="PRICE" content="">
				<input type="hidden" name="fsym" id="fsym" value="<?php echo $fsym; ?>">
				<input type="hidden" name="tsym" id="tsym" value="<?php echo $tsym; ?>">
			</div>
			<div class="currency-menu clearfix">
				<div class="currency-name float-left">
					<h1>
						<div><?php echo $currencyData['coinname']; ?></div>
						<div class="currency-coinpage-name"><?php echo strtoupper($tsym); ?></div>
					</h1>
				</div>
				<div class="currency-symbol-menu float-right">
					<button type="button" class="coin-tsym btn btn-primary btn-block"><?php echo strtoupper($tsym); ?>
						<span class="currency-caret"></span>
					</button>
					<div class="currency-symbol-container">
						<ul class="currency-symbol-list"></ul>
					</div>
				</div>
			</div>
			<div class="currency-info row clearfix">
				<div class="col-xs-6 col-sm-4 col-md-3 col-min-1">
					<div class="block price">
						<div class="currency-label"><?php _e('Price', 'StormCurrency'); ?></div>
						<div class="currency-content"></div>
					</div>
				</div>
				<div class="col-xs-6 col-sm-4 col-md-3 col-min-1">
					<div class="block mktcap">
						<div class="currency-label"><?php _e('Mkt.Cap', 'StormCurrency'); ?></div>
						<div class="currency-content"></div>
					</div>
				</div>
				<div class="col-xs-6 col-sm-4 col-md-3 col-min-1">
					<div class="block supply">
						<div class="currency-label"><?php _e('Supply', 'StormCurrency'); ?></div>
						<div class="currency-content"></div>
					</div>
				</div>
				<div class="col-xs-6 col-sm-4 col-md-3 col-min-1">
					<div class="block volume24hourto">
						<div class="currency-label"><?php _e('Volume 24h Coin', 'StormCurrency'); ?></div>
						<div class="currency-content"></div>
					</div>
				</div>
				<div class="col-xs-6 col-sm-4 col-md-3 col-min-1">
					<div class="block volume24hour">
						<div class="currency-label"><?php _e('Volume 24h', 'StormCurrency'); ?></div>
						<div class="currency-content"></div>
					</div>
				</div>
				<div class="col-xs-6 col-sm-4 col-md-3 col-min-1">
					<div class="block market">
						<div class="currency-label"><?php _e('Last Market', 'StormCurrency'); ?></div>
						<div class="currency-content"></div>
					</div>
				</div>
				<div class="col-xs-6 col-sm-4 col-md-3 col-min-1">
					<div class="block lastupdate">
						<div class="currency-label"><?php _e('Last Update', 'StormCurrency'); ?></div>
						<div class="currency-content update"></div>
					</div>
				</div>
				<div class="col-xs-6 col-sm-4 col-md-3 col-min-1">
					<div class="block change24hour">
						<div class="currency-label"><?php _e('%24h', 'StormCurrency'); ?></div>
						<div class="currency-content"></div>
					</div>
				</div>
			</div>
			<div class="currency-chart">
				<h2><?php _e('Chart', 'StormCurrency'); ?></h2>
				<div class="currency-chart-menu">
					<div class="hidden-xs-chart-menu">
						<a class="menu-item"><?php _e('1 Hour', 'StormCurrency'); ?></a><a class="menu-item selected"><?php _e('1 Day', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('1 Week', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('1 Month', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('3 Months', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('6 Months', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('1 Year', 'StormCurrency'); ?></a>
					</div>
					<div class="show-xs-chart-menu">
						<a class="menu-item"><?php _e('1 H', 'StormCurrency'); ?></a><a class="menu-item selected"><?php _e('1 D', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('1 W', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('1 M', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('3 M', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('6 M', 'StormCurrency'); ?></a><a class="menu-item"><?php _e('1 Y', 'StormCurrency'); ?></a>
					</div>

				</div>
				<div class="currency-chart-view">
					<svg></svg>
					<div class="currency-tooltip"></div>
				</div>
			</div>
		</div>
		<div class="currency-loader-chart-container">
			<div class="currency-loading"></div>
			<div class="currency-overlay"></div>
		</div>
		<?php
	}
}

storm_shortcode_currency_coin::registert_currency_coin();
