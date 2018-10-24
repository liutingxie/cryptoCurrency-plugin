/*
* @Author: liutingxie
* @Date:   2017-11-10 09:20:29
* @Last Modified by:   liutingxie
* @Last Modified time: 2017-12-26 09:03:40
*/

jQuery(function($){
	$('.action-delete').on('click', function(e){
		e.preventDefault();
		if(confirm('Are you sure you want to remove this slider?')) {
			document.location.href = $(this).attr('href');
		}
	});

	//currency_list.php page search action
	$('.currency-search-reset a.btn').on('click', function(){
		var search_title = jQuery('#search-title').val();
		window.location.href='admin.php?page=cryptocurrency&search=' + search_title;
	});

	//Save screen option data
	var screenOption = {
		init: function() {
			$(document).on('submit', '#currency-screen-options-form', function(e) {
				e.preventDefault();
				screenOption.saveSetting(this, true);
			});
		},

		saveSetting: function(el, reload) {
			var option = [];
			$(el).find('input').each(function() {
				option.push($(this).val());
			});

			//Use ajax save settings
			jQuery.ajax({
				url: ajaxurl,
				type: 'post',
				dataType: 'json',
				data: {action: 'currencyScreenSetting', data: option},
				success: function(data) {
					if(typeof reload != "undefined" && reload === true) {
						document.location.href = 'admin.php?page=cryptocurrency';
					}
				}
			});

		}
	};

	//Screen options
	$('#currency-screen-options').children(':first-child').appendTo('#screen-meta');
	$('#currency-screen-options').children(':last-child').appendTo('#screen-meta-links');
	screenOption.init();

	$(window).scroll(function() {
	 	$(window).scrollTop() + $(window).height() >= $(document).height() - 45 ? ($('.currency-action-btn-list').removeClass('scroll-bottom'), $('.scroll-bar-placeholder').css('display', 'none')) : ($('.currency-action-btn-list').addClass('scroll-bottom'), $('.scroll-bar-placeholder').css('display', ''));
	}).trigger('scroll');


	//import ajax
	$('.currency-action-btn-import .import_export_btn').on('click', function() {
		var $this = $(this);
		$this.addClass('importing').text('Importing');

		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: {action: 'currencyImport'},
			error: function(errorThrown) {
				alert(errorThrown);
			},
			success: function() {
				document.location.href = 'admin.php?page=cryptocurrency';
			}
		});
	});

	$('.currency-action-btn-remove .remove-export-btn').on('click', function() {
		var $this = $(this);
		$this.addClass('importing').text('Removeing');

		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: {action: 'currencyRemoveAllCryptoCurrency'},
			error: function(errorThrown) {
				alert(errorThrown);
			},
			success: function() {
				document.location.href = 'admin.php?page=cryptocurrency';
			}
		});
	});


	//Checked will select all preset transition
	$(document).on('click', '.storm-preset-check-all', function(e) {
		e.stopPropagation();

		var $this = $(this);
		var isChecked = $this.prop('checked');
		$('.storm-exportPresetTransitionContainer .storm-preset-check').prop('checked', isChecked);

	});

	//Checked will select all sliders
	$(document).on('click', '.storm-slider-check-all', function(e) {
		e.stopPropagation();

		var $this = $(this);
		var isChecked = $this.prop('checked');
		$('.storm-exportSliderContainer .storm-slider-check').prop('checked', isChecked);
	});


	//Popup add form
	$('.add_new').on('click', function(e) {
		$($('#currency_add_template').html()).prependTo('body');
	});

	//Hide add currency pop-up
	$(document).on('click', '.currency-overlay', function(e) {
		var $target = $(e.target);
		if(!$target.parents('div').hasClass('currency_add_container')) {
			$('.currency_add_form').remove();
			$('.currency-overlay').remove();
		}
	});
});