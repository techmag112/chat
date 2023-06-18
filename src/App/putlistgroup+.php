<?php
namespace Tm\Chat\App;
$_POST = json_decode( file_get_contents("php://input"), true );
use \Tm\Chat\Core\DBChat;
DBChat::putGroupStatus($_POST["status"]);