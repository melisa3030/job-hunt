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
    $stmt = $this->connection->prepare("SELECT * FROM job_tags WHERE job_id = :job_id");
    $stmt->bindParam(':job_id', $jobId);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getByTagId($tagId)
  {
    $stmt = $this->connection->prepare("SELECT * FROM job_tags WHERE tag_id = :tag_id");
    $stmt->bindParam(':tag_id', $tagId);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
