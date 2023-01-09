<?php

namespace App\Models\Traits;

trait UpdateFilled {
    public function updateFilled(array $array, Closure|null $callback = null,int|null $mode = 0): bool {
        $filledParams = array_filter($array, $callback, $mode);
        return $this->update($filledParams);
    }
}