<?php

namespace App\Actions\Article;

use App\Models\AppGlobalConfig;
use App\Models\Article;
use Error;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * パラメータから、
 * select ... from ... where ...
 * までのクエリを作成する
 */
function create_select_where_query_from_params(array $param) {
    $query = Article::authoredBy($param['authorId']);
    $existsQ = array_key_exists('q', $param) && isset($param['q']);
    $existsTagIds = array_key_exists('tagIds', $param) && isset($param['tagIds']) && count($param['tagIds']) > 0;
    if($existsQ) {
        $query->whereTitleOrContentLike($param['q']);
    }
    if($existsTagIds) {
        $query->hasTags($param['tagIds']);
    }
    return $query;
}
class ListArticleAction
{
    /**
     * 検索パターン
     * q: 
     *    指定されないor空文字の場合、抽出しない
     *    指定された場合、タイトルと文章から部分一致検索をする
     * tagIds:
     *    指定されないor配列の要素がない場合、検索条件に加えない
     *    指定された場合、そのどれかのタグがついた記事を抽出する
     *    タグIDのor検索
     * page:
     *    指定されないor空文字の場合、offsetなし
     *    指定された場合、(この値-1)*AppGlobalConfigのlist_article_count分offset
     * @param array {authorId: int, q?: string, tagIds?: int[], page?: int } $param
     * @return LengthAwarePaginator
     */
    public function __invoke(array $param) : LengthAwarePaginator
    {
        $appGlobalConfig = AppGlobalConfig::first();
        if(empty($appGlobalConfig)) {
            throw new Error('AppGlobalConfig is not set');
        }
        return create_select_where_query_from_params($param)
                ->with('tags')
                ->orderBy('updated_at', 'desc')
                ->paginate($appGlobalConfig->list_article_count);
    }
}

