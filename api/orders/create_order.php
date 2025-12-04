<?php
require_once __DIR__ . '/../config.php';

// Try to read JSON first (for API calls), fallback to POST (for form-data)
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

// Support both 'items' and 'productos' field names
$items_raw = $input['items'] ?? ($input['productos'] ?? null);

// If items is a string (from form-data), parse it as JSON
if (is_string($items_raw)) {
    $items = json_decode($items_raw, true);
} else {
    $items = $items_raw;
}

$nombre = $input['nombre'] ?? '';
$correo = $input['correo'] ?? ($input['email'] ?? '');
$telefono = $input['telefono'] ?? '';
$direccion = $input['direccion'] ?? '';
$comentarios = $input['comentarios'] ?? '';

if (empty($items) || empty($nombre) || empty($correo)) {
    json_response(['error'=>'campos obligatorios: items, nombre, correo'], 400);
}

// calculate total (use server prices)
$total = 0;
foreach($items as $it){
    $pid = intval($it['producto_id']);
    $cant = intval($it['cantidad']);
    $res = $mysqli->query("SELECT precio FROM productos WHERE id = $pid LIMIT 1");
    if ($r = $res->fetch_assoc()){
        $precio = floatval($r['precio']);
        $subtotal = $precio * max(1,$cant);
        $total += $subtotal;
        // replace price in item (optional)
    } else {
        json_response(['error'=>"producto $pid no encontrado"], 400);
    }
}

// cliente frecuente: buscar por correo
$cliente_id = null;
$stmt = $mysqli->prepare("SELECT id, total_pedidos FROM clientes_frecuentes WHERE email = ? LIMIT 1");
$stmt->bind_param('s', $correo);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()){
    $cliente_id = intval($row['id']);
    $new_count = intval($row['total_pedidos']) + 1;
    $upd = $mysqli->prepare("UPDATE clientes_frecuentes SET total_pedidos = ?, ultimo_pedido = NOW() WHERE id = ?");
    $upd->bind_param('ii',$new_count,$cliente_id);
    $upd->execute();
} else {
    // create cliente
    $insc = $mysqli->prepare("INSERT INTO clientes_frecuentes (nombre, email, total_pedidos, ultimo_pedido) VALUES (?,?,1,NOW())");
    $insc->bind_param('ss',$nombre,$correo);
    $insc->execute();
    $cliente_id = $insc->insert_id;
}

// Insert pedido
$codigo = generate_order_code();
$st = $mysqli->prepare("INSERT INTO pedidos (codigo, nombre, email, telefono, direccion, comentarios, estado, creado_en) VALUES (?,?,?,?,?,?,?,NOW())");
$estado_inicial = 'Pendiente de contacto';
$st->bind_param('sssssss',$codigo,$nombre,$correo,$telefono,$direccion,$comentarios,$estado_inicial);
$st_ok = $st->execute();
if (!$st_ok) json_response(['error'=>'no se pudo crear pedido','msg'=>$mysqli->error],500);
$pedido_id = $st->insert_id;

// Insert items
$itstmt = $mysqli->prepare("INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad) VALUES (?,?,?)");
foreach($items as $it){
    $pid = intval($it['producto_id']);
    $cant = intval($it['cantidad']);
    $itstmt->bind_param('iii', $pedido_id, $pid, $cant);
    $itstmt->execute();
}

// Insert initial estado
$sthist = $mysqli->prepare("INSERT INTO pedido_historial (pedido_id, estado, fecha) VALUES (?,?,NOW())");
$sthist->bind_param('is', $pedido_id, $estado_inicial);
$sthist->execute();

json_response(['success'=>true,'pedido_id'=>$pedido_id,'codigo'=>$codigo]);
