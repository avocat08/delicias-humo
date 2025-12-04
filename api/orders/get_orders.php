<?php
require_once __DIR__ . '/../config.php';

// Get all orders
$sql = "SELECT * FROM pedidos ORDER BY creado_en DESC";
$res = $mysqli->query($sql);
$orders = [];

while ($order = $res->fetch_assoc()) {
    $pedido_id = $order['id'];
    
    // Get items for this order
    $items_res = $mysqli->query("SELECT pd.*, p.nombre, p.precio FROM pedido_detalle pd JOIN productos p ON p.id = pd.producto_id WHERE pd.pedido_id = $pedido_id");
    $items = [];
    while ($it = $items_res->fetch_assoc()) {
        $items[] = $it;
    }
    
    // Get historial for this order
    $hist_res = $mysqli->query("SELECT estado, fecha FROM pedido_historial WHERE pedido_id = $pedido_id ORDER BY fecha ASC");
    $historial = [];
    while ($h = $hist_res->fetch_assoc()) {
        $historial[] = $h;
    }
    
    $order['items'] = $items;
    $order['historial'] = $historial;
    
    $orders[] = $order;
}

json_response($orders);
