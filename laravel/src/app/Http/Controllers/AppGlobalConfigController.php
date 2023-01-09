<?php

namespace App\Http\Controllers;

use App\Models\AppGlobalConfig;
use Illuminate\Http\Request;

class AppGlobalConfigController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $appGlobalConfig = AppGlobalConfig::first();
        return response()->json($appGlobalConfig);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $request->validate([
            'list_article_count' => ['int', 'nullable']
        ]);
        $result = AppGlobalConfig::first()->updateFilled([
            'list_article_count' => $request->input('list_article_count')
        ]);
        if($result) {
            return response()->noContent();
        }
        abort(500);
    }
}
