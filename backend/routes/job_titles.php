<?php

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../dao/JobTitlesDao.php';

Flight::route('GET /job_titles', function () {
    $jobTitlesDao = new JobTitlesDao();
    Flight::json($jobTitlesDao->getAll(), 200);
});

Flight::route('GET /job_titles/@id', function ($id) {
    $jobTitlesDao = new JobTitlesDao();
    $jobTitle = $jobTitlesDao->getById($id);
    if ($jobTitle) {
        Flight::json($jobTitle, 200);
    } else {
        Flight::jsonHalt(['message' => 'Job title not found'], 404);
    }
});

Flight::route('POST /job_titles', function () {
    $jobTitlesDao = new JobTitlesDao();
    $data = Flight::request()->data->getData();

    validateBody(['name'], $data);

    $existingJobTitle = $jobTitlesDao->getByName($data['name']);
    if ($existingJobTitle) {
        Flight::jsonHalt(['message' => 'Job title already exists'], 409);
    }

    if ($jobTitlesDao->insert($data)) {
        Flight::json(['message' => 'Job title created successfully'], 201);
    } else {
        Flight::jsonHalt(['message' => 'Error creating job title'], 500);
    }
});

Flight::route('PUT /job_titles/@id', function ($id) {
    $jobTitlesDao = new JobTitlesDao();
    $data = Flight::request()->data->getData();

    $jobTitle = $jobTitlesDao->getById($id);

    if (!$jobTitle) {
        Flight::jsonHalt(['message' => 'Job title not found'], 404);
    }

    if ($jobTitlesDao->update($id, $data)) {
        Flight::json(['message' => 'Job title updated successfully'], 200);
    } else {
        Flight::jsonHalt(['message' => 'Error updating job title'], 500);
    }
});

Flight::route('DELETE /job_titles/@id', function ($id) {
    $jobTitlesDao = new JobTitlesDao();

    $jobTitle = $jobTitlesDao->getById($id);

    if (!$jobTitle) {
        Flight::jsonHalt(['message' => 'Job title not found'], 404);
    }

    if ($jobTitlesDao->delete($id)) {
        Flight::json(['message' => 'Job title deleted successfully'], 200);
    } else {
        Flight::jsonHalt(['message' => 'Error deleting job title'], 500);
    }
});
