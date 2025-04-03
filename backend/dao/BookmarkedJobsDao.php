<?php

require_once 'BaseDao.php';

class BookmarkedJobsDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("bookmarked_jobs");
  }

  public function getByUserId($userId)
  {
    $stmt = $this->connection->prepare("SELECT * FROM bookmarked_jobs WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
