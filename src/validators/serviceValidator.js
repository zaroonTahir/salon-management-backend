const validateService = (data) => {
  const errors = [];

  // Validate name
  if (!data.name || data.name.trim() === '') {
    errors.push('Service name is required');
  } else if (data.name.length < 3) {
    errors.push('Service name must be at least 3 characters');
  } else if (data.name.length > 100) {
    errors.push('Service name must be less than 100 characters');
  }

  // Validate price
  if (data.price === undefined || data.price === null) {
    errors.push('Price is required');
  } else {
    const price = parseFloat(data.price);
    if (isNaN(price)) {
      errors.push('Price must be a valid number');
    } else if (price < 0) {
      errors.push('Price cannot be negative');
    } else if (price > 100000) {
      errors.push('Price is too high');
    }
  }

  // Validate duration
  if (data.duration === undefined || data.duration === null) {
    errors.push('Duration is required');
  } else {
    const duration = parseInt(data.duration);
    if (isNaN(duration)) {
      errors.push('Duration must be a valid number');
    } else if (duration < 5) {
      errors.push('Duration must be at least 5 minutes');
    } else if (duration > 480) {
      errors.push('Duration cannot exceed 8 hours (480 minutes)');
    }
  }

  // Validate description (optional)
  if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateService };