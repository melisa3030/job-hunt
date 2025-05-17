<?php

Flight::route('GET /reviews', function () {
    Flight::json(Flight::reviewsService()->getAll(), 200);
});

Flight::route('GET /reviews/@id', function ($id) {
    try {
        $review = Flight::reviewsService()->getById($id);
        Flight::json($review, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('GET /reviews/user/@user_id', function ($user_id) {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::APPLICANT]);
        $reviews = Flight::reviewsService()->getByUserId($user_id);
        Flight::json($reviews, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('GET /reviews_for_auth_user', function () {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::APPLICANT, Roles::ADMIN]);
        $reviews = Flight::reviewsService()->getReviewsForAuthUser();
        Flight::json($reviews, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('GET /reviews/company/@company_id', function ($company_id) {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::APPLICANT]);
        $reviews = Flight::reviewsService()->getByCompanyId($company_id);
        Flight::json($reviews, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('GET /reviews/job_title/@job_title_id', function ($job_title_id) {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::APPLICANT]);
        $reviews = Flight::reviewsService()->getByJobTitleId($job_title_id);
        Flight::json($reviews, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('POST /reviews', function () {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::APPLICANT, Roles::ADMIN]);
        $data = Flight::request()->data->getData();
        $result = Flight::reviewsService()->createReview($data);
        Flight::json($result, 201);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('PUT /reviews/@id', function ($id) {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::APPLICANT, Roles::ADMIN]);
        $user = Flight::get('user');
        $data = Flight::request()->data->getData();
        $result = Flight::reviewsService()->updateReview($id, $data, $user);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('DELETE /reviews/@id', function ($id) {
    try {
        Flight::authMiddleware()->authorizeRoles([Roles::APPLICANT, Roles::ADMIN]);
        $user = Flight::get('user');
        $result = Flight::reviewsService()->deleteReview($id, $user);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});
