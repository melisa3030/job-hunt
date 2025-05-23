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

Flight::route('GET /users/company/@id', function ($id) {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);

        $user = Flight::userService()->getUserByCompanyId($id);
        Flight::json($user);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

/**
 * Get limited applicant information (for employers viewing job applications)
 * This endpoint provides restricted user information without sensitive data
 */
Flight::route('GET /users/applicant/@id', function ($id) {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);

        $user = Flight::userService()->getUserById($id);

        // Return only the safe fields (no password, personal details, etc.)
        $limitedUserData = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'username' => $user['username'] ?? null,
        ];

        Flight::json($limitedUserData);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('GET /users/applicants', function () {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);

        $data = Flight::request()->data->getData();

        if (!isset($data['applicant_ids']) || !is_array($data['applicant_ids'])) {
            Flight::jsonHalt(["message" => "applicant_ids array is required"], 400);
            return;
        }

        $applicantIds = $data['applicant_ids'];
        $limitedUsersData = [];

        foreach ($applicantIds as $id) {
            try {
                $user = Flight::userService()->getUserById($id);

                if ($user) {
                    $limitedUsersData[] = [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'username' => $user['username'] ?? null,
                        l,
                    ];
                }
            } catch (Exception $e) {
                // Skip users that couldn't be found
                continue;
            }
        }

        Flight::json($limitedUsersData);
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
