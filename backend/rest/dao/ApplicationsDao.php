<?php

require_once 'BaseDao.php';

class ApplicationsDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("applications");
  }

  public function getByJobId($jobId)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM applications WHERE job_id = :job_id");
      $stmt->bindParam(':job_id', $jobId);
      $stmt->execute();
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByJobId(): " . $e->getMessage());
    }
  }

  public function getByApplicantId($applicantId)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM applications WHERE applicant_id = :applicant_id");
      $stmt->bindParam(':applicant_id', $applicantId);
      $stmt->execute();
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByApplicantId(): " . $e->getMessage());
    }
  }

  public function getByJobIds($job_ids)
  {
    try {
      if (empty($job_ids)) {
        return [];
      }

      // Create placeholders for PDO
      $placeholders = implode(',', array_fill(0, count($job_ids), '?'));
      $stmt = $this->connection->prepare("SELECT * FROM applications WHERE job_id IN ($placeholders)");

      // Execute with all job IDs as parameters (PDO style)
      $stmt->execute($job_ids);

      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByJobIds(): " . $e->getMessage());
    }
  }
}
