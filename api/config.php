<?php
// api/config.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Load .env file if present (simple loader)
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        $value = trim($value, "\"'");
        putenv("$name=$value");
        $_ENV[$name] = $value;
    }
}

// DB config - use environment variables when available (for prod)
$db_host = getenv('DB_HOST') ?: '127.0.0.1';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';
$db_name = getenv('DB_NAME') ?: 'delicias_db';
$app_base_url = getenv('APP_URL') ?: '';

$mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed: ' . $mysqli->connect_error]);
    exit;
}

$mysqli->set_charset('utf8mb4');

/**
 * Helper: generate order code
 * Format: DH-HHMMSS-XXXX (max 14 chars, fits in VARCHAR(20))
 */
function generate_order_code() {
    $rand = strtoupper(substr(bin2hex(random_bytes(2)),0,4));
    return 'DH-' . date('His') . '-' . $rand;
}

/**
 * Helper: JSON response
 */
function json_response($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
