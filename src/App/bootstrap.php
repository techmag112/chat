<?php

namespace Tm\Chat\App;

use \Tm\Chat\Core\Router;

// Start a Session
if( !session_id() ) {
    session_start();
}

Router::run();
