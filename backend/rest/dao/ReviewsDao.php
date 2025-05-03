<?php

require_once 'BaseDao.php';

class ReviewsDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('reviews');
    }
}
