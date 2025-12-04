<?php
require_once __DIR__ . '/../config.php';
$code = $_GET['codigo'] ?? '';
if (empty($code)) json_response(['error'=>'codigo missing'],400);

$stmt = $mysqli->prepare("SELECT * FROM pedidos WHERE codigo = ? LIMIT 1");
$stmt->bind_param('s',$code);
$stmt->execute();
$res = $stmt->get_result();
if (!$order = $res->fetch_assoc()) json_response(['error'=>'not found'],404);

// items
$pid = $order['id'];
$items_res = $mysqli->query("SELECT pd.*, p.nombre, p.precio FROM pedido_detalle pd JOIN productos p ON p.id = pd.producto_id WHERE pd.pedido_id = $pid");
$items = [];
while ($it = $items_res->fetch_assoc()) $items[] = $it;

// historial
$hist_res = $mysqli->query("SELECT estado, fecha FROM pedido_historial WHERE pedido_id = $pid ORDER BY fecha ASC");
$hist = [];
while ($h = $hist_res->fetch_assoc()) $hist[] = $h;

$order['items'] = $items;
$order['historial'] = $hist;

json_response($order);
