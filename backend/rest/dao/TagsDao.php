<?php
require_once 'BaseDao.php';

class TagsDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("tags");
  }

  public function getByName($name)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM tags where name = :name");
      $stmt->bindParam(":name", $name);
      $stmt->execute();
      return $stmt->fetch();
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByName(): " . $e->getMessage());
    }
  }
}
