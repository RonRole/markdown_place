<?php

namespace Tests\Feature\ArticleTag;

use App\Models\Article;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ResetArticleTagTest extends TestCase
{
    use RefreshDatabase;
    /**
     * 記事へのタグ付与
     * タグがついていない記事にタグをつける
     * @return void
     */
    public function test_append_tags_to_article()
    {
        $user = User::factory()->createOne();
        $article = Article::factory()->state(function ($attributes) use ($user) {
            return ['author_id' => $user->id];
        })->createOne();
        Sanctum::actingAs($user);
        $tag_1 = Tag::factory()->state(function($attributes) use ($user) {
            return ['user_id' => $user->id];
        })->createOne();
        $tag_2 = Tag::factory()->state(function($attributes) use ($user) {
            return ['user_id' => $user->id];
        })->createOne();
        $tag_3 = Tag::factory()->state(function($attributes) use ($user) {
            return ['user_id' => $user->id];
        })->createOne();
        $response = $this->postJson('/api/articles/'.$article->id.'/tags', [
            'tag_ids'=>[$tag_1->id,$tag_2->id,$tag_3->id]
        ]);
        $response->assertStatus(204);
        $this->assertDatabaseHas('article_tag', [
            'article_id' => $article->id,
            'tag_id' => $tag_1->id,
        ]);
        $this->assertDatabaseHas('article_tag', [
            'article_id' => $article->id,
            'tag_id' => $tag_2->id,
        ]);
        $this->assertDatabaseHas('article_tag', [
            'article_id' => $article->id,
            'tag_id' => $tag_3->id,
        ]);
    }

    /**
     * 記事へのタグ付与
     * すでに記事にタグがついていた場合、置き換えられる
     */
    public function test_replace_old_tags()
    {
        $user = User::factory()->createOne();
        $article = Article::factory()->state(function ($attributes) use ($user) {
            return ['author_id' => $user->id];
        })->createOne();
        Sanctum::actingAs($user);
        $oldTag = Tag::factory()->state(function($attributes) use ($user) {
            return ['user_id' => $user->id];
        })->createOne();
        $article->tags()->attach($oldTag);
        $newTag = Tag::factory()->state(function($attributes) use ($user) {
            return ['user_id' => $user->id];
        })->createOne();
        $response = $this->postJson('/api/articles/'.$article->id.'/tags', [
            'tag_ids'=>[$newTag->id]
        ]);
        $response->assertStatus(204);
        $this->assertDatabaseMissing('article_tag', [
            'article_id' => $article->id,
            'tag_id' => $oldTag->id,
        ]);
        $this->assertDatabaseHas('article_tag', [
            'article_id' => $article->id,
            'tag_id' => $newTag->id,
        ]);
    }
    /**
     * 記事へのタグ付与
     * タグidを空配列で受け取ると、全てのタグが外れる
     */
    public function test_set_empty_tag_ids()
    {
        $user = User::factory()->createOne();
        $article = Article::factory()->state(function ($attributes) use ($user) {
            return ['author_id' => $user->id];
        })->createOne();
        Sanctum::actingAs($user);
        $tags = Tag::factory()->count(10)->state(function($attributes) use ($user) {
            return ['user_id' => $user->id];
        })->createOne();
        $article->tags()->attach($tags);
        $response = $this->postJson('/api/articles/'.$article->id.'/tags', [
            'tag_ids'=>[]
        ]);
        $response->assertStatus(204);
        $this->assertDatabaseCount('article_tag', 0);
    }
}
