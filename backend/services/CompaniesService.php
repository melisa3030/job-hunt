<?php

require_once __DIR__ . '/../dao/CompaniesDao.php';
require_once __DIR__ . '/../helpers.php';

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

  public function createCompany($data)
  {
    $requiredFields = ['name', 'country', 'city'];
    validateBody($requiredFields, $data);

    if (!$this->dao->insert($data)) {
      throw new Exception("Error creating company", 500);
    }

    return ["message" => "Company created successfully"];
  }

  public function updateCompany($id, $data)
  {
    $this->getCompanyById($id);

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

    if (!$company) {
      throw new Exception("Company not found", 404);
    }

    if (!$this->dao->delete($id)) {
      throw new Exception("Error deleting company", 500);
    }

    return ["message" => "Company deleted successfully"];
  }
}
