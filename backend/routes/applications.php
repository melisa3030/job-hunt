<?php

Flight::route('GET /applications', function () {
  Flight::json(Flight::applicationsService()->getAllApplications());
});

Flight::route('GET /applications/job/@job_id', function ($job_id) {
  try {
    $applications = Flight::applicationsService()->getApplicationsByJobId($job_id);
    Flight::json($applications);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /applications/applicant/@applicant_id', function ($applicant_id) {
  try {
    $applications = Flight::applicationsService()->getApplicationsByApplicantId($applicant_id);
    Flight::json($applications);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('POST /applications', function () {
  try {
    $data = Flight::request()->data->getData();
    $result = Flight::applicationsService()->createApplication($data);
    Flight::json($result, 201);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('PUT /applications/@id', function ($id) {
  try {
    $data = Flight::request()->data->getData();
    $result = Flight::applicationsService()->updateApplication($id, $data);
    Flight::json($result);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});
