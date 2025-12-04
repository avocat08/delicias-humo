<?php
require_once __DIR__ . '/../config.php';

header("Content-Type: application/json");

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "Falta ID"]);
    exit;
}

// Buscar imagen para borrarla
$stmt = $mysqli->prepare("SELECT imagen FROM productos WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();

if (!$product) {
    echo json_encode(["success" => false, "message" => "Producto no encontrado"]);
    exit;
}

if ($product["imagen"] && file_exists("uploads/" . $product["imagen"])) {
    unlink("uploads/" . $product["imagen"]);
}

$stmt = $mysqli->prepare("DELETE FROM productos WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Producto eliminado"]);
