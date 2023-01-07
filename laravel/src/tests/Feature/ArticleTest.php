<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\AppGlobalConfig;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
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
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 20
            ];
        })->create();
        Article::factory()->count(50)->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id
            ];
        })->create();
        $response = $this->getJson('/api/articles');
        $response->assertStatus(200);
        $response->assertJsonCount(20);
    }

    public function test_list_without_other_user()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        Sanctum::actingAs(
            $user1
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 10
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user1) {
            return [
                'author_id' => $user1->id,
                'title' => 'article_1',
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user2) {
            return [
                'author_id' => $user2->id,
            ];
        })->create();
        $response = $this->getJson('/api/articles');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', 'article_1')->etc();
            });
        });
    }
    /**
     * 記事の並び順は更新日時の降順
     * @return void
     */
    public function test_list_sorted_by_updated_at_desc()
    {
        $user = User::factory()->create();
        Sanctum::actingAs(
            $user
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 20
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
                'updated_at' => Carbon::now()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
                'updated_at' => Carbon::now()->addDay()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_3',
                'updated_at' => Carbon::now()->addDays(2)
            ];
        })->create();
        $response = $this->getJson('/api/articles');
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
     * skipPages * 表示件数分件数が飛ぶ
     * ソート順は更新日時降順
     */
    public function test_list_skip_page()
    {
        $user = User::factory()->create();
        Sanctum::actingAs(
            $user
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
                'updated_at' => Carbon::now()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
                'updated_at' => Carbon::now()->addDay()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_3',
                'updated_at' => Carbon::now()->addDays(2)
            ];
        })->create();
        $response = $this->getJson('/api/articles?skip-pages=2');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', 'article_1')->etc();
            });
        });
    }
    
    /**
     * 記事タイトルがqに部分一致する場合、返却される
     * タイトルも内容も部分一致しない記事は返却されない
     * @return void
     */
    public function test_list_title_matched_q() {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
                'updated_at' => Carbon::now()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'not matched',
                'content' => 'not matched',
                'updated_at' => Carbon::now()
            ];
        })->create();
        $response = $this->getJson('/api/articles?q=rtic');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', 'article_1')->etc();
            });
        });
    }
    /**
     * 記事内容がqに部分一致する場合、返却される
     * タイトルも内容も部分一致しない記事は返却されない
     * @return void
     */
    public function test_list_content_matched_q() {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'title is not matched',
                'content' => 'this is content',
                'updated_at' => Carbon::now()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'not matched',
                'content' => 'not matched',
                'updated_at' => Carbon::now()
            ];
        })->create();
        $response = $this->getJson('/api/articles?q=cont');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('content', 'this is content')->etc();
            });
        });
    }
    /**
     * likeでエスケープされる文字でも検索できる
     * @return void
     */
    public function test_list_escaped_characters() {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => '100% orange juice',
                'updated_at' => Carbon::now()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'underscore_is_escaped',
                'updated_at' => Carbon::now()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'backslash\\is escaped',
                'updated_at' => Carbon::now()
            ];
        })->create();
        $response = $this->getJson('/api/articles?q=%');
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', '100% orange juice')->etc();
            });
        });
        $response = $this->getJson('/api/articles?q=_');
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', 'underscore_is_escaped')->etc();
            });
        });
        $response = $this->getJson('/api/articles?q=\\');
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', 'backslash\\is escaped')->etc();
            });
        });
    }
    /**
     * q付きの場合でも、他のユーザーの記事は出てこない
     * @return void
     */
    public function test_list_like_without_other_user()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        Sanctum::actingAs(
            $user1
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 10
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user1) {
            return [
                'author_id' => $user1->id,
                'title' => 'article_1',
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user2) {
            return [
                'author_id' => $user2->id,
            ];
        })->create();
        $response = $this->getJson('/api/articles?q=rt');
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
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
                'updated_at' => Carbon::now()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
                'updated_at' => Carbon::now()->addDay()
            ];
        })->create();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_3',
                'updated_at' => Carbon::now()->addDays(2)
            ];
        })->create();
        $response = $this->getJson('/api/articles?skip-pages=');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJson(function (AssertableJson $json) {
            $json->has(0, function (AssertableJson $json) {
                $json->where('title', 'article_3')->etc();
            });
        });
    }

    public function test_show_article()
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
        $response = $this->getJson('/api/articles/'.$article->id);
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) use ($article) {
            $json->where('id', $article->id)->etc();
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
