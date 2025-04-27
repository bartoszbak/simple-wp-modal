<?php
/**
 * Plugin Name: Gutenberg Modal Block
 * Description: A simple modal block for the WordPress block editor that can be triggered by a button or URL.
 * Version: 1.0.0
 * Author: BB
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: simple-modal
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the modal block
 */
function simple_modal_register_block() {
    register_block_type(__DIR__ . '/build');
}
add_action('init', 'simple_modal_register_block');

/**
 * Enqueue frontend scripts
 */
function simple_modal_enqueue_scripts() {
    wp_enqueue_script(
        'simple-modal-frontend',
        plugins_url('build/frontend.js', __FILE__),
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'simple_modal_enqueue_scripts');

/**
 * Register REST API endpoint for modal content
 */
function simple_modal_register_rest_route() {
    register_rest_route('simple-modal/v1', '/content/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'simple_modal_get_content',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('simple-modal/v1', '/pattern/(?P<id>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => 'simple_modal_get_pattern',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'simple_modal_register_rest_route');

/**
 * Get modal content callback
 */
function simple_modal_get_content($request) {
    $page_id = $request['id'];
    $page = get_post($page_id);
    
    if (!$page) {
        return new WP_Error('no_page', 'Page not found', array('status' => 404));
    }

    return array(
        'content' => apply_filters('the_content', $page->post_content),
        'title' => $page->post_title
    );
}

/**
 * Get pattern content callback
 */
function simple_modal_get_pattern($request) {
    $pattern_id = $request['id'];
    $patterns = WP_Block_Patterns_Registry::get_instance()->get_all_registered();
    
    foreach ($patterns as $pattern) {
        if ($pattern['slug'] === $pattern_id) {
            return array(
                'content' => $pattern['content'],
                'title' => $pattern['title']
            );
        }
    }
    
    return new WP_Error('no_pattern', 'Pattern not found', array('status' => 404));
} 