<?php
require_once 'BaseDao.php';

class PerksDao extends BaseDao
{
  public function __construct()
  {
    parent::__construct("perks");
  }
}
