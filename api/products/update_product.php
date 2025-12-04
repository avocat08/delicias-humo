<?php
require_once __DIR__ . '/../config.php';

header("Content-Type: application/json");

// Verificar si se envió ID
if (!isset($_POST["id"])) {
    echo json_encode(["success" => false, "message" => "Falta el ID del producto."]);
    exit;
}

$id = intval($_POST["id"]);
$nombre = $_POST["nombre"] ?? null;
$descripcion = $_POST["descripcion"] ?? null;
$precio = $_POST["precio"] ?? null;
$disponible = $_POST["disponible"] ?? null;

$oldImg = null;
$newImagePath = null;

// Buscar el producto actual
$stmt = $mysqli->prepare("SELECT * FROM productos WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();

if (!$product) {
    echo json_encode(["success" => false, "message" => "Producto no encontrado."]);
    exit;
}

$oldImg = $product["imagen"];

// Si viene una nueva imagen, reemplazar
if (isset($_FILES["imagen"])) {

    // Borrar imagen anterior
    if ($oldImg && file_exists(__DIR__ . "/../../uploads/" . $oldImg)) {
        unlink(__DIR__ . "/../../uploads/" . $oldImg);
    }

    $ext = pathinfo($_FILES["imagen"]["name"], PATHINFO_EXTENSION);
    $filename = uniqid("prod_") . "." . $ext;
    $newImagePath = __DIR__ . "/../../uploads/" . $filename;
    move_uploaded_file($_FILES["imagen"]["tmp_name"], $newImagePath);
    $filename = "uploads/" . $filename; // ruta relativa para la BD
}

// Query dinámica
$final_image = $newImagePath ? $filename : $oldImg;
$stmt = $mysqli->prepare("
    UPDATE productos
    SET nombre = ?, descripcion = ?, precio = ?, disponible = ?, imagen = ?
    WHERE id = ?
");

$stmt->bind_param('ssdsii', $nombre, $descripcion, $precio, $disponible, $final_image, $id);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Producto actualizado"]);
