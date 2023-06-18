<?php

namespace Tm\Chat\Controllers;

use Delight\Auth\Auth;
use League\Plates\Engine;
use Delight\Db\PdoDatabase;
use Tm\Chat\Core\Redirect;
use \Tm\Chat\Core\DBChat;


class DBController {

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

    public function putGroupStatus() {
        $this->db->putGroupStatus();
    }

    public function getUserData() {
        $this->db->getUserData();
    }

    public function getGroupStatus() {
        $this->db->getGroupStatus();
    }

    public function getChatList() {
        $this->db->getChatList();
    }

    public function getChatMessages() {
        $this->db->getChatMessages();
    }

    public function putMessage() {
        $this->db->putMessage();
    }

    public function updateAlarm() {
        $this->db->updateAlarm();
    }

    public function updateMessage() {
        $this->db->updateMessage();
    }

}