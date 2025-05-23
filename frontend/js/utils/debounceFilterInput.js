// Utility function to debounce filter inputs (prevents too many updates while typing)
export function debounceFilterInput(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
