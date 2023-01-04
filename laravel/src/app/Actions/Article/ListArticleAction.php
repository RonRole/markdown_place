<?php

namespace App\Actions\Article;

use App\Models\AppGlobalConfig;
use App\Models\Article;
use Error;

class ListArticleAction
{
    /**
     * @param array {authorId: int, skipPages?: int } $param
     * @return Article[]
     */
    public function __invoke($param)
    {
        $appGlobalConfig = AppGlobalConfig::first();
        if(empty($appGlobalConfig)) {
            throw new Error('AppGlobalConfig is not set');
        }
        $offSet = array_key_exists('skipPages', $param) ? $param['skipPages'] * $appGlobalConfig->list_article_count : 0;
        return Article::where([
            'author_id' => $param['authorId'],   
        ])
        ->orderBy('updated_at', 'desc')
        ->offSet($offSet)
        ->limit($appGlobalConfig->list_article_count)
        ->get();
    }
}

