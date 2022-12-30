<?php

namespace Tests\Feature;

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Testing\Fluent\AssertableJson;

class ArticleTest extends TestCase
{
    use RefreshDatabase;
    /**
     * 記事作成のテスト
     * 成功時
     * 1. articleレコードが作成される
     * 2. 作成されたArticleが返却される
     * @return void
     */
    public function test_create_article()
    {
        $user = User::factory()->create();
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

    public function test_list_article()
    {
        $user = User::factory()->create();
        Sanctum::actingAs(
            $user
        );
        Article::factory()->count(50)->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id
            ];
        })->create();
        $response = $this->getJson('/api/articles?count=20');
        $response->assertStatus(200);
        $response->assertJsonCount(20);
    }
    public function test_list_sorted_desc_by_updated_at()
    {
        $user = User::factory()->create();
        Sanctum::actingAs(
            $user
        );
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_3',
            ];
        })->create();
        $response = $this->getJson('/api/articles?count=20');
        $response->assertStatus(200);
        $response->assertJsonCount(3);
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', 'article_3')->etc();
            });
            $json->has(1, function (AssertableJson $json) {
                $json->where('title', 'article_2')->etc();
            });
            $json->has(2, function (AssertableJson $json) {
                $json->where('title', 'article_1')->etc();
            });
        });
    }
    /**
     * skipPagesを設定した場合、
     * skipPages * count分件数が飛ぶ
     * ソート順は更新日時降順
     */
    public function test_list_skip_page()
    {
        $user = User::factory()->create();
        Sanctum::actingAs(
            $user
        );
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_3',
            ];
        })->create();
        $response = $this->getJson('/api/articles?count=1&skip-pages=2');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', 'article_1')->etc();
            });
        });
    }
    /**
     * skip-pagesがnullの時、ページ飛ばしは発生しない
     * @return void
     */
    public function test_list_skip_page_with_null()
    {
        $user = User::factory()->create();
        Sanctum::actingAs(
            $user
        );
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_3',
            ];
        })->create();
        $response = $this->getJson('/api/articles?count=1&skip-pages=');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', 'article_3')->etc();
            });
        });
    }

    public function test_update_article()
    {
        $user = User::factory()->create();
        Sanctum::actingAs(
            $user
        );
        $article = Article::factory()->state(function (array $attributes) use($user) {
            return [
                'author_id' => $user->id,
            ];
        })->create();
        $response = $this->putJson('/api/articles/'.$article->id, [
            'title' => 'updated_article',
            'content' => 'updated_article_content',
        ]);
        $response->assertStatus(204);
        $this->assertDatabaseHas('articles', [
            'id' => $article->id,
            'title' => 'updated_article',
            'content' => 'updated_article_content',
        ]);
    }

    public function test_empty_title_article()
    {
        $user = User::factory()->create();
        Sanctum::actingAs(
            $user
        );
        $article = Article::factory()->state(function (array $attributes) use($user) {
            return [
                'author_id' => $user->id,
            ];
        })->create();
        $response = $this->putJson('/api/articles/'.$article->id, [
            'title' => '',
            'content' => 'updated_article_content',
        ]);
        $response->assertStatus(422);
    }
}
