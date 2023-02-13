<?php

namespace Tests\Feature\DeleteArticleTest;

use App\Models\Article;
use App\Models\DeletedArticle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

/**
 * 記事削除機能テスト
 */
class DeleteArticleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Articlesのデータを削除して、同じ内容でDeletedArticlesにinsertする
     * @return void
     */
    public function test_delete_article()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        $article = Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id
            ];
        })->createOne();
        $response = $this->deleteJson('/api/articles/'.$article->id);
        $response->assertStatus(204);
        $this->assertDeleted($article);
        $this->assertDatabaseHas(DeletedArticle::class, [
            'id' => $article->id
        ]);
    }

    public function test_delete_multiple()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        $article_1 = Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id
            ];
        })->createOne();
        $article_2 = Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id
            ];
        })->createOne();
        $response = $this->deleteJson('/api/articles', [
            'article_ids' => [$article_1->id, $article_2->id]
        ]);
        $response->assertStatus(204);
        $this->assertDeleted($article_1);
        $this->assertDeleted($article_2);
        $this->assertDatabaseHas(DeletedArticle::class, [
            'id' => $article_1->id
        ]);        
        $this->assertDatabaseHas(DeletedArticle::class, [
            'id' => $article_2->id
        ]);
    }

    /**
     * article_idsが与えられない場合、
     * /api/delete_multipleは422エラー
     */
    public function test_delete_multiple_without_article_ids()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        $response = $this->deleteJson('/api/articles');
        $response->assertStatus(422);
    }

    /**
     * article_idsが配列でない場合。
     * /api/delete_multipleは422エラー
     */
    public function test_delete_multiple_with_unarray_article_ids()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        $article = Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id
            ];
        })->createOne();
        $response = $this->deleteJson('/api/articles', [
            'article_ids' => $article->id
        ]);
        $response->assertStatus(422);
        $this->assertDatabaseCount(Article::class, 1);
        $this->assertDatabaseCount(DeletedArticle::class, 0);
    }

    /**
     * article_idsが配列でない場合。
     * /api/delete_multipleは422エラー
     */
    public function test_delete_multiple_with_array_unint_element()
    {
        $user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        $article = Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id
            ];
        })->createOne();
        $response = $this->deleteJson('/api/articles', [
            'article_ids' => [$article->id, 'invalid']
        ]);
        $response->assertStatus(422);
        $this->assertDatabaseCount(Article::class, 1);
        $this->assertDatabaseCount(DeletedArticle::class, 0);
    }
    
    /**
     * 複数削除
     * 他のユーザーの記事は削除されない
     */
    public function test_delete_multiple_with_other_users_article_is_fail()
    {
        $user = User::factory()->createOne();
        $other_user = User::factory()->createOne();
        Sanctum::actingAs(
            $user
        );
        $article = Article::factory()->state(function ($attributes) use ($user) {
            return [
                'author_id' => $user->id
            ];
        })->createOne();
        $other_users_article = Article::factory()->state(function ($attributes) use ($other_user) {
            return [
                'author_id' => $other_user->id
            ];
        })->createOne();
        $response = $this->deleteJson('/api/articles', [
            'article_ids' => [$article->id, $other_users_article->id]
        ]);
        $response->assertStatus(204);
        $this->assertDeleted($article);
        $this->assertDatabaseHas('articles', [
            'id' => $other_users_article->id
        ]);
        $this->assertDatabaseMissing(DeletedArticle::class, [
            'id' => $other_users_article->id
        ]);
    }
}