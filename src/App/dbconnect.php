<?php

use PDO;
$driver = "mysql";
$host = "localhost";
$database_name = "chat";
$username = "root";
$password = "";
$pdo = new PDO("$driver:host=$host;dbname=$database_name", $username, $password);