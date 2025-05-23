<?php

Flight::route('GET /applications', function () {
  try {
    Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
    Flight::json(Flight::applicationsService()->getAllApplications());
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /applications/job/@job_id', function ($job_id) {
  try {
    Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
    $applications = Flight::applicationsService()->getApplicationsByJobId($job_id);
    Flight::json($applications);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /applications/applicant/@applicant_id', function ($applicant_id) {
  try {
    Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
    $applications = Flight::applicationsService()->getApplicationsByApplicantId($applicant_id);
    Flight::json($applications);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /applications_for_current_auth_user', function () {
  try {
    Flight::authMiddleware()->authorizeRole(Roles::APPLICANT);
    $applications = Flight::applicationsService()->getApplicationsForCurrentAuthUser();
    Flight::json($applications);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /applications_for_company_by_employer_id/@id', function ($id) {
  try {
    Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
    $applications = Flight::applicationsService()->getApplicationsForCompanyByEmployerId($id);
    Flight::json($applications);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /applications_for_company_by_current_employer', function () {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::EMPLOYER, Roles::ADMIN]);
    $applications = Flight::applicationsService()->getApplicationsForCompanyByCurrentEmployer();
    Flight::json($applications);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('POST /applications', function () {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::APPLICANT]);
    $data = Flight::request()->data->getData();
    $result = Flight::applicationsService()->createApplication($data);
    Flight::json($result, 201);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('PUT /applications/@id', function ($id) {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
    $data = Flight::request()->data->getData();
    $result = Flight::applicationsService()->updateApplication($id, $data);
    Flight::json($result);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('DELETE /applications/@id', function ($id) {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::APPLICANT]);
    $result = Flight::applicationsService()->deleteApplication($id);
    Flight::json($result);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});
