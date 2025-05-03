<?php
require_once __DIR__ . '/../dao/ReviewTagsDao.php';
require_once __DIR__ . '/../dao/TagsDao.php';
require_once __DIR__ . '/../dao/ReviewsDao.php';
require_once __DIR__ . '/../helpers.php';

Flight::route('GET /review_tags', function () {
  Flight::json(Flight::reviewTagsService()->getAll());
});


Flight::route('POST /review_tags', function () {
  try {
    $data = Flight::request()->data->getData();
    $result = Flight::reviewTagsService()->createReviewTag($data);
    Flight::json($result, 201);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /review_tags/review/@review_id', function ($review_id) {
  try {
    $reviewTags = Flight::reviewTagsService()->getReviewTagsByReviewId($review_id);
    Flight::json($reviewTags);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});

Flight::route('GET /review_tags/tag/@tag_id', function ($tag_id) {
  try {
    $reviewTags = Flight::reviewTagsService()->getReviewTagsByTagId($tag_id);
    Flight::json($reviewTags);
  } catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 100 || $code > 599) {
      $code = 500;
    }
    Flight::jsonHalt(["message" => $e->getMessage()], $code);
  }
});
