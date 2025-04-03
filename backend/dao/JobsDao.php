<?php

require_once 'BaseDao.php';

class JobsDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("jobs");
  }
}
