<?php

require_once __DIR__ . '/../dao/TagsDao.php';
require_once __DIR__ . '/../../helpers.php';

class TagsService
{
  private $dao;

  public function __construct()
  {
    $this->dao = new TagsDao();
  }

  public function getAll()
  {
    return $this->dao->getAll();
  }

  public function getTagByName($name)
  {
    $tag = $this->dao->getByName($name);
    if (!$tag) {
      throw new Exception("Tag not found", 404);
    }
    return $tag;
  }

  public function getTagById($id)
  {
    $tag = $this->dao->getById($id);
    if (!$tag) {
      throw new Exception("Tag not found", 404);
    }
    return $tag;
  }

  public function createTag($data)
  {
    $requiredFields = ['name'];

    validateBody($requiredFields, $data);

    $existingTag = $this->dao->getByName($data['name']);
    if ($existingTag) {
      throw new Exception("Tag already exists", 409);
    }

    if (!$this->dao->insert($data)) {
      throw new Exception("Error creating tag", 500);
    }
    return ["message" => "Tag created successfully"];
  }

  public function updateTag($id, $data)
  {
    $tag = $this->getTagById($id);

    if (!$tag) {
      throw new Exception("Tag not found", 404);
    }

    $requiredFields = ['name'];
    validateBody($requiredFields, $data);

    // Check if another tag with the same name exists (excluding current tag)
    $existingTag = $this->dao->getByName($data['name']);
    if ($existingTag && $existingTag['id'] != $id) {
      throw new Exception("Tag already exists", 409);
    }

    if (!$this->dao->update($id, $data)) {
      throw new Exception("Error updating tag", 500);
    }
    return ["message" => "Tag updated successfully"];
  }

  public function deleteTag($id)
  {
    $tag = $this->getTagById($id);

    if (!$tag) {
      throw new Exception("Tag not found", 404);
    }

    if (!$this->dao->delete($id)) {
      throw new Exception("Error deleting tag", 500);
    }
    return ["message" => "Tag deleted successfully"];
  }

  public function tagAlreadyExists($name)
  {
    $tag = $this->dao->getByName($name);
    return $tag ? true : false;
  }
}
