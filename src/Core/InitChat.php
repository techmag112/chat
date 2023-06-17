<?php

namespace Tm\Chat\Core;

use PDO;
use Delight\Auth\Auth;
use Delight\Db\PdoDatabase;

class InitChat {
    
    private $auth, $db;

    public function __construct(PdoDatabase $db, Auth $auth) {
        $this->db = $db;
        $this->auth = $auth;
    }

    public function getUserData() {
        $user = $this->db->select("SELECT id, email, username, avatar, email_status FROM users WHERE id = ?", [
            $this->auth->getUserId()
        ]);
   
        $_SESSION['userData'] = json_encode($user);
    }

    public function getListGroup() {
        $user = $this->db->select("SELECT id, username, avatar, group_status FROM users");
   
        $_SESSION['listGroup'] = json_encode($user);
    }

    public function getChatList() {
        $listChat = $this->db->select("SELECT a.id, a.chat_id, a.id1, a.alarm1, a.id2, a.alarm2, a.lasttime, b.email, b.username, b.avatar, b.email_status, b.group_status FROM chat_list a JOIN users b ON ((a.id1 = ? AND a.id2 = b.id) OR (a.id2 = ? AND a.id1 = b.id))", [
            $this->auth->getUserId(),
            $this->auth->getUserId()
        ]);
        $_SESSION['chatList'] =  json_encode($listChat);
    }

    public function getChatMessages() {
        $messagesChat = $this->db->select("SELECT a.*, b.id1, b.id2 FROM chat_messages a JOIN chat_list b ON ((a.chat_id = b.chat_id) AND (b.id1 = ? OR b.id2 = ?))", [
                $this->auth->getUserId(),
                $this->auth->getUserId()
             ]);
   
        $_SESSION['chatMessages'] =  json_encode($messagesChat);
    }
}