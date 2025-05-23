<?php


Flight::route('GET /jobs', function () {
    return Flight::json(Flight::jobsService()->getAllJobs());
});

Flight::route('GET /jobs/@id', function ($id) {
    try {
        $job = Flight::jobsService()->getJobById($id);
        Flight::json($job, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('GET /jobs/employer/@id', function ($id) {
    try {
        Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
        $jobIds = Flight::jobsService()->getJobsByEmployerId($id);
        Flight::json($jobIds, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('GET /jobs_for_auth_user', function () {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::EMPLOYER, Roles::ADMIN]);
        $reviews = Flight::jobsService()->getJobsForAuthUser();
        Flight::json($reviews, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('POST /jobs', function () {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
        $data = Flight::request()->data->getData();
        $result = Flight::jobsService()->createJob($data);
        Flight::json($result, 201);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('PUT /jobs/@id', function ($id) {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
        $user = Flight::get('user');
        $data = Flight::request()->data->getData();
        $result = Flight::jobsService()->updateJob($id, $data, $user);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});


Flight::route('DELETE /jobs/@id', function ($id) {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
        $user = Flight::get('user');
        $result = Flight::jobsService()->deleteJob($id, $user);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});
