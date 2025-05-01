<?php

require_once __DIR__ . '/../dao/ReviewTagsDao.php';
require_once __DIR__ . '/../dao/TagsDao.php';
require_once __DIR__ . '/../dao/ReviewsDao.php';
require_once __DIR__ . '/../helpers.php';

class ReviewTagsService
{
  private $dao;
  private $tagsDao;
  private $reviewsDao;

  public function __construct()
  {
    $this->dao = new ReviewTagsDao();
    $this->tagsDao = new TagsDao();
    $this->reviewsDao = new ReviewsDao();
  }

  public function getAll()
  {
    return $this->dao->getAll();
  }

  public function getReviewTagsByReviewId($reviewId)
  {
    $reviewTags = $this->dao->getByReviewId($reviewId);
    if (!$reviewTags) {
      throw new Exception("Review tags not found", 404);
    }
    return $reviewTags;
  }

  public function getReviewTagsByTagId($tagId)
  {
    $reviewTags = $this->dao->getByTagId($tagId);
    if (!$reviewTags) {
      throw new Exception("Review tags not found", 404);
    }
    return $reviewTags;
  }

  public function createReviewTag($data)
  {
    validateBody(['review_id', 'tag_id'], $data);

    $review = $this->reviewsDao->getById($data['review_id']);
    $tag = $this->tagsDao->getById($data['tag_id']);

    if (!$review) {
      throw new Exception("Review not found", 404);
    }

    if (!$tag) {
      throw new Exception("Tag not found", 404);
    }

    if (!$this->dao->insert($data)) {
      throw new Exception("Error creating ReviewTag association", 500);
    }

    return ["message" => "ReviewTag association created successfully"];
  }
}
