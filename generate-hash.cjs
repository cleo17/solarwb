   const { scryptSync, randomBytes } = require('crypto');
   const password = 'admin123';
   const salt = randomBytes(16).toString('hex');
   const buf = scryptSync(password, salt, 64);
   console.log(buf.toString('hex') + '.' + salt);