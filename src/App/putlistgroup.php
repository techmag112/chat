<?php
$_POST = json_decode( file_get_contents("php://input"), true );
require("dbconnect.php");
$sql = "UPDATE users SET group_status = :group_status WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(":group_status", $_POST["status"]);
$stmt->bindValue(":id", $_POST["id"]);
$stmt->execute();