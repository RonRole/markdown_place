<?php

namespace App\Actions\Article;

use App\Models\Article;
use App\Models\DeletedArticle;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * @param array {
 *     authorId: int,
 *     articleIds: int[]
 * } $params
 * 
 * @return bool
 */
class DestroyArticleAction
{
    public function __invoke(array $params) : bool
    {
        return DB::transaction(function () use ($params) {
            $query = Article::authoredBy($params['authorId'])->whereIn('id', $params['articleIds']);
            DeletedArticle::insertUsing([
                'id',
                'author_id',
                'title',
                'content',
                'created_at',
                'updated_at',
            ], $query);
            return $query->delete();
        });
    }
}