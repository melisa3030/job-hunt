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
}
