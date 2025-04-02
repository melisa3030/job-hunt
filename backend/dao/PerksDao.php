<?php
require_once __DIR__ . '/BaseDao.php';

class PerksDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("perks");
  }
}
