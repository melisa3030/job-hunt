<?php

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../dao/CompaniesDao.php';

Flight::route('GET /companies', function () {
  $companiesDao = new CompaniesDao();
  Flight::json($companiesDao->getAll());
});

Flight::route('GET /companies/@id', function ($id) {
  $companiesDao = new CompaniesDao();
  $company = $companiesDao->getById($id);
  if ($company) {
    Flight::json($company);
  } else {
    Flight::jsonHalt((["message" => "Company not found"]), 404);
  }
});

Flight::route('POST /companies', function () {
  $companiesDao = new CompaniesDao();
  $data = Flight::request()->data->getData();

  validateBody(['name', 'country', 'city'], $data);

  if ($companiesDao->insert($data)) {
    Flight::json(["message" => "Company created successfully"], 201);
  } else {
    Flight::jsonHalt((["message" => "Error creating company"]), 500);
  }
});

Flight::route('PUT /companies/@id', function ($id) {
  $companiesDao = new CompaniesDao();
  $data = Flight::request()->data->getData();

  $company = $companiesDao->getById($id);
  if (!$company) {
    Flight::jsonHalt((["message" => "Company not found"]), 404);
  }

  if ($companiesDao->update($id, $data)) {
    Flight::json(["message" => "Company updated successfully"], 200);
  } else {
    Flight::jsonHalt((["message" => "Error updating company"]), 500);
  }
});


Flight::route('DELETE /companies/@id', function ($id) {
  $companiesDao = new CompaniesDao();
  $company = $companiesDao->getById($id);
  if (!$company) {
    Flight::jsonHalt((["message" => "Company not found"]), 404);
  }

  if ($companiesDao->delete($id)) {
    Flight::json(["message" => "Company deleted successfully"], 200);
  } else {
    Flight::jsonHalt((["message" => "Error deleting company"]), 500);
  }
});
