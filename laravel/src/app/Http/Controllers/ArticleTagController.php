<?php

namespace App\Http\Controllers;

use App\Actions\ArticleTag\ResetArticleTagAction;
use Illuminate\Http\Request;

class ArticleTagController extends Controller
{
    /**
     * 記事タグ一覧の取得
     * @param Request $request
     * @param int $articleId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, int $articleId)
    {
        $tags = $request->user()
                        ->articles()
                        ->find($articleId)
                        ->tags;
        return response()->json($tags);
    }
    /**
     * $article_idのタグを、リクエストされたタグに付け直す
     * @param Request $request
     * @param int $articleId
     * @return \Illuminate\Http\Response
     */
    public function reset(Request $request, int $articleId, ResetArticleTagAction $resetArticleTagAction)
    {
        $request->validate([
            'tag_ids' => 'present|array',
            'tag_ids.*' => 'int'
        ]);
        $resetArticleTagAction([
            'userId'=>$request->user()->id,
            'articleId'=>$articleId,
            'tagIds'=>$request->input('tag_ids')
        ]);
        return response()->noContent();
    }
}
