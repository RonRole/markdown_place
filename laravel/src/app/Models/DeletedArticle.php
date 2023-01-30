<?php

namespace App\Models;

use App\Models\Traits\AuthoredBy;
use App\Models\Traits\WhereLike;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeletedArticle extends Model
{
    use HasFactory;
    use AuthoredBy;
    use WhereLike;
    
    const CREATED_AT = 'deleted_at';
    const UPDATED_AT = null;
}
