<?php

namespace App\Models;

use App\Models\Traits\AuthoredBy;
use App\Models\Traits\WhereLike;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    use AuthoredBy;
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

    public function user()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
