<?php

namespace App\Models;

use App\Models\Traits\AuthoredBy;
use App\Models\Traits\WhereLike;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    /**
     * タイトル,内容で曖昧検索
     */
    public function scopeWhereTitleOrContentLike($query, string $searchWord) : Builder {
        return $query->where(function($query) use ($searchWord) {
            $query->whereLike('title', $searchWord)
                ->orWhereLike('content', $searchWord);
        });
    }

    /**
	 * @return \Illuminate\Database\Eloquent\Builder;
     */
    public function scopeHasTags($query, array $tagIds) : Builder
    {
        return $query->whereExists(function($query) use ($tagIds) {
            $query->select(DB::raw(1))
                    ->from('article_tag')
                    ->whereColumn('articles.id', 'article_tag.article_id')
                    ->whereIn('article_tag.tag_id', $tagIds);
        });
    }
}
