<?php

Flight::group('/auth', function () {


    Flight::route('POST /login', function () {
        $data = Flight::request()->data->getData();

        try {
            $response = Flight::authService()->login($data);

            Flight::json($response);
        } catch (Exception $e) {
            Flight::json(['error' => $e->getMessage()], $e->getCode());
        }
    });
});
