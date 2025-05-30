// Utility function to debounce filter inputs (prevents too many updates while typing)
export function debounceFilterInput(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
