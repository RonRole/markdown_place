<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * アプリケーション内で共通の設定を保存するモデル
 */
class AppGlobalConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'list_article_count'
    ];
}
