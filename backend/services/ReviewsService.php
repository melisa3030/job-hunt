<?php

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../dao/ReviewsDao.php';
require_once __DIR__ . '/../dao/CompaniesDao.php';
require_once __DIR__ . '/../dao/JobTitlesDao.php';

enum CurrentlyWorking: string
{
  case YES = 'yes';
  case NO = 'no';
}

enum Recommend: string
{
  case YES = 'yes';
  case NO = 'no';
}

enum EmploymentType: string
{
  case FULL_TIME = 'Full Time';
  case PART_TIME = 'Part Time';
  case CONTRACT = 'Contract';
  case INTERNSHIP = 'Internship';
}

enum EmploymentDuration: string
{
  case LESS_THAN_A_YEAR = 'Less than a year';
  case ONE_TO_TWO_YEARS = '1-2 years';
  case THREE_TO_FIVE_YEARS = '3-5 years';
  case MORE_THAN_FIVE_YEARS = 'More than 5 years';
}

class ReviewsService
{
  private $dao;

  public function __construct()
  {
    $this->dao = new ReviewsDao();
  }

  public function getAll()
  {
    return $this->dao->getAll();
  }

  public function getById($id)
  {
    $review = $this->dao->getById($id);
    if ($review) {
      return $review;
    } else {
      throw new Exception('Review not found', 404);
    }
  }

  public function createReview($data)
  {
    $requiredFields = ['company_id', 'job_title_id', 'rating', 'positive_review', 'negative_review', 'currently_working', 'recommend', 'employment_type', 'employment_duration'];
    validateBody($requiredFields, $data);

    $companiesDAO = new CompaniesDao();
    $jobTitlesDAO = new JobTitlesDao();

    if (!$companiesDAO->getById($data['company_id'])) {
      throw new Exception('Invalid company_id. Company does not exist.', 404);
    }

    if (!$jobTitlesDAO->getById($data['job_title_id'])) {
      throw new Exception('Invalid job_title_id. Job title does not exist.', 404);
    }

    // Validate enum values
    try {
      CurrentlyWorking::from(trim($data['currently_working']));
    } catch (\ValueError $e) {
      throw new Exception('Invalid value for currently_working. Must be yes or no.', 400);
    }

    try {
      Recommend::from(trim($data['recommend']));
    } catch (\ValueError $e) {
      throw new Exception('Invalid value for recommend. Must be yes or no.', 400);
    }

    try {
      EmploymentType::from(trim($data['employment_type']));
    } catch (\ValueError $e) {
      throw new Exception('Invalid value for employment_type. Must be Full Time, Part Time, Contract, or Internship.', 400);
    }

    try {
      EmploymentDuration::from(trim($data['employment_duration']));
    } catch (\ValueError $e) {
      throw new Exception('Invalid value for employment_duration. Must be Less than a year, 1-2 years, 3-5 years, or More than 5 years.', 400);
    }



    if (!$this->dao->insert($data)) {
      throw new Exception('Error creating review', 500);
    }

    return ['message' => 'Review created successfully'];
  }

  public function updateReview($id, $data)
  {
    $review = $this->getById($id);

    if (!$review) {
      throw new Exception('Review not found', 404);
    }

    // Check if at least one required field is present
    $requiredFields = ['company_id', 'job_title_id', 'rating', 'positive_review', 'negative_review', 'currently_working', 'recommend', 'employment_type', 'employment_duration'];
    $hasRequiredField = false;

    foreach ($requiredFields as $field) {
      if (isset($data[$field]) && !empty($data[$field])) {
        $hasRequiredField = true;
        break;
      }
    }

    if (!$hasRequiredField) {
      throw new Exception('Update requires at least one of these fields: ' . implode(', ', $requiredFields), 400);
    }

    // Validate enum values
    if (isset($data['currently_working'])) {
      try {
        CurrentlyWorking::from(trim($data['currently_working']));
      } catch (\ValueError $e) {
        throw new Exception('Invalid value for currently_working. Must be yes or no.', 400);
      }
    }

    if (isset($data['recommend'])) {
      try {
        Recommend::from(trim($data['recommend']));
      } catch (\ValueError $e) {
        throw new Exception('Invalid value for recommend. Must be yes or no.', 400);
      }
    }

    if (isset($data['employment_type'])) {
      try {
        EmploymentType::from(trim($data['employment_type']));
      } catch (\ValueError $e) {
        throw new Exception('Invalid value for employment_type. Must be Full Time, Part Time, Contract, or Internship.', 400);
      }
    }

    if (isset($data['employment_duration'])) {
      try {
        EmploymentDuration::from(trim($data['employment_duration']));
      } catch (\ValueError $e) {
        throw new Exception('Invalid value for employment_duration. Must be Less than a year, 1-2 years, 3-5 years, or More than 5 years.', 400);
      }
    }

    if (!$this->dao->update($id, $data)) {
      throw new Exception('Error updating review', 500);
    }

    return ['message' => 'Review updated successfully'];
  }

  public function deleteReview($id)
  {
    $review = $this->getById($id);

    if (!$review) {
      throw new Exception('Review not found', 404);
    }

    if (!$this->dao->delete($id)) {
      throw new Exception('Error deleting review', 500);
    }

    return ['message' => 'Review deleted successfully'];
  }
}
