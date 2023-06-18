<?php
$_POST = json_decode( file_get_contents("php://input"), true );
require("dbconnect.php");
$sql = "UPDATE chat_list SET alarm1 = :alarm1, alarm2 = :alarm2 WHERE chat_id = :chat_id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
     ":chat_id" => $_POST["chatid"], 
     ":alarm1" => $_POST["alarm1"], 
     ":alarm2" => $_POST["alarm2"]
]);