<?php

namespace Tests\Feature\Tag;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DeleteTagTest extends TestCase
{
    /**
     * タグ削除正常終了テスト
     *
     * @return void
     */
    public function test_delete_success()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $tag = Tag::factory()->state(function ($attributes) use ($user) {
            return ['user_id' => $user->id];
        })->create();
        $response = $this->deleteJson('/api/tags/' . $tag->id);
        $response->assertStatus(204);
        $this->assertDeleted($tag);
    }
}
