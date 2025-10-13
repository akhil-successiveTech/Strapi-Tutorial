module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::compression',
    config: { threshold: 2048 },
  },
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
