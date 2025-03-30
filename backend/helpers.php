<?php
function validateBody($requiredFields, $data)
{
  foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
      Flight::jsonHalt((["message" => "Missing required field: $field"]), 400);
    }
  }
}
