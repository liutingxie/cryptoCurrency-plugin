/*
* @Author: liutingxie
* @Date:   2017-11-16 16:14:27
* @Last Modified by:   liutingxie
* @Last Modified time: 2018-01-18 10:18:24
*/

jQuery(function($) {

	$.fn.stormCurrencyChart = function(option) {
		if((typeof option).match('object|undefined')) {
			return this.each(function() {
				if($(this).data('chart')) {
					var resetChart = $(this).data('chart');
					resetChart.reset(option);
				}
				else {
					new currencyChart(this, option);
				}
			});
		}
	};

	var currencyChart = function(el, option) {
		var $this = this;

		$(el).data('chart', $this);

		$this.option = $.extend({}, option);
		$this.option.reset = !1;

		$this.reset = function(option) {
			$this.loader();
			$this.option.reset = !0;
			$this.getCurrencyData(option);
		};

		$this.myChart = function(url) {
			$this.option.reset && $(el).find('.currency-chart-view svg').empty();

			var svg = d3.select('svg'),
				margin = {top: 250, right: 20, bottom: 250, left: 40},
				width = $('.currency-chart-view').width() - margin.left - margin.right,
				height = $('.currency-chart-view').height() - 30;

			if(width < 600 && width > 300) {
				$this.option.tickLength = $this.option.tickLength / 2;
			}
			else if(width < 300 && width > 160) {
				$this.option.tickLength = 4;
			}
			else if(width < 160) {
				$this.option.tickLength = 2;
			}

			var g = svg.append('g')
				.attr('transform', 'translate(80, 0)');

			//Set the ranges
			var x = d3.scaleTime().rangeRound([0, width]);
			var	y = d3.scaleLinear().rangeRound([height, 0]);

			//Define the line
			var valueLine = d3.line()
				.x(function(d) { return x(d['time']); })
				.y(function(d) { return y(d['close']); });

			//Get the data
			d3.json(url, function(error, data) {
				if(error) throw error;

				var dataArr = data['Data'];

				// format the data
				dataArr.forEach(function(d) {
				    d['time'] = new Date(d['time'] * 1000);
				    d['close'] = d['close'];
				});

				// Scale the range of the data
				x.domain(d3.extent(dataArr, function(d) { return d['time']; }));
				y.domain([d3.min(dataArr, function(d) { return d['close']; }) / 1.005, d3.max(dataArr, function(d) { return d['close']; }) * 1.005]);


				// Add the valueline path.
				var line = g.append('path')
				    .attr('class', 'line')
				    .attr('d', valueLine(dataArr));

				$this.removeLoader();

				var tooltip = d3.select('.currency-tooltip');

				// Add the X Axis
				g.append('g')
					.attr('class', 'axis axis-x')
				    .attr('transform', 'translate(0,' + height + ')')
				    .call(d3.axisBottom(x).ticks($this.option.tickLength).tickSizeInner(-height).tickSizeOuter(0).tickFormat($this.option.format));

				// Add the Y Axis
				g.append('g')
					.attr('class', 'axis axis-y')
				    .call(d3.axisLeft(y).tickSizeInner(-width).tickSizeOuter(0));

				var mouseG = g.append('g')
					.attr('class', 'mouse-over-effect');

				// Add black vertical line to the follow mouse
				mouseG.append('path')
					.attr('class', 'mouse-line')
					.style('stroke', 'black')
					.style('stroke-width', '1px')
					.style('opacity', '0');

				var priceLine = d3.select('.line').node();

				// Append a rect to catch mouse movements on canvas
				mouseG.append('svg:rect')
					.attr('width', width)
					.attr('height', height)
					.attr('fill', 'none')
					.attr('pointer-events', 'all')
					.on('mouseout', function() {// On mouse out hide line, text
						d3.select('.mouse-line')
							.style('opacity', '0');
						d3.select('.mouse-per-line text')
							.style('opacity', '0');

						if(tooltip) tooltip.style('display', 'none');
					})
					.on('mouseover', function() {// On mouse is show line, text
						d3.select('.mouse-line')
							.style('opacity', '1');
					})
					.on('mousemove', function() {// mouse moving over canvas
						var mouse = d3.mouse(this);
						var xDate = x.invert(mouse[0]);
						var left;

						d3.select('.mouse-line')
							.attr('d', function() {
								var d = 'M' + mouse[0] + ',' + height;
								d += ' ' + mouse[0] + ',' + 0;

								return d;
							});

						var beginning = 0,
							end = priceLine.getTotalLength(),
							target = null;

						while(true) {
							target = Math.floor((beginning + end) / 2);
							pos = priceLine.getPointAtLength(target);

							if((target === end || target === beginning) && pos.x !== mouse[0]) {
								break;
							}

							if(pos.x > mouse[0]) end = target;
							else if(pos.x < mouse[0]) beginning = target;
							else break; // Position found
						}

						if((mouse[0] + 270) > $(el).width()) {
							$('.currency-tooltip').addClass('tooltip-reverse');
							left = mouse[0] - 34;
						}
						else {
							$('.currency-tooltip').removeClass('tooltip-reverse');
							left = mouse[0] + 97;
						}

						tooltip.html($this.option.tooltipFormat(xDate))
							.style('display', 'block')
							.style('left', left + 'px')
							.style('top', ($('.currency-chart-view').position().top + pos.y - 35) + 'px')
							.append('div')
							.html(CCC.convertValueToDisplay($this.option.tsym, y.invert(pos.y)));
					});
			});
		};

		$this.getCurrencyData = function(option) {
			var url;
			$this.option.timeType = option.timeType;
			$this.option.fsym =  option.fsym.toUpperCase();
			$this.option.tsym = option.tsym.toUpperCase();

			switch ($this.option.timeType) {
				case 1:
					url = 'https://min-api.cryptocompare.com/data/histominute?fsym=' + $this.option.fsym + '&tsym=' + $this.option.tsym + '&limit=60';
					$this.option.format = function(date) {
						return d3.timeFormat('%H:%M')(date);
					};

					$this.option.tooltipFormat = function(date) {
						return d3.timeFormat('%H:%M')(date);
					};

					$this.option.tickLength = 12;
					break;
				case 2:
					url = 'https://min-api.cryptocompare.com/data/histominute?fsym=' + $this.option.fsym + '&tsym=' + $this.option.tsym + '&limit=144&aggregate=10';
					$this.option.format = function(date) {
						if(d3.timeDay(date) < date) {
							return d3.timeFormat('%H:00')(date);
						} else {
							return d3.timeFormat('%b %e')(date);
						}
					};

					$this.option.tooltipFormat = function(date) {
						return d3.timeFormat('%b %e %H:%M')(date);
					};

					$this.option.tickLength = 8;

					break;
				case 3:
					url = 'https://min-api.cryptocompare.com/data/histohour?fsym=' + $this.option.fsym + '&tsym=' + $this.option.tsym + '&limit=188';
					$this.option.format = function(date) {
						if(d3.timeMonth(date) < date) {
							return d3.timeFormat('%b %e')(date);
						} else {
							return d3.timeFormat('%b')(date);
						}
					};

					$this.option.tooltipFormat = function(date) {
						return d3.timeFormat('%b %e %H:00')(date);
					};

					$this.option.tickLength = 7;

					break;
				case 4:
					url = 'https://min-api.cryptocompare.com/data/histohour?fsym=' + $this.option.fsym + '&tsym=' + $this.option.tsym + '&limit=120&aggregate=6';
					$this.option.format = function(date) {
						if(d3.timeMonth(date) < date) {
							return d3.timeFormat('%b %e')(date);
						} else {
							return d3.timeFormat('%b')(date);
						}
					};

					$this.option.tooltipFormat = function(date) {
						return d3.timeFormat('%b %e %H:00')(date);
					};

					$this.option.tickLength = 15;

					break;
				case 5:
					url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + $this.option.fsym + '&tsym=' + $this.option.tsym + '&limit=90';
					$this.option.format = function(date) {
						if(d3.timeYear(date) < date) {
							return d3.timeFormat('%b')(date);
						} else {
							return d3.timeFormat('%Y')(date);
						}
					};

					$this.option.tooltipFormat = function(date) {
						return d3.timeFormat('%b %d')(date);
					};

					$this.option.tickLength = 3;

					break;
				case 6:
					url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + $this.option.fsym + '&tsym=' + $this.option.tsym + '&limit=180';
					$this.option.format = function(date) {
						if(d3.timeYear(date) < date) {
							return d3.timeFormat('%b')(date);
						} else {
							return d3.timeFormat('%Y')(date);
						}
					};

					$this.option.tooltipFormat = function(date) {
						return d3.timeFormat('%Y %b %d')(date);
					};

					$this.option.tickLength = 6;

					break;
				case 7:
					url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + $this.option.fsym + '&tsym=' + $this.option.tsym + '&limit=360';
					$this.option.format = function(date) {
						if(d3.timeYear(date) < date) {
							return d3.timeFormat('%b')(date);
						} else {
							return d3.timeFormat('%Y')(date);
						}
					};

					$this.option.tooltipFormat = function(date) {
						return d3.timeFormat('%Y %b %d')(date);
					};

					$this.option.tickLength = 8;

					break;
			};

			$this.myChart(url);
		};

		$this.loader = function() {
			$this.loaderContainer = $('<div>').appendTo($(el).find('.currency-chart')).addClass('currency-loader-container');
			$('<div>').appendTo($this.loaderContainer).addClass('currency-loading');
			$('<div>').appendTo($this.loaderContainer).addClass('currency-overlay');
		};

		$this.removeLoader = function() {
			$this.loaderContainer && $('.currency-loader-container').remove();
		};

		$this.getCurrencyData($this.option);
	};
});