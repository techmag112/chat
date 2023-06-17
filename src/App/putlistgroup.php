<?php
$_POST = json_decode( file_get_contents("php://input"), true );
use PDO;
$driver = "mysql";
$host = "localhost";
$database_name = "chat";
$username = "root";
$password = "";
$pdo = new PDO("$driver:host=$host;dbname=$database_name", $username, $password);
$sql = "UPDATE users SET group_status = :group_status WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(":group_status", $_POST["status"]);
$stmt->bindValue(":id", $_POST["id"]);
$stmt->execute();
// require_once '../Core/DBChat.php';
// try {
//     DBChat::getListGroup($_POST["id"], $_POST["status"]);
// } catch (Exception $e) {
//     echo $e->getMessage();
//}