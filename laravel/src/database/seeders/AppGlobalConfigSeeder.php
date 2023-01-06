<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AppGlobalConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\AppGlobalConfig::factory()->create();
    }
}
