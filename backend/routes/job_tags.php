<?php
require_once __DIR__ . '/../dao/JobTagsDao.php';
require_once __DIR__ . '/../dao/TagsDao.php';
require_once __DIR__ . '/../dao/JobsDao.php';
require_once __DIR__ . '/../helpers.php';

Flight::route('GET /job_tags', function () {
  $jobTagsDao = new JobTagsDao();
  Flight::json($jobTagsDao->getAll());
});

Flight::route('GET /job_tags/job/@job_id', function ($job_id) {
  $jobTagsDao = new JobTagsDao();
  $jobTags = $jobTagsDao->getByJobId($job_id);
  if ($jobTags) {
    Flight::json($jobTags);
  } else {
    Flight::jsonHalt(["message" => "No job tags  found for job_id"], 404);
  }
});

Flight::route('GET /job_tags/tag/@tag_id', function ($tag_id) {
  $jobTagsDao = new JobTagsDao();
  $jobTags = $jobTagsDao->getByTagId($tag_id);
  if ($jobTags) {
    Flight::json($jobTags);
  } else {
    Flight::jsonHalt(["message" => "No job tags found for tag_id"], 404);
  }
});

Flight::route('POST /job_tags', function () {
  $jobTagsDao = new JobTagsDao();

  $tagsDao = new TagsDao();
  $jobsDao = new JobsDao();

  $data = Flight::request()->data->getData();

  validateBody(['job_id', 'tag_id'], $data);

  $job_id = $data['job_id'];
  $tag_id = $data['tag_id'];

  $job = $jobsDao->getById($job_id);
  $tag = $tagsDao->getById($tag_id);

  if (!$job) {
    Flight::jsonHalt(["message" => "Job not found"], 404);
  }

  if (!$tag) {
    Flight::jsonHalt(["message" => "Tag not found"], 404);
  }

  if ($jobTagsDao->insert($data)) {
    Flight::json(["message" => "job tag created successfully"], 201);
  } else {
    Flight::jsonHalt((["message" => "Error creating job tag"]), 500);
  }
});
