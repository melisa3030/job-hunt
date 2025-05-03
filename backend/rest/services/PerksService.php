<?php

require_once __DIR__ . '/../dao/PerksDao.php';
require_once __DIR__ . '/../../helpers.php';

class PerksService
{
  private $dao;

  public function __construct()
  {
    $this->dao = new PerksDao();
  }

  public function getAllPerks()
  {
    return $this->dao->getAll();
  }

  public function getPerkById($id)
  {
    $perk = $this->dao->getById($id);
    if (!$perk) {
      throw new Exception("Perk not found", 404);
    }
    return $perk;
  }

  public function createPerk($data)
  {
    validateBody(['name'], $data);
    if ($this->dao->insert($data)) {
      return ["message" => "Perk created successfully"];
    } else {
      throw new Exception("Error creating perk", 500);
    }
  }

  public function updatePerk($id, $data)
  {
    $this->getPerkById($id);

    $requiredFields = ['name'];
    validateBody($requiredFields, $data);

    $this->validateUniqueName($data['name']);

    if ($this->dao->update($id, $data)) {
      return ["message" => "Perk updated successfully"];
    } else {
      throw new Exception("Error updating perk", 500);
    }
  }

  public function deletePerk($id)
  {
    $this->getPerkById($id);

    if ($this->dao->delete($id)) {
      return ["message" => "Perk deleted successfully"];
    } else {
      throw new Exception("Error deleting perk", 500);
    }
  }

  private function validateUniqueName($name)
  {
    if ($this->dao->getByName($name)) {
      throw new Exception("Perk with this name already exists", 400);
    }
  }
}
