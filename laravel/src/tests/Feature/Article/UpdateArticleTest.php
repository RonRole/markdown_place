<?php

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

/**
 * 記事更新機能テスト
 */
class UpdateArticleTest extends TestCase
{
    use RefreshDatabase;

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