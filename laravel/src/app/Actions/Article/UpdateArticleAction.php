<?php

namespace App\Actions\Article;

use App\Models\Article;

class UpdateArticleAction
{
    /**
     * Summary of __invoke
     * @param array {
     *     articleId: int,
     *     authorId: int
     *     title: string,
     *     content?: string
     * } $param
     * @return bool
     */
    public function __invoke($param) : bool
    {
        return Article::authoredBy($param['authorId'])
            ->find($param['articleId'])
            ->update([
                'title' => $param['title'],
                'content' => $param['content'],
            ]);
    }
}