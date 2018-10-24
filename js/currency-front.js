/*
* @Author: liutingxie
* @Date:   2017-12-03 09:09:30
* @Last Modified by:   liutingxie
* @Last Modified time: 2018-02-02 10:44:47
*/

jQuery(document).ready(function($) {
	$('.navbar-togglere').collapse('show');

	$(document).on('click', '#stormCurrency tbody tr', function(e) {
		var name = $(this).find('.name').text();
		window.location.href = window.currencyUrl + '/coins/' + name.toLowerCase();
	});

	var fsymnum = $('#fsymnum').val(),
		tsym = $('#tsym').val();

	var $template = $('#currency-load-coin-template').text();

	var viewStepSize = fsymnum,
    	currentViewSize = viewStepSize,
		socketData = [],
		searchNameData = {};

	var coinsData = {
		btc: {
			toplistcoin: null,
			hash: null
		},
		usd: {
			toplistcoin: null,
			hash: null
		},
		eth: {
			toplistcoin: null,
			hash: null
		},
		eur: {
			toplistcoin: null,
			hash: null
		},
		jpy: {
			toplistcoin: null,
			hash: null
		},
		krw: {
			toplistcoin: null,
			hash: null
		}
	};

	var debounce = function(func, wait, immediate) {
	  	var timeout, args, context, timestamp, result;

	  	var later = function() {
	    	// 据上一次触发时间间隔
	    	var last = new Date().getTime() - timestamp;

	    	// 上次被包装函数被调用时间间隔last小于设定时间间隔wait
	    	if (last < wait && last > 0) {
	      		timeout = setTimeout(later, wait - last);
	    	} else {
	      		timeout = null;
	      		// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
	      		if (!immediate) {
	        		result = func.apply(context, args);
	        		if (!timeout) context = args = null;
	      		}
	    	}
	  	};

	  	return function() {
	    	context = this;
	    	args = arguments;
	    	timestamp = new Date().getTime();
	    	var callNow = immediate && !timeout;
	    	// 如果延时不存在，重新设定延时
	    	if (!timeout) timeout = setTimeout(later, wait);
	    	if (callNow) {
	      		result = func.apply(context, args);
	      		context = args = null;
	    	}

	    	return result;
	  	};
	};

	function getUrl(tsym) {
		// if(coinsData.tsym) {
		// 	showData()
		// }

		$.ajax({
			url: ajaxurl,
			type: 'post',
			dataType: 'json',
			data: { action: 'loadcoinlist', limit: 'ALL', symbol: tsym.toLowerCase() },
			success: function(data){
				showData(data);
				$('#stormCurrency').stormCurrency(socketData);

			},
			complete: function() {
				// $('#fsymnum').val(parseInt(fsym) + 30);
				$('.currency-loader-container').remove();
			},
			error: function(errorThrown){
				console.log('errorThrown');
			}
	   });

	};

	function showData(data) {
		if($('#stormCurrency .currency_table tbody').find('tr').length > 0) {
			$('#stormCurrency .currency_table tbody').empty();
			socketData = [];
		}

		var symbol = CCC.STATIC.CURRENCY.getSymbol(tsym.toUpperCase());
		// var fsymSymbol = CCC.STATIC.CURRENCY.getSymbol(fsym.toUpperCase());

		var availableArr = [],
			hashArr = [],
			len = 0,
			availableLen = 0;

        // var searchNameData = data['commomcoin'];

		for ( var i = 0, length = data['toplistcoin'].length; i < length; i++ ) {

            var objectToStream = CCC.CURRENT.unpack(data['toplistcoin'][i]);
            var currentKey = CCC.CURRENT.getKey(objectToStream);

            if( data['commomcoin'].hasOwnProperty( objectToStream['FROMSYMBOL'] ) ) {
            	searchNameData[objectToStream['FROMSYMBOL']] = data['commomcoin'][objectToStream['FROMSYMBOL']];
            	objectToStream['COINNAME'] = data['commomcoin'][objectToStream['FROMSYMBOL']];
            	availableArr[objectToStream['FROMSYMBOL']] = objectToStream;
            	hashArr.push(objectToStream['FROMSYMBOL']);
            	socketData.push(currentKey);
            	availableLen++;


            }

        }
        coinsData[tsym].toplistcoin = availableArr;
        coinsData[tsym].hash = hashArr;

        //coinsData[tsym].hash first key is 1
        for (var i = 0, j = coinsData[tsym].hash.length; i < j; i++) {
        	var data = coinsData[tsym].toplistcoin[coinsData[tsym].hash[i]];

			if(data['LASTUPDATE'] >= Math.round(new Date().getTime() / 1000) - 604800) {
				len++;
				var $tr = $($template).appendTo($('#stormCurrency .currency_table tbody'));
				// if(element == 'B@') {
				// 	element = 'B-2';
				// }
				var showDate = showDateText(Math.round(new Date().getTime() / 1000), data['LASTUPDATE']);
				$tr.find('.lastupdate').attr('data-update', data['LASTUPDATE']);

				var CHANGEPCT1HOUR = ((data['PRICE'] - data['OPENHOUR']) / data['OPENHOUR'] * 100).toFixed(2);
				var CHANGEPCT24HOUR = ((data['PRICE'] - data['OPEN24HOUR']) / data['OPEN24HOUR'] * 100).toFixed(2);
				var change1hourClass = CHANGEPCT1HOUR == 0.00 ? 'unchange' : CHANGEPCT1HOUR < 0 ? 'down' : 'up';
				var change24hourClass = CHANGEPCT24HOUR == 0.00 ? 'unchange' : CHANGEPCT24HOUR < 0 ? 'down' : 'up';

				$tr.attr('id', 'id-' + data['FROMSYMBOL']);
				$tr.find('.currency-icon').addClass('icon-' + data['FROMSYMBOL'].toLowerCase());
				$tr.find('.coinname').text(data['COINNAME']);
				$tr.find('.name').text(data['FROMSYMBOL']);
				$tr.find('.price').text(CCC.convertValueToDisplay(symbol, data['PRICE']));
				// $tr.find('.mktcap').text(index[tsym]['MKTCAP']);
				$tr.find('.totalvolume24h').find('.volume24hour').text(CCC.convertValueToDisplay(data['FROMSYMBOL'], data['VOLUME24HOUR']));
				$tr.find('.totalvolume24h').find('.volume24hourto').text(CCC.convertValueToDisplay(symbol, data['VOLUME24HOURTO']));
				$tr.find('.update').text(showDate);
				$tr.find('.market').text(data['LASTMARKET']);
				$tr.find('.1hour').addClass(change1hourClass);
				$tr.find('.change1hour').addClass(change1hourClass).text(CHANGEPCT1HOUR + '%');
				$tr.find('.24hour').addClass(change24hourClass);
				$tr.find('.change24hour').addClass(change24hourClass).text(CHANGEPCT24HOUR + '%');

			}

			if(len >= viewStepSize) {
				return false;
			}
        }
	}

	if($('#fsymnum').val()) {
		getUrl(tsym);
	}

	function loadCoin() {

		if(!coinsData[tsym]) return false;
		var len = 0;
		var symbol = CCC.STATIC.CURRENCY.getSymbol(tsym.toUpperCase());
		// var fsymSymbol = CCC.STATIC.CURRENCY.getSymbol(fsym.toUpperCase());

		for (var i = currentViewSize, j = coinsData[tsym].hash.length; i < j; i++) {

			var data = coinsData[tsym].toplistcoin[coinsData[tsym].hash[i]];
			if(data['LASTUPDATE'] >= Math.round(new Date().getTime() / 1000) - 604800) {
				len++;
				var $tr = $($template).appendTo($('#stormCurrency .currency_table tbody'));
				// if(element == 'B@') {
				// 	element = 'B-2';
				// }
				//
				var showDate = showDateText(Math.round(new Date().getTime() / 1000), data['LASTUPDATE']);
				$tr.find('.lastupdate').attr('data-update', data['LASTUPDATE']);

				var CHANGEPCT1HOUR = ((data['PRICE'] - data['OPENHOUR']) / data['OPENHOUR'] * 100).toFixed(2);
				var CHANGEPCT24HOUR = ((data['PRICE'] - data['OPEN24HOUR']) / data['OPEN24HOUR'] * 100).toFixed(2);
				var change1hourClass = CHANGEPCT1HOUR == 0.00 ? 'unchange' : CHANGEPCT1HOUR < 0 ? 'down' : 'up';
				var change24hourClass = CHANGEPCT24HOUR == 0.00 ? 'unchange' : CHANGEPCT24HOUR < 0 ? 'down' : 'up';

				$tr.attr('id', 'id-' + data['FROMSYMBOL']);
				$tr.find('.currency-icon').addClass('icon-' + data['FROMSYMBOL'].toLowerCase());
				$tr.find('.coinname').text(data['COINNAME']);
				$tr.find('.name').text(data['FROMSYMBOL']);
				$tr.find('.price').text(CCC.convertValueToDisplay(symbol, data['PRICE']));
				// $tr.find('.mktcap').text(index[tsym]['MKTCAP']);
				$tr.find('.totalvolume24h').find('.volume24hour').text(CCC.convertValueToDisplay(data['FROMSYMBOL'], data['VOLUME24HOUR']));
				$tr.find('.totalvolume24h').find('.volume24hourto').text(CCC.convertValueToDisplay(symbol, data['VOLUME24HOURTO']));
				$tr.find('.update').text(showDate);
				$tr.find('.market').text(data['LASTMARKET']);
				$tr.find('.1hour').addClass(change1hourClass);
				$tr.find('.change1hour').addClass(change1hourClass).html(CHANGEPCT1HOUR + '%');
				$tr.find('.24hour').addClass(change24hourClass);
				$tr.find('.change24hour').addClass(change24hourClass).html(CHANGEPCT24HOUR + '%');
			}

			//load coin when scroll, set currentViewSize
			if( len == viewStepSize ) {
				currentViewSize = parseInt(viewStepSize) + parseInt(currentViewSize);

				return false;
			}
		}

	}


	var lazyCoin = debounce(loadCoin, 100);

	$(window).scroll(function(){

		if ( $(window).scrollTop() >= ($(document).height() - $(window).height()) - ($(document).height() - $(window).height()) * 0.4 ){

			if($('#fsymnum').val()) {
				lazyCoin();
			}
		}
	});

	function showDateText(realTime, updateTime) {
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
	}

	setInterval(function() {
		var realTime = Math.round(new Date().getTime() / 1000);

		$('.lastupdate').each(function(index, val) {
			var updateTime = $(val).attr('data-update');

			var showDate = showDateText(realTime, updateTime);
			$(this).find('.update').text(showDate);
		});

	}, 60000);

	$('.currency-search-container .coin-search').on('keyup change click', function(e) {
		var search = $(this).val();

		search == '' && $('.currency-search-coin-list').slideUp('fast').empty();
		var selected = $('.currency-search-coin-list');
		$(selected).show();

		$('.result-value').length >= 0 && $('.currency-search-coin-list').empty();

		$.each(searchNameData, function(index, val) {

			if(index.indexOf(search.toUpperCase()) !== -1 || val.indexOf(search) !== -1) {
			 	$('<div class="result-value">').text(val).appendTo($(selected)).on('click', function() {
					window.location.href = window.currencyUrl + '/coins/' + index.toLowerCase();
			 	});
			}

		});

		$('.result-value').length == 0 && $('<div class="result-value result-message">No results found.</>').appendTo($(selected));
 	});

	//Hide search result list
	$(document).on('click', function(e) {
		 if(!$(e.target).is('.coin-search, .currency-search-coin-list')) {
			$('.currency-search-coin-list').slideUp('fast').empty();
			$('.coin-search').val('');
		}
	});

	//Clear search result list and delete input text
	$('.currency-clear-coin-list').on('click', function() {
		$('.currency-search-coin-list').slideUp('fast').empty();
		$('.coin-search').val('');
	});

	//Use ajax to get data for list button
	$('.coinslist .nav-item').on('click', function() {
		$(this).siblings().find('.active').removeClass('active');
		$(this).children().addClass('active');
		tsym = $(this).attr('data-tsym');
		$('#tsym').val(tsym);
		getUrl(tsym);
		$('#stormCurrency').stormCurrency('disconnect');

	});

	//Select order option
	$('.currency_table thead tr th').on('click', function() {
		var sortByType;

		if($(this).children().hasClass('arrow-down')) {
			$(this).find('.arrow-down').removeClass('arrow-down').addClass('arrow-up');
			sortByType = 'up';
		}
		else if($(this).children().hasClass('arrow-up')) {
			$(this).find('.arrow-up').removeClass('arrow-up').addClass('arrow-down');
			sortByType = 'down';
		}
		else {
			$(this).siblings().find('.arrow-down') && $(this).siblings().find('.arrow-down').removeClass('arrow-down');
			$(this).siblings().find('.arrow-up') && $(this).siblings().find('.arrow-up').removeClass('arrow-up');

			$(this).find('i').addClass('arrow-down');
			sortByType = 'down';

		}

		orderByData($(this).index(), sortByType);
	});

	function orderByData(index, sortByType) {
		var orderByType,
			tsym = $('#tsym').val();

		$('#stormCurrency .currency_table tbody').empty();

		switch(index) {
			case 0:
				orderByType = 'FROMSYMBOL';
			break;
			case 1:
				orderByType = 'PRICE';
			break;
			case 2:
				orderByType = 'VOLUME24HOURTO';
			break;
			case 3:
				orderByType = 'LASTUPDATE';
			break;
			case 4:
				orderByType = '1hour';
			break;
			case 5:
				orderByType = '24hour';
			break;
		}

		var dataToplistcoin = coinsData[tsym].toplistcoin,
			dataHash = coinsData[tsym].hash;

		if(orderByType == '1hour') {
			for (var i = 0; i < dataHash.length - 1; i++)  {

				if(i + 1 >= dataHash.length) break;

	            for (var j = 0; j < dataHash.length - i - 1; j++) {
	            	var currentData = (dataToplistcoin[dataHash[j]]['PRICE'] - dataToplistcoin[dataHash[j]]['OPENHOUR']) / dataToplistcoin[dataHash[j]]['OPENHOUR'];
	            	var nextData = (dataToplistcoin[dataHash[j+1]]['PRICE'] - dataToplistcoin[dataHash[j+1]]['OPENHOUR']) / dataToplistcoin[dataHash[j+1]]['OPENHOUR'];

	            	if(sortByType == 'down') {
	            		if(currentData < nextData) {

							var temporaryHashData = dataHash[j];
							dataHash[j] = dataHash[j+1];
							dataHash[j+1] = temporaryHashData;

						}

	            	}
	            	else {
	            		if(currentData > nextData) {

							var temporaryHashData = dataHash[j];
							dataHash[j] = dataHash[j+1];
							dataHash[j+1] = temporaryHashData;

						}
	            	}
	            }
	        }
		}
		else if (orderByType == '24hour') {

			for (var i = 0; i < dataHash.length - 1; i++)  {
				if(i + 1 >= dataHash.length) break;

	            for (var j = 0; j < dataHash.length - i - 1; j++) {
	            	var currentData = (dataToplistcoin[dataHash[j]]['PRICE'] - dataToplistcoin[dataHash[j]]['OPEN24HOUR']) / dataToplistcoin[dataHash[j]]['OPEN24HOUR'];
	            	var nextData = (dataToplistcoin[dataHash[j+1]]['PRICE'] - dataToplistcoin[dataHash[j+1]]['OPEN24HOUR']) / dataToplistcoin[dataHash[j+1]]['OPEN24HOUR'];

	            	if(sortByType == 'down') {
	            		if(currentData < nextData) {

							var temporaryHashData = dataHash[j];
							dataHash[j] = dataHash[j+1];
							dataHash[j+1] = temporaryHashData;

						}

	            	}
	            	else {
	            		if(currentData > nextData) {

							var temporaryHashData = dataHash[j];
							dataHash[j] = dataHash[j+1];
							dataHash[j+1] = temporaryHashData;

						}
	            	}
	            }
	        }
		}
		else {

			for (var i = 0; i < dataHash.length - 1; i++)  {
				if(i + 1 >= dataHash.length) break;

	            for (var j = 0; j < dataHash.length - i - 1; j++) {
	            	if(sortByType == 'down') {
	            		if(dataToplistcoin[dataHash[j]][orderByType] < dataToplistcoin[dataHash[j+1]][orderByType]) {

							var temporaryHashData = dataHash[j];
							dataHash[j] = dataHash[j+1];
							dataHash[j+1] = temporaryHashData;

						}

	            	}
	            	else {
	            		if(dataToplistcoin[dataHash[j]][orderByType] > dataToplistcoin[dataHash[j+1]][orderByType]) {

							var temporaryHashData = dataHash[j];
							dataHash[j] = dataHash[j+1];
							dataHash[j+1] = temporaryHashData;

						}
	            	}
	            }
	        }
		}


		var symbol = CCC.STATIC.CURRENCY.getSymbol(tsym.toUpperCase());
		// var fsymSymbol = CCC.STATIC.CURRENCY.getSymbol(fsym.toUpperCase());

		for(var i = 0, j = currentViewSize; i < j; i++){

			if(!coinsData[tsym].hash[i]) break;
			var data = coinsData[tsym].toplistcoin[coinsData[tsym].hash[i]];

			//only showing currency pairs that have traded at least in the last 7 days.
			if(data['LASTUPDATE'] >= Math.round(new Date().getTime() / 1000) - 604800) {
				var $tr = $($template).appendTo($('#stormCurrency .currency_table tbody'));
				// if(element == 'B@') {
				// 	element = 'B-2';
				// }
				//
				var showDate = showDateText(Math.round(new Date().getTime() / 1000), data['LASTUPDATE']);
				$tr.find('.lastupdate').attr('data-update', data['LASTUPDATE']);

				var CHANGEPCT1HOUR = ((data['PRICE'] - data['OPENHOUR']) / data['OPENHOUR'] * 100).toFixed(2);
				var CHANGEPCT24HOUR = ((data['PRICE'] - data['OPEN24HOUR']) / data['OPEN24HOUR'] * 100).toFixed(2);
				var change1hourClass = CHANGEPCT1HOUR == 0.00 ? 'unchange' : CHANGEPCT1HOUR < 0 ? 'down' : 'up';
				var change24hourClass = CHANGEPCT24HOUR == 0.00 ? 'unchange' : CHANGEPCT24HOUR < 0 ? 'down' : 'up';

				$tr.attr('id', 'id-' + data['FROMSYMBOL']);
				$tr.find('.currency-icon').addClass('icon-' + data['FROMSYMBOL'].toLowerCase());
				$tr.find('.coinname').text(data['COINNAME']);
				$tr.find('.name').text(data['FROMSYMBOL']);
				$tr.find('.price').text(CCC.convertValueToDisplay(symbol, data['PRICE']));
				// $tr.find('.mktcap').text(index[tsym]['MKTCAP']);
				$tr.find('.totalvolume24h').find('.volume24hour').text(CCC.convertValueToDisplay(data['FROMSYMBOL'], data['VOLUME24HOUR']));
				$tr.find('.totalvolume24h').find('.volume24hourto').text(CCC.convertValueToDisplay(symbol, data['VOLUME24HOURTO']));
				$tr.find('.update').text(showDate);
				$tr.find('.market').text(data['LASTMARKET']);
				$tr.find('.1hour').addClass(change1hourClass);
				$tr.find('.change1hour').addClass(change1hourClass).html(CHANGEPCT1HOUR + '%');
				$tr.find('.24hour').addClass(change24hourClass);
				$tr.find('.change24hour').addClass(change24hourClass).html(CHANGEPCT24HOUR + '%');
			}
		}

	};

	//coin page js
	var $currency = $('.storm-currency-' + $('.storm-currency-coin #fsym').val());
	var option = [];
	option['fsym'] = $('.storm-currency-coin #fsym').val();
	option['tsym'] = $('.storm-currency-coin #tsym').val();
	option['timeType'] = $('.currency-chart-menu').find('.selected').index() + 1;

	function getCoinUrl(fsym, tsym) {
		if(!tsym) return false;
		var fsyms = fsym.toUpperCase();
		var tsyms = tsym.toUpperCase();

		$.ajax({
			url: 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + fsyms + '&tsyms=' + tsyms,
			type: 'post',
			dataType: 'json',
			success: function(data){

				var dataRaw =  data['RAW'][fsyms][tsyms];
				var symbol = CCC.STATIC.CURRENCY.getSymbol(tsyms);
				var fromSymbol = CCC.STATIC.CURRENCY.getSymbol(fsyms);
				var showDate = showDateText(Math.round(new Date().getTime() / 1000), dataRaw['LASTUPDATE']);
				var $contain = $('.storm-currency-' + fsyms + ' .currency-info');

				$($contain).find('.supply').attr('data-supply', dataRaw['SUPPLY']);
				$($contain).find('.lastupdate').attr('data-update', dataRaw['LASTUPDATE']);

				$($contain).find('.price .currency-content').text(CCC.convertValueToDisplay(symbol, dataRaw['PRICE']));
				$($contain).find('.mktcap .currency-content').text(CCC.convertValueToDisplay(symbol, dataRaw['MKTCAP']));
				$($contain).find('.supply .currency-content').text(dataRaw['SUPPLY']);
				$($contain).find('.volume24hourto .currency-content').text(CCC.convertValueToDisplay(symbol, dataRaw['VOLUME24HOURTO']));
				$($contain).find('.volume24hour .currency-content').text(CCC.convertValueToDisplay(fromSymbol, dataRaw['VOLUME24HOUR']));
				$($contain).find('.market .currency-content').text(dataRaw['LASTMARKET']);
				$($contain).find('.update').text(showDate);
				$($contain).find('.change24hour .currency-content').text((dataRaw['CHANGEPCT24HOUR']).toFixed(2) + '%');
				$currency.stormCurrencyChart(option);

			},
			complete: function() {
				$('.currency-loader-chart-container').remove();
			}
		});

	};

	option['fsym'] && getCoinPairs(option['fsym']);

	function getCoinPairs(fsym) {
		var $contain = $('.currency-symbol-list'),
			checkTsym = 0;

		$.getJSON('https://min-api.cryptocompare.com/data/top/pairs', {fsym: fsym, limit: '200'}, function(json, textStatus) {
			if(textStatus == 'success') {
				$.each(json['Data'], function(index, val) {
					if(val['toSymbol'] == option['tsym'].toUpperCase()) {
						checkTsym = 1;
					}
					$('<li><a role="button">' + val['toSymbol'] + '</a></li>').appendTo($($contain));
				});

				if(checkTsym == 0) {
					option['tsym'] = json['Data'][0]['toSymbol'].toLowerCase();
					$('.currency-coinpage-name').text(json['Data'][0]['toSymbol']);
					$('.coin-tsym').text(json['Data'][0]['toSymbol']);
				}
			}
		})
		.success(function() {
			getCoinUrl(option['fsym'], option['tsym']);
			$('.storm-currency-' + option['fsym']).stormCurrencyCoin();
		});

	}

	// option['fsym'] && getCoinPairs(option['fsym']);


	var lazyChart = debounce(function() {
		$currency.stormCurrencyChart(option);
	}, 500);

	option['fsym'] && $(window).resize(lazyChart);

	//Show select symbol list
	$('.currency-symbol-menu .btn').on('click', function(e) {
		e.preventDefault();

		$('.currency-symbol-container').show();
	});

	//Hide select symbol list
	$(document).on('click', function(e) {
		if(!$(e.target).is('.currency-symbol-container, .currency-symbol-menu .btn')) {
			$('.currency-symbol-container').hide();
		}
	});

	//Click symbol trigger stormCurrencyChart plugin, change the chart
	$(document).on('click', '.currency-symbol-list li', function(e) {
		e.preventDefault();

		$('.currency-symbol-menu .btn').text($(this).find('a').text());
		$('.storm-currency-coin #tsym').val($(this).find('a').text());
		$('.currency-coinpage-name').text($(this).find('a').text().toUpperCase());

		var params = [];
		params['fsym'] = $('.storm-currency-coin #fsym').val();
		params['tsym'] = $('.storm-currency-coin #tsym').val();
		params['timeType'] = $('.currency-chart-menu').find('.selected').index() + 1;

		// getCoinUrl(params['fsym'], params['tsym']);
		$currency.stormCurrencyChart(params);
		$currency.stormCurrencyCoin();
	});

	//Select time type, change the chart
	$('.currency-chart-menu .menu-item').on('click', function(e) {
		e.preventDefault();

		$(this).siblings().removeClass('selected');
		$(this).addClass('selected');

		var params = [];
		params['fsym'] = $('.storm-currency-coin #fsym').val();
		params['tsym'] = $('.storm-currency-coin #tsym').val();
		params['timeType'] = $(this).index() + 1;

		$currency.stormCurrencyChart(params);
	});

	var currencyList = function(el, option) {
		var $this = this;

		$(el).data('list-websocket', $this);

		$this.url = 'https://streamer.cryptocompare.com/';
		$this.socket = io($this.url);
		$this.subscription = [];

		$this.disconnect = function() {

			$this.socket.emit('SubRemove', { subs: $this.subscription });
			$this.subscription = [];
		};

		$this.getCurrenCurrency = function(newOption) {
			var coinslist = newOption ? newOption : option;
			$.each(coinslist, function(index, val) {
				$this.subscription.push(val);
			});

			$this.socket.emit('SubAdd', { subs: $this.subscription });

			$this.socket.on('m', function(message) {
				var messageType = message.substring(0, message.indexOf('~'));
				var res = {};

				if(messageType == CCC.STATIC.TYPE.CURRENTAGG) {

					res = CCC.CURRENT.unpack(message);

					if(res['PRICE']) {
						$this.currencyUnpack(res);
					}
				}
 			});
		};

		$this.currencyUnpack = function(data) {
			$this.displayCurrency(data, CCC.STATIC.CURRENCY.getSymbol(data['TOSYMBOL']));
		};

		$this.getNewCoinData = function(newData) {
			//Copy data to the coinsData as data is updated
			$.each(newData, function(index, val) {
				if(typeof coinsData[tsym].toplistcoin[newData['FROMSYMBOL']] != 'null' && typeof coinsData[tsym].toplistcoin[newData['FROMSYMBOL']] != 'undefined' ) {
					coinsData[tsym].toplistcoin[newData['FROMSYMBOL']][index] = val;
				}
			});

		};

		$this.displayCurrency = function(data, tsym) {
			if(data['FROMSYMBOL'] == 'B@') {
				data['FROMSYMBOL'] = 'B-2';
			}
			if(data['PRICE'] > $('#id-' + data['FROMSYMBOL']).data('price')){
				$('#id-' + data['FROMSYMBOL']).addClass('highlight-up').delay(1000).queue(function() {
					$(this).removeClass('highlight-up').dequeue();
				});
			}
			else if(data['PRICE'] < $('#id-' + data['FROMSYMBOL']).data('price')) {
				$('#id-' + data['FROMSYMBOL']).addClass('highlight-down').delay(1000).queue(function() {
					$(this).removeClass('highlight-down').dequeue();
				});
			}
			else {
				$('#id-' + data['FROMSYMBOL']).addClass('highlight-unchange').delay(1000).queue(function() {
					$(this).removeClass('highlight-unchange').dequeue();
				});
			}

			var change24hour = ((data['PRICE'] - data['OPEN24HOUR']) / data['OPEN24HOUR'] * 100).toFixed(2);
			var change1hour = ((data['PRICE'] - data['OPENHOUR']) / data['OPENHOUR'] * 100).toFixed(2);

			$('#id-' + data['FROMSYMBOL']).data('price', data['PRICE']);
			$('#id-' + data['FROMSYMBOL'] + ' .price').text(CCC.convertValueToDisplay(tsym, data['PRICE']));
			if(data['VOLUME24HOUR']) {
				$('#id-' + data['FROMSYMBOL'] + ' .totalvolume24h').find('.volume24hour').text(CCC.convertValueToDisplay(data['FROMSYMBOL'], data['VOLUME24HOUR']));
			}
			if(data['VOLUME24HOURTO']) {
				$('#id-' + data['FROMSYMBOL'] + ' .totalvolume24h').find('.volume24hourto').text(CCC.convertValueToDisplay(tsym, data['VOLUME24HOURTO']));
			}
			if(data['LASTUPDATE']) {
				$('#id-' + data['FROMSYMBOL'] + ' .lastupdate').attr('data-update', data['LASTUPDATE']);
				$('#id-' + data['FROMSYMBOL'] + ' .update').text('just now');
			}
			$('#id-' + data['FROMSYMBOL'] + ' .market').text(data['LASTMARKET']);

			if(!isNaN(change24hour)) {
				var change24hourClass = change24hour == 0.00 ? 'unchange' : change24hour < 0 ? 'down' : 'up';
				$('#id-' + data['FROMSYMBOL'] + ' .24hour').addClass(change24hourClass);
				$('#id-' + data['FROMSYMBOL'] + ' .change24hour').addClass(change24hourClass).text(change24hour + '%');
			}

			if(!isNaN(change1hour)) {
				var change1hourClass = change1hour == 0.00 ? 'unchange' : change1hour < 0 ? 'down' : 'up';
				$('#id-' + data['FROMSYMBOL'] + ' .1hour').addClass(change1hourClass);
				$('#id-' + data['FROMSYMBOL'] + ' .change1hour').addClass(change1hourClass).text(change1hour + '%');
			}

			$this.getNewCoinData(data);

		};

		$this.getCurrenCurrency(option);
	};


	$.fn.stormCurrency = function(option) {
		return this.each(function() {
			if($(this).data('list-websocket') && option == 'disconnect') {
				var currency = $(this).data('list-websocket');

				currency.disconnect();

			}
			else if($(this).data('list-websocket')) {
				var exchangeCurrency = $(this).data('list-websocket');

				exchangeCurrency.getCurrenCurrency(option);
			}
			else {
				new currencyList(this, option);
			}
		});
	};
});

//websock cryptocurrency list
(function($) {



})(jQuery);