<?php
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

Flight::route('GET /companies/employer/@id', function ($id) {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
    $result = Flight::companiesService()->getCompanyByEmployerId($id);
    Flight::json($result, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /companies/me', function () {
  try {
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
    $result = Flight::companiesService()->getCompanyForAuthUser();
    Flight::json($result, 200);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

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
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
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

Flight::route('POST /company_for_employer', function () {
  try {
    Flight::authMiddleware()->authorizeRole(Roles::ADMIN);
    $data = Flight::request()->data->getData();
    $result = Flight::companiesService()->createCompanyForUser($data);
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
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
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
    Flight::authMiddleware()->authorizeRoles([Roles::ADMIN, Roles::EMPLOYER]);
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
