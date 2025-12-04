<?php
require_once __DIR__ . '/../config.php';

// Expect POST form-data
$nombre = $_POST['nombre'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$precio = floatval($_POST['precio'] ?? 0);
$disponible = isset($_POST['disponible']) ? intval($_POST['disponible']) : 1;

if (empty($nombre) || $precio <= 0) {
    json_response(['error'=>'nombre y precio obligatorio'], 400);
}

// Handle image
$upload_dir = __DIR__ . '/../../uploads/';
$image_path = null;
if (!empty($_FILES['imagen']['name'])) {
    $file = $_FILES['imagen'];
    // validations
    $allowed = ['image/jpeg','image/png','image/webp','image/svg+xml'];
    if ($file['size'] > 5*1024*1024) json_response(['error'=>'imagen muy grande (max 5MB)'], 400);
    if (!in_array($file['type'], $allowed)) json_response(['error'=>'tipo de imagen no permitido'], 400);

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid("prod_") . "." . $ext;
    $target = $upload_dir . $filename;
    
    if (!move_uploaded_file($file['tmp_name'], $target)) {
        json_response(['error'=>'error subiendo imagen'], 500);
    }
    $image_path = 'uploads/' . $filename;
}

$stmt = $mysqli->prepare("INSERT INTO productos (nombre,descripcion,precio,imagen,disponible) VALUES (?,?,?,?,?)");
$stmt->bind_param('ssdsi', $nombre, $descripcion, $precio, $image_path, $disponible);
$ok = $stmt->execute();
if ($ok) {
    $id = $stmt->insert_id;
    json_response(['success'=>true,'id'=>$id]);
} else {
    json_response(['error'=>'db error','msg'=>$mysqli->error], 500);
}
