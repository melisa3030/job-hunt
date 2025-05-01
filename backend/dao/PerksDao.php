<?php
require_once 'BaseDao.php';

class PerksDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("perks");
  }

  public function getByName($name)
  {
    $stmt = $this->connection->prepare("SELECT * FROM perks WHERE name = :name");
    $stmt->bindParam(":name", $name);
    $stmt->execute();
    return $stmt->fetch();
  }
}
