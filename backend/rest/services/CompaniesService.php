<?php

require_once __DIR__ . '/../dao/CompaniesDao.php';
require_once __DIR__ . '/../../helpers.php';

class CompaniesService
{
  private $dao;

  public function __construct()
  {
    $this->dao = new CompaniesDao();
  }

  public function getAll()
  {
    return $this->dao->getAll();
  }


  public function getById($id)
  {
    return $this->getCompanyById($id);
  }

  public function getCompanyByName($name)
  {
    $company = $this->dao->getCompanyByName($name);
    if (!$company) {
      throw new Exception("Company not found", 404);
    }
    return $company;
  }

  public function getCompanyById($id)
  {
    $company = $this->dao->getById($id);
    if (!$company) {
      throw new Exception("Company not found", 404);
    }
    return $company;
  }

  public function getCompanyByEmployerId($id)
  {
    $companies = $this->dao->getByField('employer_id', $id);
    if (!$companies) {
      throw new Exception("No company found for this employer", 404);
    }
    return $companies;
  }

  public function getCompanyForAuthUser()
  {
    $user = Flight::get('user');
    if (!$user) {
      throw new Exception("User not authenticated", 401);
    }

    $company = $this->dao->getByField('employer_id', $user->id);
    if (!$company) {
      throw new Exception("No company found for this employer", 404);
    }
    return $company;
  }

  public function createCompany($data)
  {
    $user = Flight::get('user');
    if (!$user) {
      throw new Exception("User not authenticated", 401);
    }
    $userRole = Roles::from($user->role);

    if ($userRole !== Roles::ADMIN && $userRole !== Roles::EMPLOYER) {
      throw new Exception("Forbidden: You can only create a company as an admin or employer", 403);
    }

    $existingCompany = $this->dao->getByField('employer_id', $user->id);
    if ($existingCompany) {
      throw new Exception("You already have a company", 400);
    }

    $requiredFields = ['name', 'country', 'city', 'description'];
    validateBody($requiredFields, $data);

    $data['employer_id'] = $user->id;

    if (!$this->dao->insert($data)) {
      throw new Exception("Error creating company", 500);
    }

    return ["message" => "Company created successfully"];
  }

  public function updateCompany($id, $data)
  {
    $user = Flight::get('user');
    if (!$user) {
      throw new Exception("User not authenticated", 401);
    }

    $company = $this->getCompanyById($id);

    $userRole = Roles::from($user->role);

    if ($userRole !== Roles::ADMIN && $company['employer_id'] != $user->id) {
      throw new Exception("Forbidden: You can only update your own company", 403);
    }


    // Check if at least one required field is present
    $requiredFields = ['name', 'country', 'city', 'description'];
    $hasRequiredField = false;

    foreach ($requiredFields as $field) {
      if (isset($data[$field]) && !empty($data[$field])) {
        $hasRequiredField = true;
        break;
      }
    }

    if (!$hasRequiredField) {
      throw new Exception("At least one required field must be present", 400);
    }


    if (!$this->dao->update($id, $data)) {
      throw new Exception("Error updating company", 500);
    }

    return ["message" => "Company updated successfully"];
  }

  public function deleteCompany($id)
  {
    $company = $this->getCompanyById($id);

    $user = Flight::get('user');
    if (!$user) {
      throw new Exception("User not authenticated", 401);
    }

    $userRole = Roles::from($user->role);

    if ($userRole !== Roles::ADMIN && $company['employer_id'] != $user->id) {
      throw new Exception("Forbidden: You can only delete your own company", 403);
    }

    if (!$company) {
      throw new Exception("Company not found", 404);
    }

    if (!$this->dao->delete($id)) {
      throw new Exception("Error deleting company", 500);
    }

    return ["message" => "Company deleted successfully"];
  }
}
