// Middleware: hanya izinkan admin yang sudah login
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Silakan login sebagai admin terlebih dahulu',
    data: null,
  });
}

module.exports = { requireAdminAuth };