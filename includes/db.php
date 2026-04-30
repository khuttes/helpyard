<?php
// includes/db.php

// Database connection using PDO

include 'config.php';

try {
    $db = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    // Set the PDO error mode to exception
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Optional: Set the character set
    $db->exec("set names utf8mb4");
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>