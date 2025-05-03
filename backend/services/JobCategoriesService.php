<?php

require_once __DIR__ . '/../dao/JobCategoriesDao.php';
require_once __DIR__ . '/../helpers.php';

class JobCategoriesService
{
  private $dao;

  public function __construct()
  {
    $this->dao = new JobCategoriesDao();
  }

  public function getAllJobCategories()
  {
    return $this->dao->getAll();
  }

  public function getJobCategoryById($id)
  {
    $jobCategory = $this->dao->getById($id);
    if (!$jobCategory) {
      throw new Exception("Job category not found", 404);
    }
    return $jobCategory;
  }

  public function createJobCategory($data)
  {
    $requiredFields = ['name'];
    validateBody($requiredFields, $data);

    if ($this->categoryExistsByName($data['name'])) {
      throw new Exception("Job category already exists", 409);
    }

    if (!$this->dao->insert($data)) {
      throw new Exception("Failed to create job category", 500);
    }

    return ["message" => "Job category created successfully"];
  }

  public function updateJobCategory($id, $data)
  {
    $requiredFields = ['name'];
    validateBody($requiredFields, $data);

    if ($this->categoryExistsByName($data['name'])) {
      throw new Exception("Job category already exists", 409);
    }

    if (!$this->dao->update($id, $data)) {
      throw new Exception("Failed to update job category", 500);
    }

    return ["message" => "Job category updated successfully"];
  }

  public function deleteJobCategory($id)
  {
    if (!$this->dao->delete($id)) {
      throw new Exception("Failed to delete job category", 500);
    }

    return ["message" => "Job category deleted successfully"];
  }

  public function categoryExistsByName($name)
  {
    return $this->dao->getByName($name) !== false;
  }
}
