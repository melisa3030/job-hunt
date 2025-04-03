<?php
require_once __DIR__ . '/../dao/ApplicationsDao.php';
require_once __DIR__ . '/../dao/UsersDao.php';
require_once __DIR__ . '/../dao/JobsDao.php';
require_once __DIR__ . '/../helpers.php';

enum Status: string
{
  case Pending = 'pending';
  case Accepted = 'accepted';
  case Rejected = 'rejected';
}

Flight::route('GET /applications', function () {
  $applicationsDao = new ApplicationsDao();
  Flight::json($applicationsDao->getAll());
});

Flight::route('GET /applications/job/@job_id', function ($job_id) {
  $applicationsDao = new ApplicationsDao();
  $applications = $applicationsDao->getByJobId($job_id);
  if ($applications) {
    Flight::json($applications);
  } else {
    Flight::jsonHalt(["message" => "No job applications found for job_id"], 404);
  }
});

Flight::route('GET /applications/applicant/@applicant_id', function ($applicant_id) {
  $applicationsDao = new ApplicationsDao();
  $applications = $applicationsDao->getByApplicantId($applicant_id);
  if ($applications) {
    Flight::json($applications);
  } else {
    Flight::jsonHalt(["message" => "No job applications found for applicant_id"], 404);
  }
});

Flight::route('POST /applications', function () {
  $applicationsDao = new ApplicationsDao();

  $usersDao = new UsersDao();
  $jobsDao = new JobsDao();

  $data = Flight::request()->data->getData();

  validateBody(['job_id', 'applicant_id'], $data);

  $job_id = $data['job_id'];
  $applicant_id = $data['applicant_id'];
  $status = $data['status'] ?? 'pending';

  $user = $usersDao->getById($applicant_id);
  $job = $jobsDao->getById($job_id);

  if (!$job) {
    Flight::jsonHalt(["message" => "Job not found"], 404);
  }

  if (!$user) {
    Flight::jsonHalt(["message" => "User not found"], 404);
  }

  try {
    Status::from($status);
  } catch (\ValueError $e) {
    Flight::jsonHalt(["message" => "Invalid status"], 400);
  }

  if ($applicationsDao->insert($data)) {
    Flight::json(["message" => "Job application created successfully"], 201);
  } else {
    Flight::jsonHalt((["message" => "Error creating Application"]), 500);
  }
});

Flight::route('PUT /applications/@id', function ($id) {
  $applicationsDao = new ApplicationsDao();
  $data = Flight::request()->data->getData();

  validateBody(['status'], $data);


  try {
    Status::from($data['status']);
  } catch (\ValueError $e) {
    Flight::jsonHalt(["message" => "Invalid status"], 400);
  }

  if ($applicationsDao->update($id, $data)) {
    Flight::json(["message" => "Job application updated successfully"], 200);
  } else {
    Flight::jsonHalt((["message" => "Error updating job application"]), 500);
  }
});

Flight::route('DELETE /applications/@id', function ($id) {
  $applicationsDao = new ApplicationsDao();

  $application = $applicationsDao->getById($id);

  if (!$application) {
    Flight::jsonHalt(["message" => "Job application not found with provided ID"], 404);
  }

  if ($applicationsDao->delete($id)) {
    Flight::json(["message" => "Job application deleted successfully"]);
  } else {
    Flight::jsonHalt((["message" => "Error deleting job application"]), 500);
  }
});
