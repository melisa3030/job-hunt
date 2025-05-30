export function logServerResponse(response, data) {
  // log a bit more robustly
  console.group('Server Response for ' + response.url);
  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('Response URL:', response.url);
  console.log('Response Headers:', response.headers);
  console.log('Response Data:', data);
  console.groupEnd();
}
