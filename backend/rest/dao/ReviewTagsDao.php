<?php
require_once 'BaseDao.php';

class ReviewTagsDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("review_tags");
  }

  public function getByReviewId($reviewId)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM review_tags WHERE review_id = :review_id");
      $stmt->bindParam(':review_id', $reviewId);
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByReviewId(): " . $e->getMessage());
    }
  }

  public function getByTagId($tagId)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM review_tags WHERE tag_id = :tag_id");
      $stmt->bindParam(':tag_id', $tagId);
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      throw new PDOException("Database error in getByTagId(): " . $e->getMessage());
    }
  }
}
