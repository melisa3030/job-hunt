<?php

require_once 'BaseDao.php';

class JobPerksDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("job_perks");
  }

  public function getByJobId($jobId)
  {
    $stmt = $this->connection->prepare("SELECT * FROM job_perks WHERE job_id = :job_id");
    $stmt->bindParam(':job_id', $jobId);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getByPerkId($perkId)
  {
    $stmt = $this->connection->prepare("SELECT * FROM job_perks WHERE perk_id = :perk_id");
    $stmt->bindParam(':perk_id', $perkId);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}
