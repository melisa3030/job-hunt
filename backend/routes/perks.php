<?php

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../dao/PerksDao.php';

Flight::route('GET /perks', function () {
    Flight::json(Flight::perksService()->getAllPerks(), 200);
});

Flight::route('GET /perks/@id', function ($id) {
    try {
        $perk = Flight::perksService()->getPerkById($id);
        Flight::json($perk, 200);
    } catch (Exception $e) {
        Flight::jsonHalt(["message" => $e->getMessage()], $e->getCode());
    }
});

Flight::route('POST /perks', function () {
    try {
        $data = Flight::request()->data->getData();
        Flight::perksService()->createPerk($data);
        Flight::json(["message" => "Perk created successfully"], 201);
    } catch (Exception $e) {
        Flight::jsonHalt(["message" => $e->getMessage()], $e->getCode());
    }
});

Flight::route('PUT /perks/@id', function ($id) {
    try {
        $data = Flight::request()->data->getData();
        Flight::perksService()->updatePerk($id, $data);
        Flight::json(["message" => "Perk updated successfully"], 200);
    } catch (Exception $e) {
        Flight::jsonHalt(["message" => $e->getMessage()], $e->getCode());
    }
});

Flight::route('DELETE /perks/@id', function ($id) {
    try {
        Flight::perksService()->deletePerk($id);
        Flight::json(["message" => "Perk deleted successfully"], 200);
    } catch (Exception $e) {
        Flight::jsonHalt(["message" => $e->getMessage()], $e->getCode());
    }
});
