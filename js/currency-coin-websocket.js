/*
* @Author: liutingxie
* @Date:   2017-11-21 10:56:35
* @Last Modified by:   liutingxie
* @Last Modified time: 2017-12-31 10:52:13
*/
(function($) {
	$.fn.stormCurrencyCoin = function() {
		return this.each(function() {
			if($(this).data('coin-websocket')) {
				var currencycoin = $(this).data('coin-websocket');

				currencycoin.reset();
			}
			else {
				new currencyCoin(this);
			}
		});
	};

	var currencyCoin = function(el) {
		var $this = this;

		$(el).data('coin-websocket', $this);
		$this.url = 'https://streamer.cryptocompare.com/';
		$this.FromSymbol = $('#fsym').val();
		$this.ToSymbol = $('#tsym').val();
		$this.subscription = [];
		$this.socket = io($this.url);

		$this.reset = function() {
			$this.FromSymbol = $('#fsym').val();
			$this.ToSymbol = $('#tsym').val();
			$this.socket.emit('SubRemove', { subs: $this.subscription });
			$this.subscription = [];
			$this.getCurrenCurrency();
		};

		$this.getCurrenCurrency = function() {
			var FromSymbol = $this.FromSymbol.toUpperCase(),
				market = 'CCCAGG',
				tsym = $this.ToSymbol.toUpperCase();
			var sub = '5~' + market + '~' + FromSymbol + '~' + tsym;
			$this.subscription.push(sub);

			$this.socket.emit('SubAdd', { subs: $this.subscription });

			$this.socket.on('m', function(message) {
				var messageType = message.substring(0, message.indexOf('~')),
					res = {};

				if(messageType == CCC.STATIC.TYPE.CURRENTAGG) {
					res = CCC.CURRENT.unpack(message);
					if(res['PRICE']) {
						$this.displayPricemultifullData(res, CCC.STATIC.CURRENCY.getSymbol(res['TOSYMBOL']));
					}
				}
 			});


		};

		$this.displayPricemultifullData = function(data, symbol) {

			//Add class and remove class
			var $block = $('.currency-info .price');
			if($('meta[itemprop=PRICE]').attr('content') < data['PRICE']) {
				$block.addClass('highlight-up', 250).delay(1000).queue(function() {
					$(this).removeClass('highlight-up').dequeue();
				});
			}
			else if($('meta[itemprop=PRICE]').attr('content') == data['PRICE']) {
				$block.addClass('highlight-unchange', 250).delay(1000).queue(function() {
					$(this).removeClass('highlight-unchange').dequeue();
				});
			}
			else {
				$block.addClass('highlight-down', 250).delay(1000).queue(function() {
					$(this).removeClass('highlight-down').dequeue();
				});
			}
			// console.log(data['PRICE'], $(el).find('.supply').attr('data-supply'));
			var mktCap = data['PRICE'] * $(el).find('.supply').attr('data-supply');

			if(mktCap) {
				$(el).find($('.mktcap .currency-content')).text(CCC.convertValueToDisplay(symbol, mktCap));
			}

			$('meta[itemprop=PRICE]').attr('content', data['PRICE']);
			$(el).find($('.price .currency-content')).text(CCC.convertValueToDisplay(symbol, data['PRICE']));

			if(data['LASTMARKET']) {
				$(el).find('.market .currency-content').text(data['LASTMARKET']);
			}

			if(data['LASTUPDATE']) {
				var showDate = $this.showDateText(Math.round(new Date().getTime() / 1000), data['LASTUPDATE']);
				$(el).find('.lastupdate').attr('data-update', data['LASTUPDATE']);
				$(el).find('.update').text(showDate);

			}

			if(data['OPEN24HOUR']) {
				var change24hour = ((data['PRICE'] - data['OPEN24HOUR']) / data['OPEN24HOUR'] * 100).toFixed(2);
				$(el).find('.change24hour .currency-content').text(change24hour + '%');
			}


		};

		$this.showDateText = function(realTime, updateTime) {
			var showDate = '';
			var shortTime = (parseInt(realTime) - parseInt(updateTime)) / 60;

			if(shortTime >= 1 && shortTime < 60) {
				showDate = Math.floor(shortTime) + ' min ago';
			}
			else if(shortTime >= 60 && shortTime < 1440) {
				var hourTime = shortTime / 60;
				showDate = Math.floor(hourTime) + ' hour ago';
			}
			else if(shortTime >= 1440 && shortTime < 43200) {
				var dayTime = shortTime / 1440;
				showDate = Math.floor(dayTime) + ' day ago';
			}
			else {
				showDate = 'just now';
			}

			return showDate;
		};

		$this.getCurrenCurrency();
	};

})(jQuery);