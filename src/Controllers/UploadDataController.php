<?php

namespace Tm\Chat\Controllers;

use Delight\Auth\Auth;
use League\Plates\Engine;
use Delight\Db\PdoDatabase;
use Tm\Chat\Core\Redirect;
use \Tm\Chat\Core\InitChat;


class UploadDataController {

    private $auth, $templates, $db, $init;

    function __construct(Auth $auth, Engine $templates, PdoDatabase $db, InitChat $init) {
        $this->auth = $auth;
        $this->templates = $templates;
        $this->db = $db;
        $this->init = $init;
    }

    public function chat_view() {
        if($this->auth->isLoggedIn()) {
            // Генерация исходных данных для чата и передача ее в форму
            session_start();
            $this->init->getUserData();
            $this->init->getChatList();
            $this->init->getChatMessages();  
            echo $this->templates->render('chat');
        }
        else {
            Redirect::to('/login');
        }
    }
}