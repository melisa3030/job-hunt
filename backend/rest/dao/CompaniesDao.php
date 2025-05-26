<?php

require_once 'BaseDao.php';

class CompaniesDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("companies");
  }

  public function getCompanyByName($name)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM companies WHERE name = :name");
      $stmt->bindParam(":name", $name);
      $stmt->execute();
      return $stmt->fetch();
    } catch (PDOException $e) {
      throw new PDOException("Database error in getCompanyByName(): " . $e->getMessage());
    }
  }

  public function getByField($field, $value)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM companies WHERE $field = :value");
      $stmt->bindParam(":value", $value);
      $stmt->execute();
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByField(): " . $e->getMessage());
    }
  }
}
