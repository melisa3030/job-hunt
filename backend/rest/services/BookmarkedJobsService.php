<?php

require_once __DIR__ . '/../dao/BookmarkedJobsDao.php';
require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../dao/JobsDao.php';
require_once __DIR__ . '/../../helpers.php';

class BookmarkedJobsService
{
  private $bookmarkedJobsDao;
  private $usersDao;
  private $jobsDao;

  public function __construct()
  {
    $this->bookmarkedJobsDao = new BookmarkedJobsDao();
    $this->usersDao = new UsersDao();
    $this->jobsDao = new JobsDao();
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

  public function createBookmarkedJob($data)
  {
    validateBody(['user_id', 'job_id'], $data);

    $user_id = $data['user_id'];
    $job_id = $data['job_id'];

    $user = $this->usersDao->getById($user_id);
    $job = $this->jobsDao->getById($job_id);

    if (!$user) {
      throw new Exception("User not found", 404);
    }

    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    if ($this->bookmarkedJobsDao->insert($data)) {
      return ["message" => "Job bookmarked successfully"];
    } else {
      throw new Exception("Error bookmarking job", 500);
    }
  }
}
