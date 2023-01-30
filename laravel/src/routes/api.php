<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AppGlobalConfigController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'auth:sanctum'
], function(){
    Route::get('/user', function (Request $request) {
       return $request->user();
    });
    Route::resource('articles', ArticleController::class, ['except'=>['create', 'edit']]);
    Route::delete('/articles', [ArticleController::class, 'destroy_multiple']);
});

/**
 * 管理者ユーザー向け
 */
Route::group([
    'prefix' => 'admin',
    'middleware' => ['auth:sanctum', 'admin'],
], function () {
    Route::controller(AppGlobalConfigController::class)->group(function () {
        Route::get('/app-global-config', 'index');
        Route::put('/app-global-config', 'update');
    });
});