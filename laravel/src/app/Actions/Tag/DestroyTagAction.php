<?php

namespace App\Actions\Tag;
use App\Models\User;

class DestroyTagAction
{
    /**
     * @param array $params {
     *      userId: int,
     *      tagId: int, 
     * }
     * @return bool
     */
    public function __invoke(array $params) : bool
    {
        return User::find($params['userId'])->tags()->find($params['tagId'])->delete();
    }
}