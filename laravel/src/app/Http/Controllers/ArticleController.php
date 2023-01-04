<?php

namespace App\Http\Controllers;

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
            'skip-pages' => ['int', 'nullable']
        ]);
        return response()->json($listArticleAction([
            'authorId' => $request->user()->id,
            'skipPages' => $request->input('skip-pages'),
            'count' => $request->input('count'),
        ]));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
        $article = Article::where([
            'id' => $id,
            'author_id' => $request->user()->id
        ])->first();
        return response()->json($article);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
