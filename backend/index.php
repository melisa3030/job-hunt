<?php
require 'vendor/autoload.php';
require_once __DIR__ . '/routes/users.php';
require_once __DIR__ . '/routes/companies.php';

Flight::route('GET /', function () {
  echo 'Welcome to the Job Hunt API!';
});

// Start Flight PHP
Flight::start();
