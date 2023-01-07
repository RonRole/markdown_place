<?php

namespace App\Models\Traits;

/**
 * sqlのlike句を使いやすく提供するトレイト
 * Summary of WhereLike
 */
trait WhereLike
{
    public function scopeWhereLike($query, string $column, string $keyword)
    {
        return $query->where($column, 'like', '%' . addcslashes($keyword, '%_\\') . '%');
    }

    public function scopeOrWhereLike($query, string $column, string $keyword)
    {
        return $query->orWhere($column, 'like', '%' . addcslashes($keyword, '%_\\') . '%');
    }
}