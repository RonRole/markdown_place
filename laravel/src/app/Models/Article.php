<?php

namespace App\Models;

use App\Models\Traits\WhereLike;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    use WhereLike;
    /**
     * 複数代入可能な属性
     * 
     * @var array
     */
    protected $fillable = [
        'title',
        'content',
    ];

    public function scopeBy($query, int $userId)
    {
        return $query->where('author_id', $userId);
    }
}
