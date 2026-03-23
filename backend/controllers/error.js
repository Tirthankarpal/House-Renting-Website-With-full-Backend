const errorPage = (req, res, next) => {
  res.status(404).json({ error: 'Endpoint Not Found', details: `Check the URL: ${req.url}` });
};

exports.errorPage = errorPage;