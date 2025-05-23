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
    $stmt = $this->connection->prepare("SELECT * FROM companies WHERE name = :name");
    $stmt->bindParam(":name", $name);
    $stmt->execute();
    return $stmt->fetch();
  }

  public function getByField($field, $value)
  {
    $stmt = $this->connection->prepare("SELECT * FROM companies WHERE $field = :value");
    $stmt->bindParam(":value", $value);
    $stmt->execute();
    return $stmt->fetchAll();
  }
}
