export function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  req.flash('error', 'You must be signed in to do that.');
  res.redirect('/signin');
}

export function ensureOwner(getOwnerIdFn) {
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerIdFn(req);
      if (!req.session.user || req.session.user.user_id !== ownerId) {
        req.flash('error', 'Not authorized.');
        return res.redirect('back');
      }
      next();
    } catch (e) {
      console.error(e);
      req.flash('error', 'Authorization check failed.');
      res.redirect('/');
    }
  };
}
