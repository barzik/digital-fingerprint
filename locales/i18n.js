const i18n = require('i18n');

i18n.configure({
  locales:['en', 'he'],
  directory: __dirname,
  defaultLocale: 'en',
  queryParameter: 'lang',
});

module.exports = (req, res, next) => {
  i18n.init(req, res);
  return next();
};
