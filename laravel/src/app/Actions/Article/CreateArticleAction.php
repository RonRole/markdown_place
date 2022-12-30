<?php

namespace App\Actions\Article;

use App\Models\Article;

/**
 * @param array {
 *     authorId: int,
 *     title: string,
 *     content?: string,
 * } $params
 * 
 * @return Article|false
 */
class CreateArticleAction
{
    public function __invoke(array $params)
    {
        $newArticle = new Article();
        $newArticle->author_id = $params['authorId'];
        $newArticle->title     = $params['title'];
        $newArticle->content   = $params['content'];
        if($newArticle->save()) {
            return $newArticle;
        }
        return false;
    }
}