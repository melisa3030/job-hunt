<?php

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../dao/PerksDao.php';

Flight::route('GET /perks', function () {
    $perksDao = new PerksDao();
    Flight::json($perksDao->getAll(), 200);
});

Flight::route('GET /perks/@id', function ($id) {
    $perksDao = new PerksDao();
    $perk = $perksDao->getById($id);
    if ($perk) {
        Flight::json($perk, 200);
    } else {
        Flight::jsonHalt(["message" => "Perk not found"], 404);
    }
});

Flight::route('POST /perks', function () {
    $perksDao = new PerksDao();
    $data = Flight::request()->data->getData();

    validateBody(['name'], $data);

    if ($perksDao->insert($data)) {
        Flight::json(["message" => "Perk created successfully"], 201);
    } else {
        Flight::jsonHalt(["message" => "Error creating perk"], 500);
    }
});

Flight::route('PUT /perks/@id', function ($id) {
    $perksDao = new PerksDao();
    $data = Flight::request()->data->getData();

    $perk = $perksDao->getById($id);

    if (!$perk) {
        Flight::jsonHalt(["message" => "Perk not found"], 404);
    }

    if ($perksDao->update($id, $data)) {
        Flight::json(["message" => "Perk updated successfully"], 200);
    } else {
        Flight::jsonHalt(["message" => "Error updating perk"], 500);
    }
});

Flight::route('DELETE /perks/@id', function ($id) {
    $perksDao = new PerksDao();
    $perk = $perksDao->getById($id);

    if (!$perk) {
        Flight::jsonHalt(["message" => "Perk not found"], 404);
    }

    if ($perksDao->delete($id)) {
        Flight::json(["message" => "Perk deleted successfully"], 200);
    } else {
        Flight::json(["message" => "Error deleting perk"], 500);
    }
});
