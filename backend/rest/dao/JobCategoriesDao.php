<?php

require_once 'BaseDao.php';

class JobCategoriesDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct("job_categories");
    }

    public function getByName($name)
    {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM job_categories WHERE name = :name");
            $stmt->bindParam(':name', $name);
            $stmt->execute();
            return $stmt->fetch();
        } catch (PDOException $e) {
            throw new PDOException("Database error in getByName(): " . $e->getMessage());
        }
    }
}
