<?php
require_once __DIR__ . '/../dao/BookmarkedJobsDao.php';
require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../dao/JobsDao.php';
require_once __DIR__ . '/../helpers.php';

Flight::route('GET /bookmarked_jobs', function () {
  $bookmarkedJobsDao = new BookmarkedJobsDao();
  Flight::json($bookmarkedJobsDao->getAll());
});

Flight::route('GET /bookmarked_jobs/user/@user_id', function ($user_id) {
  $bookmarkedJobsDao = new BookmarkedJobsDao();
  $bookmarkedJobs = $bookmarkedJobsDao->getByUserId($user_id);
  if ($bookmarkedJobs) {
    Flight::json($bookmarkedJobs);
  } else {
    Flight::jsonHalt(["message" => "No bookmarked jobs found for user_id"], 404);
  }
});

Flight::route('POST /bookmarked_jobs', function () {
  $bookmarkedJobsDao = new BookmarkedJobsDao();

  $usersDao = new UsersDao();
  $jobsDao = new JobsDao();

  $data = Flight::request()->data->getData();

  validateBody(['user_id', 'job_id'], $data);

  $user_id = $data['user_id'];
  $job_id = $data['job_id'];

  $user = $usersDao->getById($user_id);
  $job = $jobsDao->getById($job_id);

  if (!$user) {
    Flight::jsonHalt(["message" => "User not found"], 404);
  }

  if (!$job) {
    Flight::jsonHalt(["message" => "Job not found"], 404);
  }

  if ($bookmarkedJobsDao->insert($data)) {
    Flight::json(["message" => "bookmarked job created successfully"], 201);
  } else {
    Flight::jsonHalt((["message" => "Error creating bookmarked job"]), 500);
  }
});
