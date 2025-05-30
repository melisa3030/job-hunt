<?php

require_once __DIR__ . '/../dao/BookmarkedJobsDao.php';
require_once __DIR__ . '/../../helpers.php';

class BookmarkedJobsService
{
  private $bookmarkedJobsDao;


  public function __construct()
  {
    $this->bookmarkedJobsDao = new BookmarkedJobsDao();
  }
  public function getAllBookmarkedJobs()
  {
    return $this->bookmarkedJobsDao->getAll();
  }

  public function getBookmarkedJobsByUserId($user_id)
  {
    $bookmarkedJobs = $this->bookmarkedJobsDao->getByUserId($user_id);
    if ($bookmarkedJobs) {
      return $bookmarkedJobs;
    } else {
      throw new Exception("No bookmarked jobs found for user", 404);
    }
  }

  public function getBookmarkedJobsByJobIdAndUserId($user_id, $job_id)
  {
    $bookmarkedJob = $this->bookmarkedJobsDao->getByJobIdAndUserId($job_id, $user_id);
    return $bookmarkedJob;
  }

  public function getBookmarkedJobsForAuthUser()
  {
    $user = Flight::get('user');
    if (!$user) {
      throw new Exception("User not authenticated", 401);
    }

    return $this->getBookmarkedJobsByUserId($user->id);
  }

  public function createBookmarkedJob($data)
  {
    $user = Flight::get('user');
    if (!$user) {
      throw new Exception("User not authenticated", 401);
    }

    $requiredFields = ['job_id'];
    validateBody($requiredFields, $data);

    $user_id = $user->id;
    $job_id = $data['job_id'];

    $existingBookmark = $this->getBookmarkedJobsByJobIdAndUserId($user_id, $job_id);

    if ($existingBookmark) {
      throw new Exception("Job already bookmarked by user", 409);
    }

    $user = Flight::userService()->getUserById($user_id);
    $job = Flight::jobsService()->getJobById($job_id);

    if (!$user) {
      throw new Exception("User not found", 404);
    }

    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    $data['user_id'] = $user_id;

    error_log("Creating bookmark for user_id: $user_id, job_id: $job_id");
    error_log("Data to insert: " . json_encode($data));

    try {
      $result = $this->bookmarkedJobsDao->insert($data);
      error_log("Insert result: " . var_export($result, true));

      // For tables without auto-increment, check if result is not false
      // The insert method should return true/false for success/failure
      if ($result !== false) {
        return ["message" => "Job bookmarked successfully"];
      } else {
        throw new Exception("Failed to insert bookmark into database", 500);
      }
    } catch (Exception $e) {
      error_log("Exception during bookmark insert: " . $e->getMessage());
      throw new Exception("Error bookmarking job: " . $e->getMessage(), 500);
    }
  }

  public function deleteBookmarkedJob($data)
  {
    $user = Flight::get('user');
    if (!$user) {
      throw new Exception("User not authenticated", 401);
    }

    $user_id = $user->id;

    $requiredFields = ['job_id'];
    validateBody($requiredFields, $data);

    $job_id = $data['job_id'] ?? null;

    $existingBookmark = $this->getBookmarkedJobsByJobIdAndUserId($user_id, $job_id);

    if (!$existingBookmark) {
      throw new Exception("Job not bookmarked by user", 404);
    }

    if ($this->bookmarkedJobsDao->deleteBookmarkedJob($job_id, $user_id)) {
      return ["message" => "Job unbookmarked successfully"];
    } else {
      throw new Exception("Error unbookmarking job", 500);
    }
  }
}
