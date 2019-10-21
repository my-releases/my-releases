<?php

/**
 * Legal
 */
Route::get('legal/terms', 'LegalController@terms');

/**
 * Single Page Application
 */
Route::get('/', 'AppController@index');
Route::get('/{owner}/{repo}', 'AppController@repo');
Route::get('/markdown', 'AppController@markdown');

