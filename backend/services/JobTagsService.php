<?php

require_once __DIR__ . '/../dao/JobTagsDao.php';
require_once __DIR__ . '/../dao/TagsDao.php';
require_once __DIR__ . '/../dao/JobsDao.php';

class JobTagsService
{
  private $jobTagsDao;
  private $tagsDao;
  private $jobsDao;

  public function __construct()
  {
    $this->jobTagsDao = new JobTagsDao();
    $this->tagsDao = new TagsDao();
    $this->jobsDao = new JobsDao();
  }

  public function getAllJobTags()
  {
    return $this->jobTagsDao->getAll();
  }

  public function getJobTagsByJobId($job_id)
  {
    $jobTags = $this->jobTagsDao->getByJobId($job_id);
    if ($jobTags) {
      return $jobTags;
    } else {
      throw new Exception("No job tags found for job_id", 404);
    }
  }

  public function getJobTagsByTagId($tag_id)
  {
    $jobTags = $this->jobTagsDao->getByTagId($tag_id);
    if ($jobTags) {
      return $jobTags;
    } else {
      throw new Exception("No job tags found for tag_id", 404);
    }
  }

  public function createJobTag($data)
  {
    validateBody(['job_id', 'tag_id'], $data);

    $job_id = $data['job_id'];
    $tag_id = $data['tag_id'];

    $job = $this->jobsDao->getById($job_id);
    $tag = $this->tagsDao->getById($tag_id);

    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    if (!$tag) {
      throw new Exception("Tag not found", 404);
    }

    if ($this->jobTagsDao->insert($data)) {
      return ["message" => "Job tag created successfully"];
    } else {
      throw new Exception("Error creating job tag", 500);
    }
  }
}
