<?php

require_once 'BaseDao.php';

class JobTagsDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("job_tags");
  }

  public function getByJobId($jobId)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM job_tags WHERE job_id = :job_id");
      $stmt->bindParam(':job_id', $jobId);
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByJobId(): " . $e->getMessage());
    }
  }

  public function getByTagId($tagId)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM job_tags WHERE tag_id = :tag_id");
      $stmt->bindParam(':tag_id', $tagId);
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByTagId(): " . $e->getMessage());
    }
  }

  public function deleteByJobAndTag($jobId, $tagId)
  {
    try {
      $stmt = $this->connection->prepare("DELETE FROM job_tags WHERE job_id = :job_id AND tag_id = :tag_id");
      $stmt->bindParam(':job_id', $jobId);
      $stmt->bindParam(':tag_id', $tagId);
      return $stmt->execute();
    } catch (PDOException $e) {
      throw new PDOException("Database error in deleteByJobAndTag(): " . $e->getMessage());
    }
  }
}
