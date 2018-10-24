/*
* @Author: liutingxie
* @Date:   2017-11-10 15:29:35
* @Last Modified by:   liutingxie
* @Last Modified time: 2017-12-28 14:35:30
*/

// (function($) {
// 	$.fn.stormCurrency = function(option) {
// 		return this.each(function() {
// 			new currency(this, option);
// 		});
// 	};

// 	var currency = function(el, option) {
// 		var $this = this;
// 			$this.url = 'https://streamer.cryptocompare.com/',
// 			$this.socket = io.connect($this.url);

// 		$this.getCurrenCurrency = function() {
// 			var subscription = [];

// 			$.each(option, function(index, val) {
// 				subscription.push(val);
// 			});


// 			$this.socket.emit('SubAdd', { subs: subscription });

// 			$this.socket.on('m', function(message) {
// 				var messageType = message.substring(0, message.indexOf('~'));
// 				var res = {};

// 				if(messageType == CCC.STATIC.TYPE.CURRENTAGG) {

// 					res = CCC.CURRENT.unpack(message);

// 					if(res['PRICE']) {
// 						$this.currencyUnpack(res);
// 					}
// 				}
//  			});
// 		};

// 		$this.currencyUnpack = function(data) {
// 			$this.displayCurrency(data, CCC.STATIC.CURRENCY.getSymbol(data['TOSYMBOL']));
// 		};

// 		$this.displayCurrency = function(data, tsym) {
// 			if(data['FROMSYMBOL'] == 'B@') {
// 				data['FROMSYMBOL'] = 'B-2';
// 			}
// 			if(data['PRICE'] > $('#id-' + data['FROMSYMBOL']).data('price')){
// 				$('#id-' + data['FROMSYMBOL']).addClass('highlight-up').delay(1000).queue(function() {
// 					$(this).removeClass('highlight-up').dequeue();
// 				});
// 			}
// 			else if(data['PRICE'] < $('#id-' + data['FROMSYMBOL']).data('price')) {
// 				$('#id-' + data['FROMSYMBOL']).addClass('highlight-down').delay(1000).queue(function() {
// 					$(this).removeClass('highlight-down').dequeue();
// 				});
// 			}
// 			else {
// 				$('#id-' + data['FROMSYMBOL']).addClass('highlight-unchange').delay(1000).queue(function() {
// 					$(this).removeClass('highlight-unchange').dequeue();
// 				});
// 			}

// 			var change24hour = ((data['PRICE'] - data['OPEN24HOUR']) / data['OPEN24HOUR'] * 100).toFixed(2);
// 			var change1hour = ((data['PRICE'] - data['OPENHOUR']) / data['OPENHOUR'] * 100).toFixed(2);

// 			$('#id-' + data['FROMSYMBOL']).data('price', data['PRICE']);
// 			$('#id-' + data['FROMSYMBOL'] + ' .price').text(CCC.convertValueToDisplay(tsym, data['PRICE']));
// 			if(data['VOLUME24HOUR']) {
// 				$('#id-' + data['FROMSYMBOL'] + ' .totalvolume24h').text(CCC.convertValueToDisplay(tsym, data['VOLUME24HOUR']));
// 			}
// 			if(data['LASTUPDATE']) {
// 				$('#id-' + data['FROMSYMBOL'] + ' .lastupdate').attr('data-update', data['LASTUPDATE']);
// 				$('#id-' + data['FROMSYMBOL'] + ' .update').text('just now');
// 			}
// 			$('#id-' + data['FROMSYMBOL'] + ' .market').text(data['LASTMARKET']);

// 			if(!isNaN(change24hour)) {
// 				var change24hourClass = change24hour == 0.00 ? 'unchange' : change24hour < 0 ? 'down' : 'up';
// 				$('#id-' + data['FROMSYMBOL'] + ' .24hour').addClass(change24hourClass);
// 				$('#id-' + data['FROMSYMBOL'] + ' .change24hour').text(change24hour + '%');
// 			}

// 			if(!isNaN(change1hour)) {
// 				var change1hourClass = change1hour == 0.00 ? 'unchange' : change1hour < 0 ? 'down' : 'up';
// 				$('#id-' + data['FROMSYMBOL'] + ' .1hour').addClass(change1hourClass);
// 				$('#id-' + data['FROMSYMBOL'] + ' .change1hour').text(change1hour + '%');
// 			}

// 		};

// 		$this.getCurrenCurrency();
// 	};

// })(jQuery);