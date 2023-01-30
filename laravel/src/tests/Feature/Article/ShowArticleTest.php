<?php

namespace Tests\Feature;

use App\Models\Article;
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