<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Article;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\Storage;

class ArticleTest extends TestCase
{
    use RefreshDatabase;
    /**
     * 記事作成のテスト
     * 成功時
     * 1. .mdファイルが作成される
     * 2. articleレコードが作成される
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
        $this->assertDatabaseHas('articles', [
            'author_id' => $user->id
        ]);
    }
}
