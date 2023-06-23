<?php

namespace Tm\Chat\Controllers;

use Delight\Auth\Auth;
use League\Plates\Engine;
use Delight\Db\PdoDatabase;
use Tm\Chat\Core\Redirect;
use \Tm\Chat\Core\DBChat;


class ChatController {

    private $auth, $templates, $db;

    function __construct(Auth $auth, Engine $templates, DBChat $db) {
        $this->auth = $auth;
        $this->templates = $templates;
        $this->db = $db;
    }

    public function chat_view() {
        if($this->auth->isLoggedIn()) {
            echo $this->templates->render('chat');
        }
        else {
            Redirect::to('/login');
        }
    }

    public function actionDB($arg) {
        call_user_func([$this->db, $arg['action']]);
    }

}