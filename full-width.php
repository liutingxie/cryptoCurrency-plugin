<?php

 /*
 Template Name: Full Width
 */

get_header(); ?>

<!-- <div class="wrap">
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>> -->
				<div class="full-currency container-fluid">
					<?php
					while ( have_posts() ) : the_post();
						the_content();
					endwhile; // End of the loop.
					?>
				</div>
<!-- 			</article>
		</main>
	</div>
</div> -->