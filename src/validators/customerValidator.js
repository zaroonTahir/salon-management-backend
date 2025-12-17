const validateCustomer = (data) => {
  const errors = [];

  // Check required fields
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }

  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  }

  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone is required');
  }

  // Validate email format (simple regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Validate phone format (simple check for numbers)
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (data.phone && !phoneRegex.test(data.phone)) {
    errors.push('Phone must contain only numbers and valid characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateCustomer };