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

    $user = Flight::userService()->getUserById($user_id);
    $job = Flight::jobsService()->getJobById($job_id);

    if (!$user) {
      throw new Exception("User not found", 404);
    }

    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    $data['user_id'] = $user_id;

    if ($this->bookmarkedJobsDao->insert($data)) {
      return ["message" => "Job bookmarked successfully"];
    } else {
      throw new Exception("Error bookmarking job", 500);
    }
  }
}
