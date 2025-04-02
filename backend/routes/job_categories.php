<?php

require_once __DIR__ . '/../dao/JobCategoriesDao.php';
require_once __DIR__ . '/../helpers.php';

Flight::route('GET /job_categories', function () {
    $dao = new JobCategoriesDao();
    Flight::json($dao->getAll(), 200);
});

Flight::route('GET /job_categories/@id', function ($id) {
    $dao = new JobCategoriesDao();
    $category = $dao->getById($id);
    if ($category) {
        Flight::json($category, 200);
    } else {
        Flight::json(['message' => 'Job Category not found'], 404);
    }
});

Flight::route('POST /job_categories', function () {
    $dao = new JobCategoriesDao();
    $data = Flight::request()->data->getData();

    validateBody(['name'], $data);

    $existingCategory = $dao->getByName($data['name']);
    if ($existingCategory) {
        Flight::json(['message' => 'Job Category already exists'], 409);
    }

    if ($dao->insert($data)) {
        Flight::json(['message' => 'Job Category created successfully'], 201);
    } else {
        Flight::json(['message' => 'Error creating Job Category'], 500);
    }
});

Flight::route('PUT /job_categories/@id', function ($id) {
    $dao = new JobCategoriesDao();
    $data = Flight::request()->data->getData();

    validateBody(['name'], $data);

    if ($dao->update($id, $data)) {
        Flight::json(['message' => 'Job Category updated successfully'], 200);
    } else {
        Flight::json(['message' => 'Error updating Job Category'], 500);
    }
});

Flight::route('DELETE /job_categories/@id', function ($id) {
    $dao = new JobCategoriesDao();

    $category = $dao->getById($id);

    if (!$category) {
        Flight::jsonHalt(['message' => 'Job Category not found'], 404);
    }

    if ($dao->delete($id)) {
        Flight::json(['message' => 'Job Category deleted successfully'], 200);
    } else {
        Flight::json(['message' => 'Error deleting Job Category'], 500);
    }
});

