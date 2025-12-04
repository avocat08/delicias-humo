<?php
require_once __DIR__ . '/../config.php';

header("Content-Type: application/json");

$email = $_GET["email"] ?? null;

if (!$email) {
    echo json_encode(["success" => false, "message" => "Falta el correo."]);
    exit;
}

$stmt = $mysqli->prepare("SELECT * FROM clientes_frecuentes WHERE email = ?");
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$client = $result->fetch_assoc();

if (!$client) {
    echo json_encode([
        "success" => false,
        "message" => "Cliente no registrado aún"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "client" => $client
]);
