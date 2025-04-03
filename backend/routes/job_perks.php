<?php
require_once __DIR__ . '/../dao/JobPerksDao.php';
require_once __DIR__ . '/../dao/PerksDao.php';
require_once __DIR__ . '/../dao/JobsDao.php';
require_once __DIR__ . '/../helpers.php';

Flight::route('GET /job_perks', function () {
  $jobPerksDao = new JobPerksDao();
  Flight::json($jobPerksDao->getAll());
});

Flight::route('GET /job_perks/job/@job_id', function ($job_id) {
  $jobPerksDao = new JobPerksDao();
  $jobPerks = $jobPerksDao->getByJobId($job_id);
  if ($jobPerks) {
    Flight::json($jobPerks);
  } else {
    Flight::jsonHalt(["message" => "No job perks found for job_id"], 404);
  }
});

Flight::route('GET /job_perks/perk/@perk_id', function ($perk_id) {
  $jobPerksDao = new JobPerksDao();
  $jobPerks = $jobPerksDao->getByPerkId($perk_id);
  if ($jobPerks) {
    Flight::json($jobPerks);
  } else {
    Flight::jsonHalt(["message" => "No job perks found for perk_id"], 404);
  }
});

Flight::route('POST /job_perks', function () {
  $jobPerksDao = new JobPerksDao();

  $perksDao = new PerksDao();
  $jobsDao = new JobsDao();

  $data = Flight::request()->data->getData();

  validateBody(['job_id', 'perk_id'], $data);

  $job_id = $data['job_id'];
  $perk_id = $data['perk_id'];

  $job = $jobsDao->getById($job_id);
  $perk = $perksDao->getById($perk_id);

  if (!$job) {
    Flight::jsonHalt(["message" => "Job not found"], 404);
  }

  if (!$perk) {
    Flight::jsonHalt(["message" => "Perk not found"], 404);
  }

  if ($jobPerksDao->insert($data)) {
    Flight::json(["message" => "Job perk created successfully"], 201);
  } else {
    Flight::jsonHalt((["message" => "Error creating job perk"]), 500);
  }
});
