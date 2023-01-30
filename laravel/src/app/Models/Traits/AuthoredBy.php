<?php

namespace App\Models\Traits;

trait AuthoredBy
{
    public function scopeAuthoredBy($query, int $userId)
    {
        return $query->where('author_id', $userId);
    }
}