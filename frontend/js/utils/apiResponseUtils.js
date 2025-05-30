export function extractValidatedData(response, dataType) {
  if (!response || !response.success) {
    console.warn(`Failed to load ${dataType}:`, response?.error);
    return [];
  }

  if (!response.data) {
    console.warn(`No data found for ${dataType}`);
    return [];
  }

  // Handle different response structures
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else {
    console.warn(`Unexpected data structure for ${dataType}:`, response.data);
    return [];
  }
}

export function extractValidatedSingleData(response, dataType) {
  if (!response || !response.success) {
    console.warn(`Failed to load ${dataType}:`, response?.error);
    return null;
  }

  if (!response.data) {
    console.warn(`No data found for ${dataType}`);
    return null;
  }

  return response.data;
}
