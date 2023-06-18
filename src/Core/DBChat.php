<?php

namespace Tm\Chat\Core;

use PDO;
use Delight\Auth\Auth;
use Delight\Db\PdoDatabase;

class DBChat {
    
    private $auth, $db;

    public function __construct(PdoDatabase $db, Auth $auth) {
        $this->db = $db;
        $this->auth = $auth;
    }

    public function putGroupStatus() {
        $_POST = json_decode( file_get_contents("php://input"), true );
        $this->db->update(
            'users',
            [
                // set
                'group_status' => $_POST["status"]
            ],
            [
                // where
                'id' => $_POST["id"]
            ]
        );
    }

    public function putMessage() {
        $_POST = json_decode( file_get_contents("php://input"), true );
        $this->db->insert(
            'chat_messages',
            [
                // set
                "id" => $_POST["id"], 
                "chat_id" => $_POST["chatid"], 
                "sender_id" => $_POST["send_id"], 
                "message" => $_POST["message"], 
                "time_message" => $_POST["time"]
            ]
        );
    }

    public function updateAlarm() {
        $_POST = json_decode( file_get_contents("php://input"), true );
        $this->db->update(
            'chat_list',
            [
                // set
                "alarm1" => $_POST["alarm1"], 
                "alarm2" => $_POST["alarm2"]
            ],
            [
                // where
                "chat_id" => $_POST["chatid"]
            ]
        );
    }

    public function updateMessage() {
        $_POST = json_decode(file_get_contents("php://input"), true );
        $this->db->update(
            'chat_messages',
            [
                // set
                "message" => $_POST["message"]
            ],
            [
                // where
                "id" => $_POST["id"], 
                "chat_id" => $_POST["chatid"], 
            ]
        );
    }

    public function getUserData() {
        $user = $this->db->select("SELECT id, email, username, avatar, email_status FROM users WHERE id = ?", [
            $this->auth->getUserId()
        ]);
   
        echo json_encode($user);
    }

    public function getGroupStatus() {
        $user = $this->db->select("SELECT id, username, avatar, group_status FROM users");
   
        echo json_encode($user);
    }

    public function getChatList() {
        $listChat = $this->db->select("SELECT a.id, a.chat_id, a.id1, a.alarm1, a.id2, a.alarm2, a.lasttime, b.email, b.username, b.avatar, b.email_status, b.group_status FROM chat_list a JOIN users b ON ((a.id1 = ? AND a.id2 = b.id) OR (a.id2 = ? AND a.id1 = b.id))", [
            $this->auth->getUserId(),
            $this->auth->getUserId()
        ]);

        echo json_encode($listChat);
    }

    public function getChatMessages() {
        $messagesChat = $this->db->select("SELECT a.*, b.id1, b.id2 FROM chat_messages a JOIN chat_list b ON ((a.chat_id = b.chat_id) AND (b.id1 = ? OR b.id2 = ?))", [
                $this->auth->getUserId(),
                $this->auth->getUserId()
             ]);
   
        echo json_encode($messagesChat);
    }



}