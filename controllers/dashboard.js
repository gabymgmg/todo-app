module.exports = {
    dashboardView: (req, res) => {
      res.render('dashboard', { user: req.user }); 
      console.log('this is', req.user)
    }
  }