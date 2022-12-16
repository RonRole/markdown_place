<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

/**
 * ログイン済ユーザーのテスト
 */
class AuthorizedUserTest extends TestCase
{
    /**
     * ログイン/api/admin以下のルートにアクセスできない
     */
    public function test_admin_returns_401()
    {
        Sanctum::actingAs(
            User::factory()->create()
        );
        $response = $this->getJson('/api/admin/user');
        $response->assertStatus(401);
    }
}