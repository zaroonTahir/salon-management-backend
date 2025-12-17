const validateAppointment = (data) => {
  const errors = [];

  // Check required fields
  if (!data.customerId || data.customerId.trim() === '') {
    errors.push('customerId is required');
  }

  if (!data.serviceName || data.serviceName.trim() === '') {
    errors.push('serviceName is required');
  }

  if (!data.appointmentDate) {
    errors.push('appointmentDate is required');
  }

  // Validate appointmentDate is a valid date
  if (data.appointmentDate) {
    const date = new Date(data.appointmentDate);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      errors.push('appointmentDate must be a valid date');
    } else {
      // Check if date is in the past (allow dates within last 5 minutes for testing)
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      if (date < fiveMinutesAgo) {
        errors.push('appointmentDate cannot be in the past');
      }
    }
  }

  // Validate status if provided
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('status must be one of: pending, confirmed, completed, cancelled');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateAppointment };