<?php

require_once 'BaseDao.php';

class ReviewsDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('reviews');
    }

    public function getByField($field, $value)
    {
        try {
            $stmt = $this->connection->prepare("SELECT * FROM {$this->table} WHERE {$field} = :value");
            $stmt->bindParam(':value', $value);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new PDOException("Database error in getByField(): " . $e->getMessage());
        }
    }
}
