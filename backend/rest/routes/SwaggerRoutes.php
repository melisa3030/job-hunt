<?php

// Swagger Documentation Routes
Flight::route('GET /docs', function () {
    $docsPath = __DIR__ . '/../../docs/swagger/index.html';
    if (file_exists($docsPath)) {
        header('Content-Type: text/html');
        readfile($docsPath);
    } else {
        Flight::jsonHalt(['message' => 'Documentation not found'], 404);
    }
});

Flight::route('GET /docs/openapi.yaml', function () {
    $specPath = __DIR__ . '/../../docs/swagger/openapi.yaml';
    if (file_exists($specPath)) {
        header('Content-Type: application/x-yaml');
        header('Access-Control-Allow-Origin: *');
        readfile($specPath);
    } else {
        Flight::jsonHalt(['message' => 'OpenAPI specification not found'], 404);
    }
});

Flight::route('GET /docs/json', function () {
    $specPath = __DIR__ . '/../../docs/swagger/openapi.yaml';
    if (file_exists($specPath)) {
        $yamlContent = file_get_contents($specPath);
        try {
            // Use Symfony YAML component for parsing
            $parsed = \Symfony\Component\Yaml\Yaml::parse($yamlContent);
            $jsonContent = json_encode($parsed, JSON_PRETTY_PRINT);
            header('Content-Type: application/json');
            header('Access-Control-Allow-Origin: *');
            echo $jsonContent;
        } catch (Exception $e) {
            Flight::jsonHalt(['message' => 'Error converting YAML to JSON: ' . $e->getMessage()], 500);
        }
    } else {
        Flight::jsonHalt(['message' => 'OpenAPI specification not found'], 404);
    }
});
