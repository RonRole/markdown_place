<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

/**
 * sanctum + fortifyでのspa認証の流れ
 * 1. /sanctum/csrf-cookieにgetリクエスト
 * 2. クッキー「laravel_session」「XSRF-TOKEN」が設定される。以降これらのクッキーをリクエストに含める
 * 3. /loginにpostリクエスト
 * 4. セッションにユーザー情報が追加される
 */
class AuthorizationHttpTest extends TestCase
{
    use RefreshDatabase;
    /**
     * laravel sanctum
     * csrf保護初期化のテスト
     * SPA専用で作っているので、レスポンスはステータスコード:204になる想定
     */
    public function test_csrfcookie_returns_204_on_success()
    {
        $response = $this->getJson('/sanctum/csrf-cookie');
        $response
            ->assertStatus(204)
            ->assertCookieNotExpired('XSRF-TOKEN');
    }

    /**
     * laravel fortify
     * ユーザー登録のテスト
     * 成功した場合、201が返ってくる
     */
    public function test_register_returns_201_on_success()
    {
        $user = User::factory()->make();
        $response = $this->postJson('/api/register', [
            'name'                  => $user->name,
            'email'                 => $user->email,
            'password'              => 'test_password',
            'password_confirmation' => 'test_password', 
        ]);
        $response
            ->assertStatus(201);
    }
    /**
     * ユーザー登録のテスト
     * 失敗した場合、422が返ってくる
     */
    public function test_register_returns_422_on_failure()
    {
        $response = $this->postJson('/api/register', [
            'name'                  => '',
            'email'                 => '',
            'password'              => 'test_password',
            'password_confirmation' => 'test_password', 
        ]);
        $response
            ->assertStatus(422);

    }

    /**
     * ログインのテスト
     * 成功した場合、200が返ってくる
     */
    public function test_login_returns_200_on_success()
    {
        $user = User::factory()->make();
        # テストユーザーを登録しておく
        $this->postJson('/api/register', [
            'name'                  => $user->name,
            'email'                 => $user->email,
            'password'              => 'test_password',
            'password_confirmation' => 'test_password', 
        ]);
        $response = $this
            ->postJson('/api/login', [
                'email'    => $user->email,
                'password' => 'test_password',
            ]);
        $response
            ->assertStatus(200);
    }

    /**
     * ログインのテスト
     * 失敗した場合、422が返ってくる
     */
    public function test_login_returns_422_on_failuer()
    {
        $response = $this
        ->postJson('/api/login', [
            'email'    => '',
            'password' => '',
        ]);
        $response
            ->assertStatus(422);
    }
}
