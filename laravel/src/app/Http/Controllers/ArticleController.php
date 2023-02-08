<?php

namespace App\Http\Controllers;

use App\Actions\Article\DestroyArticleAction;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Actions\Article\CreateArticleAction;
use App\Actions\Article\UpdateArticleAction;
use App\Actions\Article\ListArticleAction;

class ArticleController extends Controller
{

    /**
     * Summary of index
     * @param ListArticleAction $listArticleAction
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, ListArticleAction $listArticleAction)
    {
        $request->validate([
            'page' => ['int', 'nullable', 'min:1']
        ]);
        return response()->json($listArticleAction([
            'authorId' => $request->user()->id,
            'q' => $request->input('q'),
            'page' => $request->input('page'),
        ]));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Actions\Article\CreateArticleAction $createArticleAction
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, CreateArticleAction $createArticleAction)
    {
        $request->validate([
            'title' => 'required',
            'content' => 'present',
        ]);
        $result = $createArticleAction([
            'authorId' => $request->user()->id,
            'title'    => $request->input('title'),
            'content'  => $request->input('content'),
        ]);
        if($result) {
            return response()->json($result);
        }
        abort(500);
    }

    /**
     * Display the specified resource.
     *
     * @param \Illuminate\Http\Request 
     * @param int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, int $id)
    {
        $article = Article::authoredBy($request->user()->id)
            ->with('tags')
            ->where('id', $id)
            ->first();
        return response()->json($article);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @param  \App\Actions\Article\UpdateArticleAction $updateArticleAction
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $id, UpdateArticleAction $updateArticleAction)
    {
        $request->validate([
            'title' => 'required',
            'content' => 'present',
        ]);
        $result = $updateArticleAction([
            'articleId' => $id,
            'authorId' => $request->user()->id,
            'title' => $request->input('title'),
            'content' => $request->input('content'),
        ]);
        if($result) {
            return response()->noContent();
        }
        abort(500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id, DestroyArticleAction $destroyArticleAction)
    {
        $result = $destroyArticleAction([
            'authorId' => $request->user()->id,
            'articleIds' => [$id]
        ]);
        if($result) {
            return response()->noContent();
        }
        abort(500);
    }
    /**
     * 服
     * @param Request \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy_multiple(Request $request, DestroyArticleAction $destroyArticleAction) {
        $request->validate([
            'article_ids' => 'required|array',
            'article_ids.*' => 'int',
        ]);
        $result = $destroyArticleAction([
            'authorId' => $request->user()->id,
            'articleIds' => $request->input('article_ids'),
        ]);
        if($result) {
            return response()->noContent();
        }
        abort(500);
    }
}
