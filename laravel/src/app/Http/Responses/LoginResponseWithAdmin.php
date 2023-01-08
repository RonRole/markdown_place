<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

/**
 * ログイン時に、「ユーザーが管理者かどうか」を追加で返すようにしたLoginResponse
 */
class LoginResponseWithAdmin implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        return $request->wantsJson()
                    ? response()->json(['two_factor' => false, 'is_admin' => $request->user()->is_admin])
                    : redirect()->intended(Fortify::redirects('login'));
    }
}
