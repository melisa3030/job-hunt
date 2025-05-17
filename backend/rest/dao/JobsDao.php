<?php

require_once 'BaseDao.php';

class JobsDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("jobs");
  }

  public function getByField($field, $value)
  {
    $stmt = $this->connection->prepare("SELECT * FROM {$this->table} WHERE {$field} = :value");
    $stmt->bindParam(':value', $value);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
