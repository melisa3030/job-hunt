<?php


Flight::route('GET /users', function () {
    $email = Flight::request()->query->email;

    if ($email) {
        try {
            Flight::json(Flight::userService()->getUserByEmail($email));
        } catch (Exception $e) {
            $code = $e->getCode();
            if ($code < 100 || $code > 599) {
                $code = 500;
            }
            Flight::jsonHalt(["message" => $e->getMessage()], $code);
        }
    } else {
        Flight::json(Flight::userService()->getAllUsers());
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
