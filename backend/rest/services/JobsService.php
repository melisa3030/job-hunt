<?php

require_once __DIR__ . '/../dao/JobsDao.php';
require_once __DIR__ . '/../dao/CompaniesDao.php';
require_once __DIR__ . '/../dao/JobTitlesDao.php';
require_once __DIR__ . '/../dao/JobCategoriesDao.php';
require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../../helpers.php';

enum WorkType: string
{
  case Remote = 'REMOTE';
  case Hybrid = 'HYBRID';
  case OnSite = 'ON-SITE';
}

enum ExperienceLevel: string
{
  case Junior = 'JUNIOR';
  case Intermediate = 'INTERMEDIATE';
  case Senior = 'SENIOR';
}

class JobsService
{
  private $dao;
  private $companiesDao;
  private $jobTitlesDao;
  private $usersDao;
  private $jobCategoriesDao;

  public function __construct()
  {
    $this->dao = new JobsDao();
    $this->companiesDao = new CompaniesDao();
    $this->jobTitlesDao = new JobTitlesDao();
    $this->usersDao = new UsersDao();
    $this->jobCategoriesDao = new JobCategoriesDao();
  }

  public function getAllJobs()
  {
    return $this->dao->getAll();
  }

  public function getJobById($id)
  {
    $job = $this->dao->getById($id);
    if ($job) {
      return $job;
    } else {
      throw new Exception("Job not found", 404);
    }
  }

  public function createJob($data)
  {
    $requiredFields = ['job_title_id', 'company_id', 'category_id', 'description', 'city', 'country', 'work_type', 'experience_level', 'salary', 'posted_by', 'expires_at'];
    validateBody($requiredFields, $data);


    if (!$this->companiesDao->getById($data['company_id'])) {
      throw new Exception("Company not found", 404);
    }
    if (!$this->jobTitlesDao->getById($data['job_title_id'])) {
      throw new Exception("Job title not found", 404);
    }
    if (!$this->usersDao->getById($data['posted_by'])) {
      throw new Exception("User not found", 404);
    }
    if (!$this->jobCategoriesDao->getById($data['category_id'])) {
      throw new Exception("Category not found", 404);
    }

    // Validate enum values
    try {
      WorkType::from(trim($data['work_type']));
    } catch (\ValueError $e) {
      throw new Exception("Invalid value for work_type. Must be REMOTE, HYBRID, or ON-SITE.", 400);
    }

    try {
      ExperienceLevel::from(trim($data['experience_level']));
    } catch (\ValueError $e) {
      throw new Exception("Invalid value for experience_level. Must be JUNIOR, INTERMEDIATE, or SENIOR.", 400);
    }

    if (!$this->dao->insert($data)) {
      throw new Exception("Error creating job", 500);
    }

    return ["message" => "Job created successfully"];
  }

  public function updateJob($id, $data)
  {
    $job = $this->dao->getById($id);
    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    $requiredFields = ['job_title_id', 'company_id', 'category_id', 'description', 'city', 'country', 'work_type', 'experience_level', 'salary', 'posted_by', 'expires_at'];
    $hasRequiredField = false;

    foreach ($requiredFields as $field) {
      if (isset($data[$field]) && !empty($data[$field])) {
        $hasRequiredField = true;
        break;
      }
    }

    if (!$hasRequiredField) {
      throw new Exception("Update requires at least one of these fields: " . implode(', ', $requiredFields), 400);
    }

    // Validate only the fields that are present in the request
    if (isset($data['company_id']) && !$this->companiesDao->getById($data['company_id'])) {
      throw new Exception("Company not found", 404);
    }
    if (isset($data['job_title_id']) && !$this->jobTitlesDao->getById($data['job_title_id'])) {
      throw new Exception("Job title not found", 404);
    }
    if (isset($data['posted_by']) && !$this->usersDao->getById($data['posted_by'])) {
      throw new Exception("User not found", 404);
    }
    if (isset($data['category_id']) && !$this->jobCategoriesDao->getById($data['category_id'])) {
      throw new Exception("Category not found", 404);
    }

    // Validate enum values only if they are present
    if (isset($data['work_type'])) {
      try {
        WorkType::from(trim($data['work_type']));
      } catch (\ValueError $e) {
        throw new Exception("Invalid value for work_type. Must be REMOTE, HYBRID, or ON-SITE.", 400);
      }
    }

    if (isset($data['experience_level'])) {
      try {
        ExperienceLevel::from(trim($data['experience_level']));
      } catch (\ValueError $e) {
        throw new Exception("Invalid value for experience_level. Must be JUNIOR, INTERMEDIATE, or SENIOR.", 400);
      }
    }

    return ["message" => "Job updated successfully"];
  }

  public function deleteJob($id)
  {
    $job = $this->dao->getById($id);
    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    if (!$this->dao->delete($id)) {
      throw new Exception("Error deleting job", 500);
    }

    return ["message" => "Job deleted successfully"];
  }
}
