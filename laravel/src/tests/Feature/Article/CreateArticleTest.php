<?php

namespace Tests\Feature\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Testing\Fluent\AssertableJson;

/**
 * 記事作成機能テスト
 */
class CreateArticleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 成功時
     * 1. articleレコードが作成される
     * 2. 作成されたArticleが返却される
     * @return void
     */
    public function test_create_article()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        $response = $this->postJson('/api/articles', [
            'title' => 'test_title',
            'content' => 'test_content',
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('articles', [
            'author_id' => $user->id
        ]);
        $response->assertJson(function(AssertableJson $json) use ($user) {
            $json->hasAll(['id', 'author_id', 'title', 'content', 'created_at', 'updated_at']);
            $json->whereAll([
                'author_id'=>$user->id,
                'title'=>'test_title',
                'content'=>'test_content',
            ]);
        });
    }
    /**
     * タイトルが空の場合、422エラー
     * @return void
     */
    public function test_create_empty_title_article()
    {
        Sanctum::actingAs(
            User::factory()->create()
        );
        $response = $this->postJson('/api/articles', [
            'title' => '',
            'content' => 'test_content',
        ]);
        $response->assertStatus(422);
        $response->assertJsonStructure([
            'errors'=>[
                'title'
            ],
            'message',
        ]);
    }

    /**
     * contentが空でも、エラーにならない
     * @return void
     */
    public function test_create_empty_content_article()
    {
        Sanctum::actingAs(
            User::factory()->create()
        );
        $response = $this->postJson('/api/articles', [
            'title' => 'test_title',
            'content' => '',
        ]);
        $response->assertStatus(200);
    }

}