<?php


Flight::route('GET /job_titles', function () {
    Flight::json(Flight::jobTitlesService()->getAllJobTitles(), 200);
});

Flight::route('GET /job_titles/@id', function ($id) {
    try {
        Flight::json(Flight::jobTitlesService()->getJobTitleById($id), 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('POST /job_titles', function () {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::jobTitlesService()->createJobTitle($data);
        Flight::json($result, 201);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('PUT /job_titles/@id', function ($id) {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::jobTitlesService()->updateJobTitle($id, $data);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('DELETE /job_titles/@id', function ($id) {
    try {
        $result = Flight::jobTitlesService()->deleteJobTitle($id);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});
