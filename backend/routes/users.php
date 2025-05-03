<?php
require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../helpers.php';

Flight::route('GET /users', function () {
    Flight::json(Flight::userService()->getAllUsers());
});

Flight::route('GET /users/@id', function ($id) {
    try {
        Flight::json(Flight::userService()->getUserById($id));
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('POST /users', function () {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::userService()->createUser($data);
        Flight::json($result, 201);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('PUT /users/@id', function ($id) {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::userService()->updateUser($id, $data);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('DELETE /users/@id', function ($id) {
    try {
        $result = Flight::userService()->deleteUser($id);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});
