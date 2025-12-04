<?php
require_once __DIR__ . '/../config.php';

 $sql = "SELECT id, nombre, descripcion, precio, imagen, disponible FROM productos ORDER BY creado_en DESC";
$res = $mysqli->query($sql);
$rows = [];
while($r = $res->fetch_assoc()) {
    $rows[] = $r;
}
json_response($rows);
