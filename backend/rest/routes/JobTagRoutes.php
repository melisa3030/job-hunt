<?php

Flight::route('GET /job_tags', function () {
  Flight::json(Flight::jobTagsService()->getAllJobTags(), 200);
});

Flight::route('GET /job_tags/job/@job_id', function ($job_id) {
  try {
    $jobTags = Flight::jobTagsService()->getJobTagsByJobId($job_id);
    Flight::json($jobTags, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /job_tags/tag/@tag_id', function ($tag_id) {
  try {
    $jobTags = Flight::jobTagsService()->getJobTagsByTagId($tag_id);
    Flight::json($jobTags, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('POST /job_tags', function () {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
    $data = Flight::request()->data->getData();
    $result = Flight::jobTagsService()->createJobTag($data);
    Flight::json($result, 201);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('DELETE /job_tags', function () {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
    $data = Flight::request()->data->getData();
    $result = Flight::jobTagsService()->deleteJobTag($data);
    Flight::json($result, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});
