<?php
require_once __DIR__ . '/../dao/ReviewTagsDao.php';
require_once __DIR__ . '/../dao/TagsDao.php';
require_once __DIR__ . '/../dao/ReviewsDao.php';
require_once __DIR__ . '/../helpers.php';

Flight::route('GET /review_tags', function () {
  $reviewTagsDao = new ReviewTagsDao();
  Flight::json($reviewTagsDao->getAll());
});


Flight::route('POST /review_tags', function () {
  $reviewTagsDao = new ReviewTagsDao();

  $tagsDao = new TagsDao();
  $reviewsDao = new ReviewsDao();

  $data = Flight::request()->data->getData();

  validateBody(['review_id', 'tag_id'], $data);

  $review_id = $data['review_id'];
  $tag_id = $data['tag_id'];

  $review = $reviewsDao->getById($review_id);
  $tag = $tagsDao->getById($tag_id);

  if (!$review) {
    Flight::jsonHalt(["message" => "Review not found"], 404);
  }

  if (!$tag) {
    Flight::jsonHalt(["message" => "Tag not found"], 404);
  }

  if ($reviewTagsDao->insert($data)) {
    Flight::json(["message" => "ReviewTag association created successfully"], 201);
  } else {
    Flight::jsonHalt((["message" => "Error creating ReviewTag association"]), 500);
  }
});

Flight::route('GET /review_tags/review/@review_id', function ($review_id) {
  $reviewTagsDao = new ReviewTagsDao();
  $reviewTags = $reviewTagsDao->getByReviewId($review_id);
  if ($reviewTags) {
    Flight::json($reviewTags);
  } else {
    Flight::jsonHalt(["message" => "No ReviewTags found for review_id"], 404);
  }
});

Flight::route('GET /review_tags/tag/@tag_id', function ($tag_id) {
  $reviewTagsDao = new ReviewTagsDao();
  $reviewTags = $reviewTagsDao->getByTagId($tag_id);
  if ($reviewTags) {
    Flight::json($reviewTags);
  } else {
    Flight::jsonHalt(["message" => "No ReviewTags found for tag_id"], 404);
  }
});
