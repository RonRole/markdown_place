<?php

namespace Tests\Feature;

use App\Models\AppGlobalConfig;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppGlobalConfigTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_list()
    {
        $config = AppGlobalConfig::factory()->create();
        Sanctum::actingAs(
            User::factory()->admin()->create()
        );
        $response = $this->getJson('/api/admin/app-global-config');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) use ($config) {
            $json->whereAll([
                'id' => $config->id,
                'list_article_count' => $config->list_article_count,
            ])->etc();
        });
    }

    public function test_update()
    {
        AppGlobalConfig::factory()->state(function ($attributes) {
            return ['list_article_count' => 0];
        })->create();
        Sanctum::actingAs(
            User::factory()->admin()->create()
        );
        $response = $this->putJson('/api/admin/app-global-config', [
            'list_article_count' => 30
        ]);
        $response->assertStatus(204);
        $this->assertDatabaseHas('app_global_configs', [
            'list_article_count' => 30
        ]);
    }

    public function test_update_with_empty_param()
    {
        AppGlobalConfig::factory()->state(function ($attributes) {
            return ['list_article_count' => 15];
        })->create();
        Sanctum::actingAs(
            User::factory()->admin()->create()
        );
        $response = $this->putJson('/api/admin/app-global-config', []);
        $response->assertStatus(204);
        $this->assertDatabaseHas('app_global_configs', [
            'list_article_count' => 15
        ]);
    }
}
