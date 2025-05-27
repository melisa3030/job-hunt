<?php

Flight::group('/auth', function () {
    Flight::route('POST /login', function () {
        $data = Flight::request()->data->getData();

        try {
            $response = Flight::authService()->login($data);

            Flight::json($response);
        } catch (Exception $e) {
            $code = $e->getCode();
            if ($code < 100 || $code > 599) {
                $code = 500;
            }
            Flight::jsonHalt(["message" => $e->getMessage()], $code);
        }
    });

    Flight::route('GET /me', function () {
        try {
            Flight::authMiddleware()->authorizeRoles([Roles::APPLICANT, Roles::ADMIN, Roles::EMPLOYER]);
            $user = Flight::authService()->getCurrentUserData();
            Flight::json($user);
        } catch (Exception $e) {
            $code = $e->getCode();
            if ($code < 100 || $code > 599) {
                $code = 500;
            }
            Flight::jsonHalt(["message" => $e->getMessage()], $code);
        }
    });

    Flight::route('POST /refresh', function () {
        try {
            Flight::authMiddleware()->authorizeRoles([Roles::APPLICANT, Roles::ADMIN, Roles::EMPLOYER]);
            $data = Flight::request()->data->getData();
            $response = Flight::authService()->refreshUserData($data);
            Flight::json($response);
        } catch (Exception $e) {
            $code = $e->getCode();
            if ($code < 100 || $code > 599) {
                $code = 500;
            }
            Flight::jsonHalt(["message" => $e->getMessage()], $code);
        }
    });
});
