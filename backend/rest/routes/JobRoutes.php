<?php


Flight::route('GET /jobs', function () {
  return Flight::json(Flight::jobsService()->getAllJobs());
});

Flight::route('GET /jobs/@id', function ($id) {
  try {
    $job = Flight::jobsService()->getJobById($id);
    Flight::json($job, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('PUT /jobs/@id', function ($id) {
  try {
    $data = Flight::request()->data->getData();
    $result = Flight::jobsService()->updateJob($id, $data);
    Flight::json($result, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});


Flight::route('POST /jobs', function () {
  try {
    $data = Flight::request()->data->getData();
    $result = Flight::jobsService()->createJob($data);
    Flight::json($result, 201);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('DELETE /jobs/@id', function ($id) {
  try {
    $result = Flight::jobsService()->deleteJob($id);
    Flight::json($result, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});
