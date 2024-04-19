const allowedHosts = [
  'qdoescoding.com',
  'www.qdoescoding.com'
];

const preventUnknownHosts = (req, res, next) => {
  console.log(req);
}

module.exports = preventUnknownHosts;