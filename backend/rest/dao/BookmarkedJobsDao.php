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
    try {
      $stmt = $this->connection->prepare("SELECT * FROM bookmarked_jobs WHERE user_id = :user_id");
      $stmt->bindParam(':user_id', $userId);
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByUserId(): " . $e->getMessage());
    }
  }
}
