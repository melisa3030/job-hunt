<?php

require_once __DIR__ . '/../dao/BaseDao.php';

class ReviewsDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('reviews');
    }
}