// config/admin.js

const PREVIEW_ALLOWED_UIDS = {
  'api::article.article': (document) => `/articles/${document.slug}`,
};

module.exports = ({ env }) => {
  const CLIENT_URL = env('CLIENT_URL');
  const PREVIEW_SECRET = env('PREVIEW_SECRET');

  return {
    auth: { secret: env('ADMIN_JWT_SECRET') },
    apiToken: { salt: env('API_TOKEN_SALT') },
    transfer: { token: { salt: env('TRANSFER_TOKEN_SALT') } },
    secrets: { encryptionKey: env('ENCRYPTION_KEY') },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },

    // 🚀 PREVIEW CONFIGURATION
    preview: {
      enabled: true,
      config: {
        allowedOrigins: [CLIENT_URL],

        async handler(uid, { documentId, locale, status }) {
          // Check if UID is allowed
          const getPathname = PREVIEW_ALLOWED_UIDS[uid];
          if (!getPathname) return null;

          // Fetch only required fields
          const document = await strapi.db.query(uid).findOne({
            where: { id: documentId },
            select: ['slug'],
          });

          if (!document || !document.slug) return null;

          // Generate preview path
          const pathname = getPathname(document);

          // Return full URL
          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: PREVIEW_SECRET,
            slug: document.slug,
          });

          return `${CLIENT_URL}/api/preview?${urlSearchParams}`;
        },
      },
    },
  };
};
