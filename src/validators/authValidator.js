const validateRegister = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  } else if (data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }

  if (!data.password) {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  const validRoles = ['admin', 'staff'];
  if (data.role && !validRoles.includes(data.role)) {
    errors.push('Role must be either admin or staff');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateLogin = (data) => {
  const errors = [];

  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  }

  if (!data.password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateRegister,
  validateLogin
};