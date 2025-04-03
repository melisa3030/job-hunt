<?php
require_once __DIR__ . '/../dao/JobsDao.php';
require_once __DIR__ . '/../dao/CompaniesDao.php';
require_once __DIR__ . '/../dao/JobTitlesDao.php';
require_once __DIR__ . '/../dao/JobCategoriesDao.php';
require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../helpers.php';

enum WorkType: string
{
  case Remote = 'Remote';
  case Hybrid = 'Hybrid';
  case OnSite = 'On-site';
}

enum ExperienceLevel: string
{
  case Junior = 'Junior';
  case Intermediate = 'Intermediate';
  case Senior = 'Senior';
}

Flight::route('GET /jobs', function () {
  $jobsDao = new JobsDao();
  Flight::json($jobsDao->getAll());
});

Flight::route('GET /jobs/@id', function ($id) {
  $jobsDao = new JobsDao();
  $job = $jobsDao->getById($id);
  if ($job) {
    Flight::json($job);
  } else {
    Flight::jsonHalt((["message" => "Job not found"]), 404);
  }
});

Flight::route('PUT /jobs/@id', function ($id) {
  $jobsDao = new JobsDao();
  $companiesDao = new CompaniesDao();
  $jobTitlesDao = new JobTitlesDao();
  $usersDao = new UsersDao();
  $categoriesDao = new JobCategoriesDao();
  $data = Flight::request()->data->getData();

  if (isset($data['company_id'])) {
    $companyId = $data['company_id'];
    if (!$companiesDao->getById($companyId)) {
      Flight::jsonHalt(["message" => "Company not found"], 404);
    }
  }

  if (isset($data['job_title_id'])) {
    $jobTitleId = $data['job_title_id'];
    if (!$jobTitlesDao->getById($jobTitleId)) {
      Flight::jsonHalt(["message" => "Job title not found"], 404);
    }
  }

  if (isset($data['posted_by'])) {
    $postedBy = $data['posted_by']; // user id
    if (!$usersDao->getById($postedBy)) {
      Flight::jsonHalt(["message" => "User not found"], 404);
    }
  }

  if (isset($data['category_id'])) {
    $categoryId = $data['category_id'];
    if (!$categoriesDao->getById($categoryId)) {
      Flight::jsonHalt(["message" => "Job category not found"], 404);
    }
  }

  if ($jobsDao->update($id, $data)) {
    Flight::json(["message" => "Job updated successfully"], 200);
  } else {
    Flight::jsonHalt((["message" => "Error updating job"]), 500);
  }
});


Flight::route('POST /jobs', function () {
  $jobsDao = new JobsDao();
  $companiesDao = new CompaniesDao();
  $jobTitlesDao = new JobTitlesDao();
  $usersDao = new UsersDao();
  $categoriesDao = new JobCategoriesDao();
  $data = Flight::request()->data->getData();

  validateBody(['job_title_id', 'company_id', 'category_id', 'description', 'city', 'country', 'work_type', 'experience_level', 'salary', 'posted_by', 'expires_at'], $data);

  $companyId = $data['company_id'];
  $jobTitleId = $data['job_title_id'];
  $categoryId = $data['category_id'];
  $postedBy = $data['posted_by']; // user id

  if (!$companiesDao->getById($companyId)) {
    Flight::jsonHalt(["message" => "Company not found"], 404);
  }

  if (!$jobTitlesDao->getById($jobTitleId)) {
    Flight::jsonHalt(["message" => "Job title not found"], 404);
  }

  if (!$usersDao->getById($postedBy)) {
    Flight::jsonHalt(["message" => "User not found"], 404);
  }

  if (!$categoriesDao->getById($categoryId)) {
    Flight::jsonHalt(["message" => "Job category not found"], 404);
  }

  try {
    WorkType::from($data['work_type']);
  } catch (\ValueError $e) {
    Flight::jsonHalt(["message" => "Invalid work_type"], 400);
  }

  try {
    ExperienceLevel::from($data['experience_level']);
  } catch (\ValueError $e) {
    Flight::jsonHalt(["message" => "Invalid experience_level"], 400);
  }

  if ($jobsDao->insert($data)) {
    Flight::json(["message" => "Job created successfully"], 201);
  } else {
    Flight::jsonHalt((["message" => "Error creating job"]), 500);
  }
});

Flight::route('DELETE /jobs/@id', function ($id) {
  $jobsDao = new JobsDao();

  $job = $jobsDao->getById($id);

  if (!$job) {
    Flight::jsonHalt(["message" => "Job not found with provided ID"], 404);
  }

  if ($jobsDao->delete($id)) {
    Flight::json(["message" => "Job deleted successfully"]);
  } else {
    Flight::jsonHalt((["message" => "Error deleting job"]), 500);
  }
});
