<?php
function validateBody($requiredFields, $data)
{
    foreach ($requiredFields as $field) {
        // Special handling for anonymous field
        if ($field === 'anonymous') {
            if (!isset($data[$field]) && $data[$field] !== '0' && $data[$field] !== 0) {
                Flight::jsonHalt(["message" => "Missing required field: $field"], 400);
            }
            continue;
        }

        // Normal validation for other fields
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            Flight::jsonHalt(["message" => "Missing required field: $field"], 400);
        }
    }

    $unexpectedFields = array_diff(array_keys($data), $requiredFields);
    if (!empty($unexpectedFields)) {
        Flight::jsonHalt(["message" => "Unexpected fields: " . implode(", ", $unexpectedFields)], 400);
    }
}