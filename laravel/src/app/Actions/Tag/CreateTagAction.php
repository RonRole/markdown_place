<?php

namespace App\Actions\Tag;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class CreateTagAction
{
    /**
     * タグを新規作成する
     * 成功した場合、作成したタグが返却される
     * @param array $params {
     *      userId: int,
     *      name: string[]
     * }
     * @return \Illuminate\Database\Eloquent\Collection;
     */
    public function __invoke(array $params) : Collection
    {
        $newTagNames = array_map(fn($name)=>['name'=>$name], $params['name']);
        $tags = User::find($params['userId'])
                    ->tags()
                    ->createMany($newTagNames);
        return $tags;
    }
}