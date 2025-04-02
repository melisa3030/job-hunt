<?php

require_once __DIR__ . "/vendor/autoload.php";

require_once __DIR__ . '/routes/users.php';
require_once __DIR__ . '/routes/companies.php';
require_once __DIR__ . '/routes/perks.php';
require_once __DIR__ . '/routes/tags.php';
require_once __DIR__ . '/routes/job_titles.php';
require_once __DIR__ . '/routes/job_categories.php';

Flight::route('GET /', function () {
  echo 'Welcome to the Job Hunt API!';
});

// Start Flight PHP
Flight::start();
