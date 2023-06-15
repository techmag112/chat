<?php

namespace Tm\Chat\Core;

class Redirect {
    public static function to($location = '/') {

        header('Location: ' . $location);
        
    }
}