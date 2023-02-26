<?php

namespace App\Http\Controllers;

use App\Actions\Article\CreateArticleAction;
use App\Actions\Tag\CreateTagAction;
use App\Actions\Tag\DestroyTagAction;
use App\Actions\Tag\UpdateTagAction;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $request->user()->tags;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, CreateTagAction $createTagAction)
    {
        $request->validate([
            'name' => 'required|array',
            'name.*' => 'string'
        ]);
        $result = $createTagAction([
            'userId' => $request->user()->id,
            'name' => $request->input('name')
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
        $tag = $request->user()->tags()->find($id);
        return response()->json($tag);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id, UpdateTagAction $updateTagAction)
    {
        $request->validate([
            'name' => 'required'
        ]);
        $result = $updateTagAction([
            'userId'=>$request->user()->id,
            'tagId'=>$id,
            'name'=>$request->input('name')
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
    public function destroy(Request $request, $id, DestroyTagAction $destroyTagAction)
    {
        $result = $destroyTagAction([
            'userId' => $request->user()->id,
            'tagId' => $id
        ]);
        if($result) {
            return response()->noContent();
        }
        abort(500);
    }
}
