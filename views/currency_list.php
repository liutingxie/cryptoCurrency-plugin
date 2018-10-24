<?php

/**
 * @Author: liutingxie
 * @Date:   2017-11-09 21:32:31
 * @Last Modified by:   liutingxie
 * @Last Modified time: 2017-12-26 09:05:13
 */
$currency = storm_currency::getId();
$per_page = storm_currency::limit();
$coin_symbol = storm_currency::getSymbol();
$count = storm_currency::count();

$maxPage = ceil($count / $per_page);
$maxPage = $maxPage ? $maxPage : 1;

$search_value = isset($_GET['search']) ? esc_html(stripslashes($_GET['search'])) : '';

$paged = isset($_GET['paged']) ? intval($_GET['paged']) : 1;

?>

<script type="text/template" id="currency_add_template">

	<form action="admin.php?page=cryptocurrency" method="post" class="currency_add_form">
		<div class="currency_add_container">
			<h3><?php _e('Add Crypto Currency', 'StormCurrency'); ?></h3>
			<label for="currency_add_text"><?php _e('Currency Name: ', 'StormCurrency'); ?></label>
			<input type="hidden" name="currency_add_validated">
			<input type="text" name="currency_add_text" id="currency_add_text" class="currency_add_text">
			<button class="currency_add_btn btn"><?php _e('Save Curreny', 'StormCurrency'); ?></button>
		</div>
		<div class="currency-overlay"></div>
	</form>

</script>

<div id="currency-screen-options" class="metabox-prefs">
	<div id="screen-options-wrap" class="hidden">
		<form id="currency-screen-options-form" method="post" novalidate>
			<div class="show-coin-list-container">
				<h5><?php _e('Show on screen', 'StormCurrency') ?></h5>
				<?php _e('Pagination', 'StormCurrency') ?> <input type="number" name="numberOfcurrency" min="8" step="4" value="<?php echo $per_page ?>"> <?php _e('currency per page', 'StormCurrency'); ?>
			</div>
			<div class="show-coin-default-symbol">
				<h5><?php _e('Default symbol for cryptocurrency', 'StormCurrency'); ?></h5>
				<input type="text" value="<?php echo $coin_symbol; ?>"> <?php _e('CryptoCurrency symbol', 'StormCurrency'); ?>
			</div>
			<button class="button"><?php _e('Apply', 'StormCurrency') ?></button>
		</form>
	</div>
	<div id="screen-options-link-wrap" class="hide-if-no-js screen-meta-toggle">
		<button type="button" id="show-settings-link" class="button show-settings" aria-controls="screen-options-wrap" aria-expanded="false"><?php _e('Screen Options', 'StormCurrency') ?></button>
	</div>
</div>

