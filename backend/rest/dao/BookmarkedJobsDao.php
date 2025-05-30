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
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByUserId(): " . $e->getMessage());
    }
  }

  public function getByJobIdAndUserId($jobId, $userId)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM bookmarked_jobs WHERE job_id = :job_id AND user_id = :user_id");
      $stmt->bindParam(':job_id', $jobId);
      $stmt->bindParam(':user_id', $userId);
      $stmt->execute();
      return $stmt->fetch();
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByJobIdAndUserId(): " . $e->getMessage());
    }
  }

  public function deleteBookmarkedJob($jobId, $userId)
  {
    try {
      $stmt = $this->connection->prepare("DELETE FROM bookmarked_jobs WHERE job_id = :job_id AND user_id = :user_id");
      $stmt->bindParam(':job_id', $jobId);
      $stmt->bindParam(':user_id', $userId);
      return $stmt->execute();
    } catch (PDOException $e) {
      throw new PDOException("Database error in deleteBookmarkedJob(): " . $e->getMessage());
    }
  }
}
