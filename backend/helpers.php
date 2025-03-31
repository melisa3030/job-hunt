<?php
function validateBody($requiredFields, $data)
{
  foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
      Flight::jsonHalt(["message" => "Missing required field: $field"], 400);
    }
  }

  $unexpectedFields = array_diff(array_keys($data), $requiredFields);
  if (!empty($unexpectedFields)) {
    Flight::jsonHalt(["message" => "Unexpected fields: " . implode(", ", $unexpectedFields)], 400);
  }
}
