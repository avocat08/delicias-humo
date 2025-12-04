<?php
require_once __DIR__ . '/../config.php';
$input = json_decode(file_get_contents('php://input'), true);
$user = $input['usuario'] ?? '';
$pass = $input['password'] ?? '';

if (empty($user) || empty($pass)) json_response(['error'=>'missing'],400);

$stmt = $mysqli->prepare("SELECT id, usuario, nombre FROM administradores WHERE usuario = ? AND password = ? LIMIT 1");
$stmt->bind_param('ss',$user,$pass);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
    json_response(['success'=>true, 'user'=>$row]);
} else {
    json_response(['success'=>false, 'error'=>'invalid']);
}
