<?php

require_once __DIR__ . '/../../data/Roles.php';

Flight::route('GET /users', function () {
    try {
        Flight::authMiddleware()->authorizeRole(Roles::ADMIN);

        $id = Flight::request()->query->id;
        $email = Flight::request()->query->email;
        $name = Flight::request()->query->name;

        if ($id) {
            Flight::json(Flight::userService()->getUserById($id));
        } elseif ($email) {
            Flight::json(Flight::userService()->getUserByEmail($email));
        } elseif ($name) {
            Flight::json(Flight::userService()->getUserByName($name));
        } else {
            Flight::json(Flight::userService()->getAllUsers());
        }
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

Flight::route('POST /users/employer', function () {
    try {
        $data = Flight::request()->data->getData();
        $data['role'] = Roles::EMPLOYER->value;
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
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::APPLICANT, Roles::EMPLOYER]);
        $user = Flight::get('user');
        $data = Flight::request()->data->getData();
        $result = Flight::userService()->updateUser($id, $data, $user);
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
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::APPLICANT, Roles::EMPLOYER]);
        $user = Flight::get('user');
        $result = Flight::userService()->deleteUser($id, $user);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});
