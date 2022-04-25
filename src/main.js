import '@babel/polyfill';

import Vue from 'vue';
window.Vue = Vue; // 將 Vue 物件掛到全域 window 下

import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js';
window.bootstrap = bootstrap; // 將 bootstrap 指向全域

import jQuery from 'jquery';
window.jQuery = window.$ = jQuery;  // 將 jQuery 物件透過連續賦值到全域 window 下

/* bootstrap 5 -------------------------------------------------------------- */
/** bootstrap 在任何地方啟用彈出提示框
 * https://bootstrap5.hexschool.com/docs/5.0/components/popovers/
 */
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});

/** bootstrap 在任何地方啟用工具提示
 * https://bootstrap5.hexschool.com/docs/5.0/components/tooltips/#example-enable-tooltips-everywhere
 */
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
/* /bootstrap 5 -------------------------------------------------------------- */

/* 圖片 ----------------------------------------------------------------------- */
/* url-loader 與 image-webpack-loader 使用圖片 */
/**
 * 已重 Scss 引入圖片
* 使用 image-webpack-loader 引入 webpack，於 Scss 中以 '~' 做為相對路徑處理
* 對應輸出路徑指向 assets/images/xx.xxx
 */
import 'images/logo.jpg';
/* /url-loader 與 image-webpack-loader 使用圖片 */
/* / 圖片 ----------------------------------------------------------------------- */


/* CSS ---------------------------------------------------------------------- */
import 'scss/main.scss';
/* /CSS ---------------------------------------------------------------------- */
