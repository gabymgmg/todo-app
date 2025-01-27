const jwt = require('jsonwebtoken');

const validateRequest = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded.id; // it populates with the id
      next(); 
    });
  };
module.exports = validateRequest;