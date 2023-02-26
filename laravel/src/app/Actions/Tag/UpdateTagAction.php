<?php

namespace App\Actions\Tag;
use App\Models\Tag;
use App\Models\User;



class UpdateTagAction
{
    /**
     * タグの更新
     * @param array $param {
     *      userId: int,
     *      tagId: int,
     *      name: string
     * } $param
     * @return bool
     */
    public function __invoke(array $param) : bool
    {
        return User::find($param['userId'])->tags()->find($param['tagId'])->update([
            'name' => $param['name']
        ]);
    }
}