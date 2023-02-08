<?php

namespace App\Actions\Tag;

use App\Models\Tag;

class CreateTagAction
{
    /**
     * タグを新規作成する
     * 成功した場合、作成したタグが返却される
     * @param array $params {
     *      userId: int,
     *      name: string
     * }
     * @return Tag | false
     */
    public function __invoke(array $params) : Tag | false
    {
        $newTag = new Tag();
        $newTag->user_id = $params['userId'];
        $newTag->name = $params['name'];
        if($newTag->save()) {
            return $newTag;
        }
        return false;
    }
}