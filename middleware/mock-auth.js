module.exports = (req, res, next) => {
    req.isAuthenticated = () => true;
    req.user = { id: 'testUserId', username: 'testUser' }; // Mock user
    next();
  };
  