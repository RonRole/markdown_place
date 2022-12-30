<?php

namespace App\Actions\Article;

use App\Models\Article;

class UpdateArticleAction
{
    /**
     * Summary of __invoke
     * @param array {
     *     articleId: string,
     *     title: string,
     *     content?: string
     * } $param
     * @return bool
     */
    public function __invoke($param)
    {
        return Article::find($param['articleId'])->update([
            'title' => $param['title'],
            'content' => $param['content'],
        ]);
    }
}