<?php

namespace App\Actions\Article;

use App\Models\Article;

class ListArticleAction
{
    /**
     * @param array {authorId: int, skipPages?: int, count: int} $param
     * @return Article[]
     */
    public function __invoke($param)
    {
        $offSet = array_key_exists('skipPages', $param) ? $param['skipPages'] * $param['count'] : 0;
        return Article::where([
            'author_id' => $param['authorId'],   
        ])
        ->orderBy('updated_at', 'desc')
        ->offSet($offSet)
        ->limit($param['count'])
        ->get();
    }
}