<div class="wrap">
 	<div class="currency_container">
	  <div class="currency_list">
	    <form method="post" class="admin_form" name="admin_form" id="admin_form" action="admin.php?page=cryptocurrency">
			<div class="tablenav top" style="width: 97%">
				<div class="currency-search-value">
					<label for="search-title">Name :</label>
		        	<input type="search" name="search-title" id="search-title" value="<?php echo $search_value; ?>">
		        </div>
		        <div class="currency-search-reset">
		          <a class="btn"><?php _e('Search', 'StormCurrency'); ?></a>
		        </div>
				<div class="tablenav-pages">
					<span class="displayind-num"><?php echo $count; ?> Items</span>
					<?php
						if( $paged == 1 ) {
							$first_page = "first-page disabled";
							$prev_page = "prev-page disabled";
							$next_page = "next-page";
							$last_page = "last-page";
						}
						else if ( $paged == $maxPage ) {
							$first_page = "first-page";
							$prev_page = "prev-page";
							$next_page = "next-page disabled";
							$last_page = "last-page disabled";
						}
					?>
					<span class="pagination-links">
					<a class="<?php echo $first_page; ?>" title="Go to the first page" href="admin.php?page=cryptocurrency<?php echo $search_value == '' ? '' : '&search=' . $search_value; ?>">&laquo;</a>
					<a class="<?php echo $prev_page; ?>" title="Go to the previous page" href="admin.php?page=cryptocurrency<?php echo $search_value == '' ? '' : '&search=' . $search_value; ?>&amp;paged=<?php echo $paged == 1 ? $paged : $paged - 1; ?>">&lsaquo;</a>
					<span class="paging-input">
						<span class="total-pages"><?php echo $paged; ?></span>
						of
						<span class="total-pages"><?php echo $maxPage; ?></span>
					</span>
					<a class="<?php echo $next_page; ?>" title="Go to the next page" href="admin.php?page=cryptocurrency<?php echo $search_value == '' ? '' : '&search=' . $search_value; ?>&amp;paged=<?php echo $paged == $maxPage ? $maxPage : $paged + 1; ?>">&rsaquo;</a>
					<a class="<?php echo $last_page; ?>" title="Go to the last page" href="admin.php?page=cryptocurrency<?php echo $search_value == '' ? '' : '&search=' . $search_value; ?>&amp;paged=<?php echo $maxPage; ?>">&raquo;</a>
					</span>
				</div>
			</div>

	        <table class="currency-list-table">
	            <thead>
			      <tr>
			        <th scope="col"><?php _e('Id', 'StormCurrency'); ?></th>
			        <th scope="col"><?php _e('Coin Name', 'StormCurrency'); ?></th>
			        <th scope="col"><?php _e('Name', 'StormCurrency'); ?></th>
			        <th scope="col"><?php _e('Create Date', 'StormCurrency'); ?></th>
			        <th scope="col"><?php _e('Modified Date', 'StormCurrency'); ?></th>
			        <th scope="col"><?php _e('Delete', 'StormCurrency'); ?></th>

			      </tr>
	            </thead>
		        <tbody>
		        	<?php if(!empty($currency)) : ?>
			          	<?php foreach ($currency as $key => $data) : ?>
				          	<tr>
				              	<td data-th="<?php _e('Id', 'StormCurrency'); ?>"><?php echo $data['id']; ?></td>
				              	<td data-th="<?php _e('Coin Name', 'StormCurrency'); ?>"><?php echo $data['coinname']; ?></td>
				              	<td data-th="<?php _e('Name', 'StormCurrency'); ?>"><?php echo $data['name']; ?></td>
				              	<td data-th="<?php _e('Create Date', 'StormCurrency'); ?>"><?php echo $data['date_create']; ?>
			        			<td data-th="<?php _e('Modified Date', 'StormCurrency'); ?>"><?php echo $data['date_modified']; ?></td>
			        			<td data-ch="<?php _e('Delete', 'StormCurrency'); ?>"><a class="action-delete" href="admin.php?page=cryptocurrency&amp;action=remove&amp;id=<?php  echo esc_html($data['id']); ?>&amp;name=<?php echo $data['name']; ?>"><?php _e('Delete', 'StormCurrency'); ?></a></td>
				          	</tr>
			          	<?php endforeach; ?>
			        <?php else : ?>
			        	<tr>
			        		<td colspan="6" class="currency-empty-slider"><span><?php _e('Sorry, there is no currency here.', 'StormCurrency'); ?></span></td>
			        	</tr>
			        <?php endif; ?>

		        </tbody>
	        </table>
 	    </form>
 	    <div class="scroll-bar-placeholder" style="display: none;"></div>
	    <div class="currency-action-btn-list">
	        <div class="currency-action-btn-addslider">
		        <span class="add_new btn"><?php _e('ADD NEW CRYPTOCURRENCY', 'StormCurrency'); ?></span>
		    </div>
	    	<div class="currency-action-btn-import">
				<input type="hidden" name="currency-import-validated">
	    		<span class="import_export_btn btn"><?php _e('IMPORT CryptoCurrency', 'StormCurrency'); ?></span>
	    	</div>
	    	<div class="currency-action-btn-remove">
				<input type="hidden" name="currency-remove-validated">
	    		<span class="remove-export-btn btn"><?php _e('REMOVE All CryptoCurrency', 'StormCurrency'); ?></span>
	    	</div>
        </div>
	  </div>
	</div>
</div>