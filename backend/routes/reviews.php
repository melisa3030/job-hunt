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

Flight::route('GET /reviews', function () {
    $dao = new ReviewsDao();
    Flight::json($dao->getAll(), 200);
});

Flight::route('GET /reviews/@id', function ($id) {
    $dao = new ReviewsDao();
    $review = $dao->getById($id);
    if ($review) {
        Flight::json($review, 200);
    } else {
        Flight::json(['message' => 'Review not found'], 404);
    }
});


Flight::route('POST /reviews', function () {
    $reviewDAO = new ReviewsDAO();
    $data = Flight::request()->data->getData();

    // Validate required fields
    $requiredFields = ['company_id', 'job_title_id', 'rating', 'positive_review', 'negative_review', 'currently_working', 'recommend', 'employment_type', 'employment_duration'];
    validateBody($requiredFields, $data);

    $companiesDAO = new CompaniesDao();
    $jobTitlesDAO = new JobTitlesDao();

    if (!$companiesDAO->getById($data['company_id'])) {
        Flight::jsonHalt(['error' => 'Invalid company_id. Company does not exist.'], 404);
        return;
    }

    if (!$jobTitlesDAO->getById($data['job_title_id'])) {
        Flight::jsonHalt(['error' => 'Invalid job_title_id. Job title does not exist.'], 404);
        return;
    }

    // Validate ENUM values
    try {
        CurrentlyWorking::from(trim($data['currently_working']));
    } catch (\ValueError $e) {
        Flight::jsonHalt(['error' => 'Invalid value for currently_working. Must be yes or no.'], 400);
        return;
    }

    try {
        Recommend::from(trim($data['recommend']));
    } catch (\ValueError $e) {
        Flight::jsonHalt(['error' => 'Invalid value for recommend. Must be yes or no.'], 400);
        return;
    }

    try {
        EmploymentType::from(trim($data['employment_type']));
    } catch (\ValueError $e) {
        Flight::jsonHalt(['error' => 'Invalid value for employment_type. Must be Full Time, Part Time, Contract, or Internship.'], 400);
        return;
    }

    try {
        EmploymentDuration::from(trim($data['employment_duration']));
    } catch (\ValueError $e) {
        Flight::jsonHalt(['error' => 'Invalid value for employment_duration. Must be Less than a year, 1-2 years, 3-5 years, or More than 5 years.'], 400);
        return;
    }

    $reviewData = [
        'company_id' => $data['company_id'],
        'job_title_id' => $data['job_title_id'],
        'rating' => $data['rating'],
        'positive_review' => $data['positive_review'],
        'negative_review' => $data['negative_review'],
        'currently_working' => $data['currently_working'],
        'recommend' => $data['recommend'],
        'employment_type' => $data['employment_type'],
        'employment_duration' => $data['employment_duration'],
    ];

    $success = $reviewDAO->insert($reviewData);

    if ($success) {
        Flight::json(['message' => 'Review created successfully'], 201);
    } else {
        Flight::jsonHalt(['error' => 'Failed to create review'], 500);
    }
});

Flight::route('PUT /reviews/@id', function ($id) {
    $reviewDAO = new ReviewsDAO();
    $data = Flight::request()->data->getData();

    // Validate required fields
    $requiredFields = ['company_id', 'job_title_id', 'rating', 'positive_review', 'negative_review', 'currently_working', 'recommend', 'employment_type', 'employment_duration'];
    validateBody($requiredFields, $data);

    $companiesDAO = new CompaniesDao();
    $jobTitlesDAO = new JobTitlesDao();

    if (!$companiesDAO->getById($data['company_id'])) {
        Flight::jsonHalt(['error' => 'Invalid company_id. Company does not exist.'], 404);
        return;
    }

    if (!$jobTitlesDAO->getById($data['job_title_id'])) {
        Flight::jsonHalt(['error' => 'Invalid job_title_id. Job title does not exist.'], 404);
        return;
    }

    try {
        CurrentlyWorking::from(trim($data['currently_working']));
    } catch (\ValueError $e) {
        Flight::jsonHalt(['error' => 'Invalid value for currently_working. Must be yes or no.'], 400);
        return;
    }

    try {
        Recommend::from(trim($data['recommend']));
    } catch (\ValueError $e) {
        Flight::jsonHalt(['error' => 'Invalid value for recommend. Must be yes or no.'], 400);
        return;
    }

    try {
        EmploymentType::from(trim($data['employment_type']));
    } catch (\ValueError $e) {
        Flight::jsonHalt(['error' => 'Invalid value for employment_type. Must be Full Time, Part Time, Contract, or Internship.'], 400);
        return;
    }

    try {
        EmploymentDuration::from(trim($data['employment_duration']));
    } catch (\ValueError $e) {
        Flight::jsonHalt(['error' => 'Invalid value for employment_duration. Must be Less than a year, 1-2 years, 3-5 years, or More than 5 years.'], 400);
        return;
    }

    $reviewData = [
        'company_id' => $data['company_id'],
        'job_title_id' => $data['job_title_id'],
        'rating' => $data['rating'],
        'positive_review' => $data['positive_review'],
        'negative_review' => $data['negative_review'],
        'currently_working' => $data['currently_working'],
        'recommend' => $data['recommend'],
        'employment_type' => $data['employment_type'],
        'employment_duration' => $data['employment_duration'],
    ];

    $success = $reviewDAO->update($id, $reviewData);

    if ($success) {
        Flight::json(['message' => 'Review updated successfully'], 200);
    } else {
        Flight::jsonHalt(['error' => 'Failed to update review'], 500);
    }
});

Flight::route('DELETE /reviews/@id', function ($id) {
    $reviewDAO = new ReviewsDAO();
    $review = $reviewDAO->getById($id);

    if (!$review) {
        Flight::jsonHalt(['error' => 'Review not found'], 404);
        return;
    }

    $success = $reviewDAO->delete($id);

    if ($success) {
        Flight::json(['message' => 'Review deleted successfully'], 200);
    } else {
        Flight::jsonHalt(['error' => 'Failed to delete review'], 500);
    }
});
