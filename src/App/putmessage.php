<?php
$_POST = json_decode( file_get_contents("php://input"), true );
use PDO;
$driver = "mysql";
$host = "localhost";
$database_name = "chat";
$username = "root";
$password = "";
$pdo = new PDO("$driver:host=$host;dbname=$database_name", $username, $password);
$sql = "INSERT INTO chat_messages (id, chat_id, sender_id, message, time_message) VALUES (:id, :chat_id, :sender_id, :message, :time_message)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
     ":id" => $_POST["id"], 
     ":chat_id" => $_POST["chatid"], 
     ":sender_id" => $_POST["send_id"], 
     ":message" => $_POST["message"], 
     ":time_message" => $_POST["time"]
]);