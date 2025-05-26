<?php
require_once __DIR__ . '/../db/Database.php';

class BaseDao
{
  protected $table;
  protected $connection;


  public function __construct($table)
  {
    $this->table = $table;
    $this->connection = Database::connect();
  }

  public function getAll()
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM " . $this->table);
      $stmt->execute();
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException("Database error in BaseDao getAll(): " . $e->getMessage());
    }
  }


  public function getById($id)
  {
    try {
      $stmt = $this->connection->prepare("SELECT * FROM " . $this->table . " WHERE id = :id");
      $stmt->bindParam(':id', $id);
      $stmt->execute();
      return $stmt->fetch();
    } catch (PDOException $e) {
      throw new PDOException("Database error in BaseDao getById(): " . $e->getMessage());
    }
  }


  public function insert($data)
  {
    try {
      $columns = implode(", ", array_keys($data));
      $placeholders = ":" . implode(", :", array_keys($data));
      $sql = "INSERT INTO " . $this->table . " ($columns) VALUES ($placeholders)";
      $stmt = $this->connection->prepare($sql);
      $result = $stmt->execute($data);
      return $result ? $this->connection->lastInsertId() : false;
    } catch (PDOException $e) {
      throw new PDOException("Database error in BaseDao insert(): " . $e->getMessage());
    }
  }


  public function update($id, $data)
  {
    try {
      $fields = "";
      foreach ($data as $key => $value) {
        $fields .= "$key = :$key, ";
      }
      $fields = rtrim($fields, ", ");
      $sql = "UPDATE " . $this->table . " SET $fields WHERE id = :id";
      $stmt = $this->connection->prepare($sql);
      $data['id'] = $id;
      return $stmt->execute($data);
    } catch (PDOException $e) {
      throw new PDOException("Database error in BaseDao update(): " . $e->getMessage());
    }
  }


  public function delete($id)
  {
    try {
      $stmt = $this->connection->prepare("DELETE FROM " . $this->table . " WHERE id = :id");
      $stmt->bindParam(':id', $id);
      return $stmt->execute();
    } catch (PDOException $e) {
      throw new PDOException("Database error in BaseDao delete(): " . $e->getMessage());
    }
  }
}
