<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class UnauthorizeUnlessUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if(!$user or !$user->is_admin) {
            return response()->json(['error' => 'User is not admin.'], 401);
        }
        return $next($request);
    }
}
