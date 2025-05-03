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
    $stmt = $this->connection->prepare("SELECT * FROM applications WHERE job_id = :job_id");
    $stmt->bindParam(':job_id', $jobId);
    $stmt->execute();
    return $stmt->fetchAll();
  }

  public function getByApplicantId($applicantId)
  {
    $stmt = $this->connection->prepare("SELECT * FROM applications WHERE applicant_id = :applicant_id");
    $stmt->bindParam(':applicant_id', $applicantId);
    $stmt->execute();
    return $stmt->fetchAll();
  }
}
