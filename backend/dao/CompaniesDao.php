<?php

require_once __DIR__ . '/BaseDao.php';

class CompaniesDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("companies");
  }
}
