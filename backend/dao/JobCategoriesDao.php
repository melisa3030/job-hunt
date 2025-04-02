<?php

require_once __DIR__ . '/../dao/BaseDao.php';

class JobCategoriesDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct("job_categories");
    }

    public function getByName($name)
    {
        $stmt = $this->connection->prepare("SELECT * FROM job_categories WHERE name = :name");
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->fetch();
    }
}