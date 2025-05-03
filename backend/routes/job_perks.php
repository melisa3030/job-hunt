<?php

Flight::route('GET /job_perks', function () {
  Flight::json(Flight::jobPerksService()->getAllJobPerks());
});

Flight::route('GET /job_perks/job/@job_id', function ($job_id) {
  try {
    $jobPerks = Flight::jobPerksService()->getJobPerksByJobId($job_id);
    Flight::json($jobPerks);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /job_perks/perk/@perk_id', function ($perk_id) {
  try {
    $jobPerks = Flight::jobPerksService()->getJobPerksByPerkId($perk_id);
    Flight::json($jobPerks);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('POST /job_perks', function () {
  try {
    $data = Flight::request()->data->getData();
    $result = Flight::jobPerksService()->createJobPerk($data);
    Flight::json($result, 201);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});
