<?php
require_once __DIR__ . '/../config.php';
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) json_response(['error'=>'id missing'], 400);

$stmt = $mysqli->prepare("SELECT id, nombre, descripcion, precio, imagen, disponible FROM productos WHERE id = ? LIMIT 1");
$stmt->bind_param('i',$id);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
    json_response($row);
} else {
    json_response(['error'=>'not found'], 404);
}
