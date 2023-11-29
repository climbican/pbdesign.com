<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
*/
// FOR THE FULL MONTE :) HAS BOTH CHARTS AND WELCOME BANNER
Route::get('/', function () {
    return view('welcome');
});
// THIS ROUTE IS USED FOR THE WEBSITE AND PLACES WHERE YOU DO NOT!! WANT THE WELCOME BANNER TO POP UP
Route::get('site/chart',function(){
    return view('website_insert');
});
// used to fetch logs from the solarlog hardware
Route::get('fetch/logs', [App\Http\Controllers\SolarLogStatsController::class, 'run_logcheck']);
// route to fetch calendar events, this also available as a static file in the controllers folder
Route::get('get/auth/code', [App\Http\Controllers\FetchCalendarEventController::class, 'get_auth_code']);
