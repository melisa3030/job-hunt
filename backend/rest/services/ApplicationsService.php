<?php

require_once __DIR__ . '/../dao/ApplicationsDao.php';
require_once __DIR__ . '/../../data/Status.php';
require_once __DIR__ . '/../../helpers.php';

class ApplicationsService
{
  private $applicationsDao;


  public function __construct()
  {
    $this->applicationsDao = new ApplicationsDao();
  }
  public function getAllApplications()
  {
    return $this->applicationsDao->getAll();
  }

  public function getApplicationsByJobId($job_id)
  {
    $applications = $this->applicationsDao->getByJobId($job_id);
    return $applications ?: [];
  }

  public function getApplicationsByApplicantId($applicant_id)
  {
    $applications = $this->applicationsDao->getByApplicantId($applicant_id);
    return $applications ?: [];
  }

  public function getApplicationsForCurrentAuthUser()
  {
    $user = Flight::get('user');
    $applications = $this->applicationsDao->getByApplicantId($user->id);
    return $applications ?: [];
  }

  public function getApplicationsForCompanyByEmployerId($id)
  {
    $employer = Flight::userService()->getUserById($id);
    if (!$employer) {
      throw new Exception("Employer not found", 404);
    }

    try {
      $jobs = Flight::jobsService()->getJobsByEmployerId($id);

      // If we get here, jobs were found, continue with the rest of the method
      $job_ids = array_map(function ($job) {
        return $job['id'];
      }, $jobs);

      $applications = $this->applicationsDao->getByJobIds($job_ids);
      return $applications ?: [];
    } catch (Exception $e) {
      // If the exception message is "No jobs found for this employer", return an empty array
      if ($e->getCode() == 404 && strpos($e->getMessage(), "No jobs found") !== false) {
        return [];
      }
      // Re-throw any other exception
      throw $e;
    }
  }

  public function getApplicationsForCompanyByCurrentEmployer()
  {
    $user = Flight::get('user');
    if (!$user) {
      throw new Exception("User not authenticated", 401);
    }
    $userRole = Roles::from($user->role);
    if ($userRole !== Roles::EMPLOYER && $userRole !== Roles::ADMIN) {
      throw new Exception("Access denied: Only employers can view company applications", 403);
    }

    return $this->getApplicationsForCompanyByEmployerId($user->id);
  }

  public function createApplication($data)
  {
    $user = Flight::get('user');
    if (!$user) {
      throw new Exception("User not authenticated", 401);
    }

    validateBody(['job_id'], $data);

    $job_id = $data['job_id'];
    $status = $data['status'] ?? Status::PENDING->value;

    $userExists = Flight::userService()->getUserById($user->id);
    $jobExists = Flight::jobsService()->getJobById($job_id);

    // if user already applied for this job, return an error
    $existingApplication = $this->applicationsDao->getByJobIdAndApplicantId($job_id, $user->id);
    if ($existingApplication) {
      throw new Exception("You have already applied for this job", 400);
    }

    if (!$userExists) {
      throw new Exception("User not found", 404);
    }

    if (!$jobExists) {
      throw new Exception("Job not found", 404);
    }

    try {
      Status::from($status);
    } catch (ValueError $e) {
      throw new Exception("Invalid value for status. Must be PENDING, ACCEPTED, or REJECTED.", 400);
    }

    $data['applicant_id'] = $user->id;

    if ($this->applicationsDao->insert($data)) {
      return ["message" => "Application created successfully"];
    } else {
      throw new Exception("Error creating application", 500);
    }
  }

  public function updateApplication($application_id, $data)
  {
    $user = Flight::get('user');
    validateBody(['status'], $data);

    $status = $data['status'];

    try {
      Status::from($status);
    } catch (ValueError $e) {
      throw new Exception("Invalid value for status. Must be PENDING, ACCEPTED, or REJECTED.", 400);
    }

    // Get the application and related job
    $application = $this->applicationsDao->getById($application_id);
    if (!$application) {
      throw new Exception("Application not found", 404);
    }

    $job = Flight::jobsService()->getJobById($application['job_id']);
    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    // Check if the user is the employer who posted the job
    $userRole = Roles::from($user->role);
    if ($userRole !== Roles::ADMIN && $job['posted_by'] != $user->id) {
      throw new Exception("Forbidden: You can only update applications for jobs you posted", 403);
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
