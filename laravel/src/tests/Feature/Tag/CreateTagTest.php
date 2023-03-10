<?php

namespace Tests\Feature\Tag;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CreateTagTest extends TestCase
{
    use RefreshDatabase;
    /**
     * タグの新規作成
     * 成功した場合、作成したタグを返却する
     * 単数
     *
     * @return void
     */
    public function test_create_success()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/tags', [
            'name' => ['test_name']
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('tags', [
            'user_id' => $user->id,
            'name' => 'test_name'
        ]);
        $response->assertJson(function(AssertableJson $json) use ($user) {
            $json->has(0, function(AssertableJson $json) use ($user) {
                $json->hasAll(['id', 'user_id', 'name', 'created_at', 'updated_at']);
                $json->whereAll([
                    'user_id' => $user->id,
                    'name' => 'test_name'
                ]);
            });
        });
    }

    /**
     * 複数作成をテスト
     */
    public function test_create_multi_success()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/tags', [
            'name' => ['test_name1', 'test_name2']
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('tags', [
            'user_id' => $user->id,
            'name' => 'test_name1'
        ]);
        $this->assertDatabaseHas('tags', [
            'user_id' => $user->id,
            'name' => 'test_name2'
        ]);
        $response->assertJson(function(AssertableJson $json) use ($user) {
            $json->has(0, function(AssertableJson $json) use ($user) {
                $json->hasAll(['id', 'user_id', 'name', 'created_at', 'updated_at']);
                $json->whereAll([
                    'user_id' => $user->id,
                    'name' => 'test_name1'
                ]);
            });
            $json->has(1, function(AssertableJson $json) use ($user) {
                $json->hasAll(['id', 'user_id', 'name', 'created_at', 'updated_at']);
                $json->whereAll([
                    'user_id' => $user->id,
                    'name' => 'test_name2'
                ]);
            });
        });
    }

    /**
     * nameパラメータが存在しない場合、422エラー
     */
    public function test_create_without_name_param_returns_422()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/tags', []);
        $response->assertStatus(422);   
    } 

    /**
     * nameパラメータの中身がstringでない場合、エラー
     */
    public function test_create_with_empty_name_param_returns_422()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/tags', [
            'name' => [113]
        ]);
        $response->assertStatus(422);   
    }
}
