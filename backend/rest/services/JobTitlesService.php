<?php

require_once __DIR__ . '/../dao/JobTitlesDao.php';
require_once __DIR__ . '/../../helpers.php';

class JobTitlesService
{
  private $dao;

  public function __construct()
  {
    $this->dao = new JobTitlesDao();
  }

  public function getAll()
  {
    return $this->dao->getAll();
  }

  public function getByName($name)
  {
    $jobTitle = $this->dao->getByName($name);
    if ($jobTitle) {
      return $jobTitle;
    } else {
      throw new Exception('Job title not found', 404);
    }
  }

  public function getById($id)
  {
    $jobTitle = $this->dao->getById($id);
    if ($jobTitle) {
      return $jobTitle;
    } else {
      throw new Exception('Job title not found', 404);
    }
  }

  public function createJobTitle($data)
  {
    $requiredFields = ['name'];
    validateBody($requiredFields, $data);

    $existingJobTitle = $this->dao->getByName($data['name']);
    if ($existingJobTitle) {
      throw new Exception('Job title already exists', 409);
    }

    if (!$this->dao->insert($data)) {
      throw new Exception('Error creating job title', 500);
    }

    return ["message" => "Job title created successfully"];
  }

  public function updateJobTitle($id, $data)
  {
    $jobTitle = $this->getById($id);

    if (!$jobTitle) {
      throw new Exception('Job title not found', 404);
    }

    $requiredFields = ['name'];
    validateBody($requiredFields, $data);

    if ($this->dao->getByName($data['name'])) {
      throw new Exception('Job title already exists', 409);
    }

    if (!$this->dao->update($id, $data)) {
      throw new Exception('Error updating job title', 500);
    }

    return ["message" => "Job title updated successfully"];
  }

  public function deleteJobTitle($id)
  {
    $jobTitle = $this->getById($id);

    if (!$jobTitle) {
      throw new Exception('Job title not found', 404);
    }

    if (!$this->dao->delete($id)) {
      throw new Exception('Error deleting job title', 500);
    }

    return ["message" => "Job title deleted successfully"];
  }


  public function existsByName($name)
  {
    return $this->dao->getByName($name) !== null;
  }
}
