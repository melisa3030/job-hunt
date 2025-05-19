// utils/dateFormatter.js
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('sr-RS');
};

export const formatSalary = (salary) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(salary);
};