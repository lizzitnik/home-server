exports.PORT = process.env.PORT || 3001
exports.DATABASE_URL =
  'mongodb://localhost/home-server'
exports.TEST_DATABASE_URL =
  'mongodb://localhost/home-server-test'
exports.JWT_SECRET = process.env.JWT_SECRET
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d"
