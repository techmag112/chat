<?php
$_POST = json_decode( file_get_contents("php://input"), true );
use PDO;
$driver = "mysql";
$host = "localhost";
$database_name = "chat";
$username = "root";
$password = "";
$pdo = new PDO("$driver:host=$host;dbname=$database_name", $username, $password);
$sql = "UPDATE chat_messages SET message = :message WHERE id = :id AND chat_id = :chat_id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
     ":id" => $_POST["id"], 
     ":chat_id" => $_POST["chatid"], 
     ":message" => $_POST["message"]
]);