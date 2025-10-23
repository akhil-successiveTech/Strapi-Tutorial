// config/admin.js

const PREVIEW_ALLOWED_UIDS = {
  'api::article.article': (document) => `/articles/${document.slug}`,
};

module.exports = ({ env }) => {
  const CLIENT_URL = env('FRONTEND_URL');
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
          // ✅ Check if this UID supports preview
          const getPathname = PREVIEW_ALLOWED_UIDS[uid];
          if (!getPathname) return null;

          // ✅ Use the official Strapi v5 document API (required for preview button)
          const document = await strapi.documents(uid).findOne({ documentId });

          // ✅ Validate that the document exists and has a slug
          if (!document || !document.slug) return null;

          // ✅ Build the frontend pathname
          const pathname = getPathname(document);

          // ✅ Create the full preview URL
          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: PREVIEW_SECRET,
            slug: document.slug,
          });

          // ✅ Return the final preview URL
          return `${CLIENT_URL}/api/preview?${urlSearchParams}`;
        },
      },
    },
  };
};
