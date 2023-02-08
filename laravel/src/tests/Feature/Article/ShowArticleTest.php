<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Testing\Fluent\AssertableJson;

/**
 * 記事照会機能テスト
 */
class ShowArticleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * /article/{id}で返却されるjsonの構造テスト
     * @return void
     */
    public function test_show_article_json_structure()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $article = Article::factory()->state(function (array $attributes) use ($user) {
            return ['author_id' => $user->id];
        })->create();
        $tag = Tag::factory()->state(function (array $attributes) use ($user) {
            return ['user_id' => $user->id];
        })->create();
        $article->tags()->attach($tag);
        $response = $this->getJson('/api/articles/' . $article->id);
        $response->assertStatus(200);
        $response->assertJson(function (AssertableJson $json) use ($article) {
            $json->hasAll([
                'id',
                'author_id',
                'title',
                'content',
                'created_at',
                'updated_at',
            ])->has('tags', function (AssertableJson $json) {
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

}