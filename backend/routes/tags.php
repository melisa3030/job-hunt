<?php

require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../dao/TagsDao.php';

Flight::route('GET /tags', function () {
    $name = Flight::request()->query->name;

    if ($name) {
        try {
            Flight::json(Flight::tagsService()->getTagByName($name));
        } catch (Exception $e) {
            $code = $e->getCode();
            if ($code < 100 || $code > 599) {
                $code = 500;
            }
            Flight::jsonHalt(["message" => $e->getMessage()], $code);
        }
    } else {
        Flight::json(Flight::tagsService()->getAll());
    }
});

Flight::route('GET /tags/@id', function ($id) {
    try {
        Flight::json(Flight::tagsService()->getTagById($id));
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});


Flight::route('POST /tags', function () {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::tagsService()->createTag($data);
        Flight::json($result, 201);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});


Flight::route('PUT /tags/@id', function ($id) {
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::tagsService()->updateTag($id, $data);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});

Flight::route('DELETE /tags/@id', function ($id) {
    try {
        $result = Flight::tagsService()->deleteTag($id);
        Flight::json($result, 200);
    } catch (Exception $e) {
        $code = $e->getCode();
        if ($code < 100 || $code > 599) {
            $code = 500;
        }
        Flight::jsonHalt(["message" => $e->getMessage()], $code);
    }
});
