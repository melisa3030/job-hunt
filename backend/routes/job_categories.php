<?php

require_once __DIR__ . '/../dao/JobCategoriesDao.php';
require_once __DIR__ . '/../helpers.php';

Flight::route('GET /job_categories', function () {
    Flight::json(Flight::jobCategoriesService()->getAllJobCategories(), 200);
});

Flight::route('GET /job_categories/@id', function ($id) {
    try {
        $category = Flight::jobCategoriesService()->getJobCategoryById($id);
        Flight::json($category, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('POST /job_categories', function () {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::jobCategoriesService()->createJobCategory($data);
        Flight::json($result, 201);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('PUT /job_categories/@id', function ($id) {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::jobCategoriesService()->updateJobCategory($id, $data);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('DELETE /job_categories/@id', function ($id) {
    try {
        $result = Flight::jobCategoriesService()->deleteJobCategory($id);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});
