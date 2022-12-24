<?php

namespace App\Actions\Article;

use App\Models\Article;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CreateArticleActionInput
{

    public readonly int $authorId;
    public readonly string $title;
    public readonly string $content;

    public function __construct(int $authorId, string $title, string $content)
    {
        $this->authorId = $authorId;
        $this->title = $title;
        $this->content = $content;
    }
}

class CreateArticleAction
{
    public function __invoke(CreateArticleActionInput $input)
    {
        $newArticle = new Article();
        $newArticle->author_id = $input->authorId;
        $newArticle->title     = $input->title;
        $newArticle->content   = $input->content;
        return $newArticle->save();
    }
}