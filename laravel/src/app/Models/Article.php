<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     * 
     * @var array
     */
    protected $fillable = [
        'title',
        'content',
    ];
}
