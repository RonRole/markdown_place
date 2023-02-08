<?php

namespace App\Actions\ArticleTag;
use App\Models\Tag;
use App\Models\User;

class ResetArticleTagAction
{
    /**
     * 記事タグを置き換える
     * @param array $params {
     *      userId: int,
     *      articleId: int,
     *      tagIds: int[]
     * }
     * @return array<Tag, int>
     */
    public function __invoke(array $params) : array
    {
        $user = User::find($params['userId']);
        $tag_ids = $user->tags()
                        ->whereIn('id', $params['tagIds'])
                        ->select('id')
                        ->get();
        return $user->articles()
                    ->find($params['articleId'])
                    ->tags()
                    ->sync($tag_ids);
    }
}