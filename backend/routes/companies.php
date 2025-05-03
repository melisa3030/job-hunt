<?php

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../dao/CompaniesDao.php';

// Get all companies or filter by name
Flight::route('GET /companies', function () {
  $name = Flight::request()->query->name;

  if ($name) {
    try {
      Flight::json(Flight::companiesService()->getCompanyByName($name), 200);
    } catch (Exception $e) {
      $code = $e->getCode();
      if ($code < 100 || $code > 599) {
        $code = 500;
      }
      Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
  } else {
    Flight::json(Flight::companiesService()->getAll(), 200);
  }
});;

Flight::route('GET /companies/@id', function ($id) {
  try {
    $result = Flight::companiesService()->getCompanyById($id);
    Flight::json($result, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('POST /companies', function () {
  try {
    $data = Flight::request()->data->getData();
    $result = Flight::companiesService()->createCompany($data);
    Flight::json($result, 201);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('PUT /companies/@id', function ($id) {
  try {
    $data = Flight::request()->data->getData();
    $result = Flight::companiesService()->updateCompany($id, $data);
    Flight::json($result, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});


Flight::route('DELETE /companies/@id', function ($id) {
  try {
    $result = Flight::companiesService()->deleteCompany($id);
    Flight::json($result, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});
