<?php

require_once __DIR__ . '/../dao/JobTagsDao.php';
require_once __DIR__ . '/../dao/TagsDao.php';
require_once __DIR__ . '/../dao/JobsDao.php';

class JobTagsService
{
  private $jobTagsDao;

  public function __construct()
  {
    $this->jobTagsDao = new JobTagsDao();
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

    $job = Flight::jobsService()->getJobById($job_id);
    $tag = Flight::tagsService()->getTagById($tag_id);

    if (!$job) {
      throw new Exception("Job not found", 404);
    }

    if (!$tag) {
      throw new Exception("Tag not found", 404);
    }

    try {
      $result = $this->jobTagsDao->insert($data);

      // For tables without auto-increment, check if result is not false
      // The insert method should return true/false for success/failure
      if ($result !== false) {
        return ["message" => "Job tag created successfully"];
      } else {
        throw new Exception("Failed to insert job tag into database", 500);
      }
    } catch (Exception $e) {
      throw new Exception("Error creating job tag: " . $e->getMessage(), 500);
    }
  }

  public function deleteJobTag($data)
  {
    validateBody(['job_id', 'tag_id'], $data);

    $job_id = $data['job_id'];
    $tag_id = $data['tag_id'];

    try {
      if ($this->jobTagsDao->deleteByJobAndTag($job_id, $tag_id)) {
        return ["message" => "Job tag deleted successfully"];
      } else {
        throw new Exception("Job tag association not found", 404);
      }
    } catch (Exception $e) {
      throw new Exception("Error deleting job tag: " . $e->getMessage(), 500);
    }
  }
}
