<?php


Flight::route('GET /perks', function () {
    Flight::json(Flight::perksService()->getAllPerks(), 200);
});

Flight::route('GET /perks/@id', function ($id) {
    try {
        $perk = Flight::perksService()->getPerkById($id);
        Flight::json($perk, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('POST /perks', function () {
    try {
        Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
        $data = Flight::request()->data->getData();
        Flight::perksService()->createPerk($data);
        Flight::json(["message" => "Perk created successfully"], 201);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('PUT /perks/@id', function ($id) {
    try {
        Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
        $data = Flight::request()->data->getData();
        Flight::perksService()->updatePerk($id, $data);
        Flight::json(["message" => "Perk updated successfully"], 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('DELETE /perks/@id', function ($id) {
    try {
        Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
        Flight::perksService()->deletePerk($id);
        Flight::json(["message" => "Perk deleted successfully"], 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});
