<?php

namespace Tests\Feature;
use Tests\TestCase;

/**
 * Httpリクエスト全般のテスト
 */
class GlobalHttpTest extends TestCase
{
    public function test_redirect_if_access_direct()
    {
        $response = $this->get('/');
        $response->assertStatus(302);
    }
}