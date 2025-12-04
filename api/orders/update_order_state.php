<?php
require_once __DIR__ . '/../config.php';
$input = json_decode(file_get_contents('php://input'), true);
$pedido_id = intval($input['pedido_id'] ?? 0);
$nuevo = $input['nuevo_estado'] ?? '';
$comentario = $input['comentario'] ?? '';
$by = $input['changed_by'] ?? 'admin';

if ($pedido_id <= 0 || empty($nuevo)) json_response(['error'=>'missing fields'],400);

$upd = $mysqli->prepare("UPDATE pedidos SET estado_actual = ?, actualizado_at = NOW() WHERE id = ?");
$upd->bind_param('si',$nuevo,$pedido_id);
$upd->execute();

$ins = $mysqli->prepare("INSERT INTO pedido_estados (pedido_id, estado, comentario, cambiado_por) VALUES (?,?,?,?)");
$ins->bind_param('isss',$pedido_id,$nuevo,$comentario,$by);
$ins->execute();

json_response(['success'=>true]);
