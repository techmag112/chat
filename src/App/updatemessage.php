<?php
$_POST = json_decode( file_get_contents("php://input"), true );
require("dbconnect.php");
$sql = "UPDATE chat_messages SET message = :message WHERE id = :id AND chat_id = :chat_id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
     ":id" => $_POST["id"], 
     ":chat_id" => $_POST["chatid"], 
     ":message" => $_POST["message"]
]);