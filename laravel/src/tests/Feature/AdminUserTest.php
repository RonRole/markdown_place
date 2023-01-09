<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

/**
 * 管理者ユーザーのテスト
 */
class AdminUserTest extends TestCase
{
    use RefreshDatabase;
    /**
     * 管理者ユーザーの場合、/api/admin以下のルートにアクセスできる
     */
    public function test_admin_is_ok()
    {
        Sanctum::actingAs(
            User::factory()->admin()->create()
        );
        $response = $this->getJson('/api/admin/app-global-config');
        $response->assertOk();
    }
}
