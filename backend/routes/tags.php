<?php

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../dao/TagsDao.php';

Flight::route('GET /tags', function () {
    $tagsDao = new TagsDao();
    Flight::json($tagsDao->getAll(), 200);
});

Flight::route('GET /tags/@id', function ($id) {
    $tagsDao = new TagsDao();
    $tag = $tagsDao->getById($id);
    if ($tag) {
        Flight::json($tag, 200);
    } else {
        Flight::jsonHalt(["message" => "Tag not found"], 404);
    }
});

Flight::route('POST /tags', function () {
    $tagsDao = new TagsDao();
    $data = Flight::request()->data->getData();

    validateBody(['name'], $data);

    $existingTag = $tagsDao->getByName($data['name']);
    if ($existingTag) {
        Flight::jsonHalt(["message" => "Tag already exists"], 409);
    }

    if ($tagsDao->insert($data)) {
        Flight::json(["message" => "Tag created successfully"], 201);
    } else {
        Flight::jsonHalt(["message" => "Error creating tag"], 500);
    }
});


Flight::route('PUT /tags/@id', function ($id) {
    $tagsDao = new TagsDao();
    $data = Flight::request()->data->getData();

    $tag = $tagsDao->getById($id);

    if (!$tag) {
        Flight::jsonHalt(["message" => "Tag not found"], 404);
    };

    if ($tagsDao->update($id, $data)) {
        Flight::json(["message" => "Tag updated successfully"], 200);
    } else {
        Flight::jsonHalt(["message" => "Error updating tag"], 500);
    }
});

Flight::route('DELETE /tags/@id', function ($id) {
    $tagsDao = new TagsDao();

    $tag = $tagsDao->getById($id);

    if (!$tag) {
        Flight::jsonHalt(["message" => "Tag not found"], 404);
    };

    if ($tagsDao->delete($id)) {
        Flight::json(["message" => "Tag deleted successfully"], 200);
    } else {
        Flight::jsonHalt(["message" => "Error deleting tag"], 500);
    }
});
