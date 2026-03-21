// Backend authentication endpoint
// In production, validate credentials against a real database/identity provider

const VALID_CREDENTIALS = [
  { email: 'admin@optischedule.com', password: 'SecurePassword123!' },
  { email: 'manager@optischedule.com', password: 'ManagerPass456!' },
];

function generateToken() {
  // In production, use proper JWT library
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2);
  return `token_${timestamp}_${random}`;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number, one special char
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password);
}

export async function login(email, password) {
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!validatePassword(password)) {
    throw new Error('Password does not meet security requirements');
  }

  // Verify credentials (in production, query database with bcrypt comparison)
  const user = VALID_CREDENTIALS.find(
    cred => cred.email === email && cred.password === password
  );

  if (!user) {
    // Don't reveal which field is incorrect
    throw new Error('Invalid credentials');
  }

  // Generate authentication token
  const token = generateToken();
  
  return {
    token,
    user: {
      email: user.email,
      name: email.split('@')[0],
      role: 'manager'
    },
    expiresIn: 3600 // 1 hour
  };
}

export async function validateToken(token) {
  // In production, use JWT verification
  if (!token || !token.startsWith('token_')) {
    throw new Error('Invalid token');
  }
  return true;
}

// Netlify Functions handler
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { action, email, password, token } = body;

    if (action === 'login') {
      const result = await login(email, password);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    }

    if (action === 'validate') {
      await validateToken(token);
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: true }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid action' }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
