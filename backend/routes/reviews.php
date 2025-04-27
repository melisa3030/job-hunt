<?php

Flight::route('GET /reviews', function () {
    Flight::json(Flight::reviewsService()->getAll(), 200);
});

Flight::route('GET /reviews/@id', function ($id) {
    try {
        $review = Flight::reviewsService()->getById($id);
        Flight::json($review, 200);
    } catch (Exception $e) {
        Flight::jsonHalt(['error' => $e->getMessage()], $e->getCode());
    }
});


Flight::route('POST /reviews', function () {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::reviewsService()->createReview($data);
        Flight::json($result, 201);
    } catch (Exception $e) {
        Flight::jsonHalt(['error' => $e->getMessage()], $e->getCode());
    }
});

Flight::route('PUT /reviews/@id', function ($id) {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::reviewsService()->update($id, $data);
        Flight::json($result, 200);
    } catch (Exception $e) {
        Flight::jsonHalt(['error' => $e->getMessage()], $e->getCode());
    }
});

Flight::route('DELETE /reviews/@id', function ($id) {
    try {
        $result = Flight::reviewsService()->delete($id);
        Flight::json($result, 200);
    } catch (Exception $e) {
        Flight::jsonHalt(['error' => $e->getMessage()], $e->getCode());
    }
});
