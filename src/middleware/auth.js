function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="ANIMI Admin"');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
  const [user, password] = credentials.split(':');

  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'animi2026';

  if (user === expectedUser && password === expectedPassword) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="ANIMI Admin"');
  return res.status(401).json({ error: 'Invalid credentials' });
}

module.exports = basicAuth;
