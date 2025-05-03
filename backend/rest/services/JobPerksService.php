<?php

require_once __DIR__ . '/../dao/JobPerksDao.php';
require_once __DIR__ . '/../dao/PerksDao.php';
require_once __DIR__ . '/../dao/JobsDao.php';

require_once __DIR__ . '/../../helpers.php';

class JobPerksService
{
  private $jobPerksDao;
  private $perksDao;
  private $jobsDao;

  public function __construct()
  {
    $this->jobPerksDao = new JobPerksDao();
    $this->perksDao = new PerksDao();
    $this->jobsDao = new JobsDao();
  }

  public function getAllJobPerks()
  {
    return $this->jobPerksDao->getAll();
  }

  public function getJobPerksByJobId($job_id)
  {
    $jobPerks = $this->jobPerksDao->getByJobId($job_id);
    if ($jobPerks) {
      return $jobPerks;
    } else {
      throw new Exception("No job perks found for provided job", 404);
    }
  }

  public function getJobPerksByPerkId($perk_id)
  {
    $jobPerks = $this->jobPerksDao->getByPerkId($perk_id);
    if ($jobPerks) {
      return $jobPerks;
    } else {
      throw new Exception("No job perks found for provided perk", 404);
    }
  }

  public function createJobPerk($data)
  {
    validateBody(['job_id', 'perk_id'], $data);

    $job_id = $data['job_id'];
    $perk_id = $data['perk_id'];

    $job = $this->jobsDao->getById($job_id);
    $perk = $this->perksDao->getById($perk_id);

    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    if (!$perk) {
      throw new Exception("Perk not found", 404);
    }

    if ($this->jobPerksDao->insert($data)) {
      return ["message" => "Job perk created successfully"];
    } else {
      throw new Exception("Error creating job perk", 500);
    }
  }
}
