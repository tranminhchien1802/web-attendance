<?php
require __DIR__.'/../be/vendor/autoload.php';
$app = require __DIR__.'/../be/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
echo json_encode([
    'server' => Illuminate\Support\Facades\DB::select('SELECT DATABASE() AS db_name, @@port AS db_port'),
    'tables' => Illuminate\Support\Facades\DB::select('SHOW TABLES'),
    'user_count' => App\Models\User::count(),
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
