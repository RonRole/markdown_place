<?php

namespace App\Actions\Article;

use App\Models\AppGlobalConfig;
use App\Models\Article;
use Error;
use Illuminate\Database\Query\Builder;

/**
 * Articleに対するselect句のインターフェース
 * 「ListArticleActionでqが指定されていないときはselectしない」のように
 * データベースからの取得箇所が条件分岐で複雑になるので、
 * インターフェースを噛ませておく
 */
interface SelectArticleStrategy
{
    public function get_article_select_query(int $authorId);
}

class WhenSearchWordGiven implements SelectArticleStrategy
{

    private readonly string $searchWord;

    public function __construct(string $searchWord)
    {
        $this->searchWord = $searchWord;
    }
    
	/**
	 * @param int $authorId
	 * @return mixed
	 */
	public function get_article_select_query(int $authorId) {
        return Article::by($authorId)->where(function($query){
            $query
                ->whereLike('title', $this->searchWord)
                ->orWhereLike('content', $this->searchWord);
        });
	}
}


class WhenSearchWordNotGivenOrEmpty implements SelectArticleStrategy
{
    /**
     * 検索ワードが無いor空文字の時、
     * author_idのみで抽出する
	 */
    public function get_article_select_query(int $authorId) {
        return Article::by($authorId);
	}
}

/**
 * @param array $param {q: string}
 * @return SelectArticleStrategy
 */
function get_select_article_strategy(array $param)
{
    if(array_key_exists('q', $param) and !empty($param['q']))
    {
        return new WhenSearchWordGiven($param['q']);
    }
    return new WhenSearchWordNotGivenOrEmpty();
}

function calc_offset(array $param, AppGlobalConfig $appGlobalConfig)
{
    return array_key_exists('skipPages', $param) ? $param['skipPages'] * $appGlobalConfig->list_article_count : 0;
}

class ListArticleAction
{
    /**
     * 検索パターン
     * q: 
     *    指定されないor空文字の場合、抽出しない
     *    指定された場合、タイトルと文章から部分一致検索をする
     * skipPages:
     *    指定されないor空文字の場合、offsetなし
     *    指定された場合、「この値」*AppGlobalConfigのlist_article_count分offset
     * @param array {authorId: int, q?: string, skipPages?: int } $param
     * @return Article[]
     */
    public function __invoke($param)
    {
        $appGlobalConfig = AppGlobalConfig::first();
        if(empty($appGlobalConfig)) {
            throw new Error('AppGlobalConfig is not set');
        }
        $offSet = calc_offset($param, $appGlobalConfig);
        return get_select_article_strategy($param)
        ->get_article_select_query($param['authorId'])
        ->orderBy('updated_at', 'desc')
        ->offSet($offSet)
        ->limit($appGlobalConfig->list_article_count)
        ->get();
    }
}

