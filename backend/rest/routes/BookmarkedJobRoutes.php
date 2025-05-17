<?php

Flight::route('GET /bookmarked_jobs', function () {
  try {
    Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
    $bookmarkedJobs = Flight::bookmarkedJobsService()->getAllBookmarkedJobs();
    Flight::json($bookmarkedJobs);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /bookmarked_jobs_for_auth_user', function () {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::APPLICANT]);
    Flight::json(Flight::bookmarkedJobsService()->getBookmarkedJobsForAuthUser());
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /bookmarked_jobs/user/@user_id', function ($user_id) {
  try {
    Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
    $bookmarkedJobs = Flight::bookmarkedJobsService()->getBookmarkedJobsByUserId($user_id);
    Flight::json($bookmarkedJobs);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('POST /bookmarked_jobs', function () {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::APPLICANT]);
    $data = Flight::request()->data->getData();
    $result = Flight::bookmarkedJobsService()->createBookmarkedJob($data);
    Flight::json($result, 201);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});
