<?php

namespace Tests\Feature\Article;

use App\Models\AppGlobalConfig;
use App\Models\Article;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Testing\Fluent\AssertableJson;

/**
 * 記事一覧機能テスト
 */
class ListArticleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * 返却されるjsonの形式テスト
     * @return void
     */
    public function test_list_article_json_structure()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs($user);
        AppGlobalConfig::factory()->createOne();
        $article = Article::factory()->state(function ($attributes) use ($user) {
            return ['author_id' => $user->id];
        })->createOne();
        $tag = Tag::factory()->state(function ($attributes) use ($user) {
            return ['user_id' => $user->id];
        })->createOne();
        $article->tags()->attach($tag);
        $response = $this->getJson('/api/articles');
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has('0', function (AssertableJson $json) {
                    $json->hasAll([
                        'id',
                        'author_id',
                        'title',
                        'content',
                        'created_at',
                        'updated_at',
                    ])->has('tags', function(AssertableJson $json) {
                        $json->has('0', function (AssertableJson $json) {
                            $json->hasAll([
                                'id',
                                'user_id',
                                'name',
                                'created_at',
                                'updated_at',
                                'pivot'
                            ]);
                        });
                    });
                });
            })->hasAll([
                'current_page',
                'first_page_url',
                'from',
                'last_page',
                'last_page_url',
                'links',
                'next_page_url',
                'path',
                'per_page',
                'prev_page_url',
                'to',
                'total',
            ]);
        });
    }

    public function test_list_article()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 20
            ];
        })->createOne();
        Article::factory()->count(50)->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id
            ];
        })->create();
        $response = $this->getJson('/api/articles');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->count('data', 20);
            $json->where('last_page', 3)->etc();
        });
    }

    public function test_list_without_other_user()
    {
        $user1 = User::factory()->createOne();
        $user2 = User::factory()->createOne();
        Sanctum::actingAs(
            $user1
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 10
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user1) {
            return [
                'author_id' => $user1->id,
                'title' => 'article_1',
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user2) {
            return [
                'author_id' => $user2->id,
            ];
        })->createOne();
        $response = $this->getJson('/api/articles');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', 'article_1')->etc();
                });
            })->etc();
        });
    }
    /**
     * 記事の並び順は更新日時の降順
     * @return void
     */
    public function test_list_sorted_by_updated_at_desc()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 20
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
                'updated_at' => Carbon::now()->addDay()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_3',
                'updated_at' => Carbon::now()->addDays(2)
            ];
        })->createOne();
        $response = $this->getJson('/api/articles');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', 'article_3')->etc();
                });
                $json->has(1, function (AssertableJson $json) {
                    $json->where('title', 'article_2')->etc();
                });
                $json->has(2, function (AssertableJson $json) {
                    $json->where('title', 'article_1')->etc();
                });
            })->etc();
        });
    }
    /**
     * pageを設定した場合、
     * (page-1) * 表示件数分件数が飛ぶ
     * ソート順は更新日時降順
     */
    public function test_list_page()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
                'updated_at' => Carbon::now()->addDay()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_3',
                'updated_at' => Carbon::now()->addDays(2)
            ];
        })->createOne();
        $response = $this->getJson('/api/articles?page=2');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', 'article_2')->etc();
                });
            })->etc();
        });
    }
    
    /**
     * 記事タイトルがqに部分一致する場合、返却される
     * タイトルも内容も部分一致しない記事は返却されない
     * @return void
     */
    public function test_list_title_matched_q() {
        $user = User::factory()->createOne();
        Sanctum::actingAs($user);
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'not matched',
                'content' => 'not matched',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        $response = $this->getJson('/api/articles?q=rtic');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function(AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', 'article_1')->etc();
                });
            })->etc();
        });
    }
    /**
     * 記事内容がqに部分一致する場合、返却される
     * タイトルも内容も部分一致しない記事は返却されない
     * @return void
     */
    public function test_list_content_matched_q() {
        $user = User::factory()->createOne();
        Sanctum::actingAs($user);
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'title is not matched',
                'content' => 'this is content',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'not matched',
                'content' => 'not matched',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        $response = $this->getJson('/api/articles?q=cont');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('content', 'this is content')->etc();
                });
            })->etc();
        });
    }
    /**
     * likeでエスケープされる文字でも検索できる
     * @return void
     */
    public function test_list_escaped_characters() {
        $user = User::factory()->createOne();
        Sanctum::actingAs($user);
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => '100% orange juice',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'underscore_is_escaped',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'backslash\\is escaped',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        $response = $this->getJson('/api/articles?q=%');
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', '100% orange juice')->etc();
                });
            })->etc();
        });
        $response = $this->getJson('/api/articles?q=_');
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', 'underscore_is_escaped')->etc();
                });
            })->etc();
        });
        $response = $this->getJson('/api/articles?q=\\');
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', 'backslash\\is escaped')->etc();
                });
            })->etc();
        });
    }
    /**
     * q付きの場合でも、他のユーザーの記事は出てこない
     * @return void
     */
    public function test_list_like_without_other_user()
    {
        $user1 = User::factory()->createOne();
        $user2 = User::factory()->createOne();
        Sanctum::actingAs(
            $user1
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 10
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user1) {
            return [
                'author_id' => $user1->id,
                'title' => 'article_1',
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user2) {
            return [
                'author_id' => $user2->id,
            ];
        })->createOne();
        $response = $this->getJson('/api/articles?q=rt');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', 'article_1')->etc();
                });
            })->etc();
        });
    }

    /**
     * qが空の場合、ユーザーの記事が全て返却される
     */
    public function test_list_with_empty_q()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs($user);
        AppGlobalConfig::factory()->state(['list_article_count' => 10])->createOne();
        Article::factory()->count(10)->state(['author_id'=>$user->id])->create();
        $response = $this->getJson('/api/articles?q=');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->count('data', 10)->etc();
        });
    }
    /**
     * pageがnullの時、ページ飛ばしは発生しない
     * @return void
     */
    public function test_list_skip_page_with_null()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
                'updated_at' => Carbon::now()->addDay()
            ];
        })->createOne();
        Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_3',
                'updated_at' => Carbon::now()->addDays(2)
            ];
        })->createOne();
        $response = $this->getJson('/api/articles?page=');
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', 'article_3')->etc();
                });
            })->etc();
        });
    }

    /**
     * tag_idsを指定した場合
     */
    public function test_list_with_tag_ids()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs($user);
        AppGlobalConfig::factory()->state(function ($attributes) {
            return [
                'list_article_count' => 1
            ];
        })->createOne();
       $article_1 = Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_1',
                'updated_at' => Carbon::now()
            ];
        })->createOne();
        $article_2 = Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id,
                'title' => 'article_2',
                'updated_at' => Carbon::now()->addDay()
            ];
        })->createOne();
        $tag = Tag::factory()->state(function($attributes) use ($user) {
            return [
                'user_id' => $user->id
            ];
        })->createOne();
        $article_1->tags()->attach($tag);
        $response = $this->getJson('/api/articles?tag_ids[0]='.$tag->id);
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) {
            $json->has('data', function (AssertableJson $json) {
                $json->has(0, function (AssertableJson $json) {
                    $json->where('title', 'article_1')->etc();
                });
            })->etc();
        });
    }
}