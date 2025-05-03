<?php

require_once __DIR__ . '/../dao/ApplicationsDao.php';
require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../dao/JobsDao.php';
require_once __DIR__ . '/../../helpers.php';

enum Status: string
{
  case PENDING = 'PENDING';
  case ACCEPTED = 'ACCEPTED';
  case REJECTED = 'REJECTED';
}

class ApplicationsService
{
  private $applicationsDao;
  private $usersDao;
  private $jobsDao;

  public function __construct()
  {
    $this->applicationsDao = new ApplicationsDao();
    $this->usersDao = new UsersDao();
    $this->jobsDao = new JobsDao();
  }
  public function getAllApplications()
  {
    return $this->applicationsDao->getAll();
  }

  public function getApplicationsByJobId($job_id)
  {
    $applications = $this->applicationsDao->getByJobId($job_id);
    if ($applications) {
      return $applications;
    } else {
      throw new Exception("No job applications found for job", 404);
    }
  }

  public function getApplicationsByApplicantId($applicant_id)
  {
    $applications = $this->applicationsDao->getByApplicantId($applicant_id);
    if ($applications) {
      return $applications;
    } else {
      throw new Exception("No job applications found for applicant", 404);
    }
  }

  public function createApplication($data)
  {
    validateBody(['job_id', 'applicant_id'], $data);

    $job_id = $data['job_id'];
    $applicant_id = $data['applicant_id'];
    $status = $data['status'] ?? Status::PENDING->value;

    $user = $this->usersDao->getById($applicant_id);
    $job = $this->jobsDao->getById($job_id);

    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    if (!$user) {
      throw new Exception("User not found", 404);
    }

    try {
      Status::from($status);
    } catch (ValueError $e) {
      throw new Exception("Invalid value for status. Must be PENDING, ACCEPTED, or REJECTED.", 400);
    }

    if ($this->applicationsDao->insert($data)) {
      return ["message" => "Application created successfully"];
    } else {
      throw new Exception("Error creating application", 500);
    }
  }

  public function updateApplication($application_id, $data)
  {
    validateBody(['status'], $data);

    $status = $data['status'];

    try {
      Status::from($status);
    } catch (ValueError $e) {
      throw new Exception("Invalid value for status. Must be PENDING, ACCEPTED, or REJECTED.", 400);
    }

    if ($this->applicationsDao->update($application_id, $data)) {
      return ["message" => "Application updated successfully"];
    } else {
      throw new Exception("Error updating application", 500);
    }
  }

  public function deleteApplication($application_id)
  {
    if ($this->applicationsDao->delete($application_id)) {
      return ["message" => "Application deleted successfully"];
    } else {
      throw new Exception("Error deleting application", 500);
    }
  }
}
