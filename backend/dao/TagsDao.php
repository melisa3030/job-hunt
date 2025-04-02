<?php
require_once __DIR__ . '/BaseDao.php';

class TagsDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("tags");
  }

  public function getByName($name)
  {
    $stmt = $this->connection->prepare("SELECT * FROM tags where name = :name");
    $stmt->bindParam(":name", $name);
    $stmt->execute();
    return $stmt->fetch();
  }
}
