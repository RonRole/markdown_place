<?php

namespace App\Http\Middleware;
use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;

class RedirectFrontOriginIfUnexpectedJson
{
    /**
     * Ajaxでなく、直接ブラウザなどからアクセスされた場合、
     * FRONT_ORIGINにリダイレクトさせる
     * @param Request $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function handle(Request $request, Closure $next)
    {
        if(!$request->expectsJson())
        {
            return redirect(env('FRONT_ORIGIN', RouteServiceProvider::HOME));
        }
        return $next($request);
    }
}