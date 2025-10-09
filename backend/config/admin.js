// config/admin.js

// Function to generate the preview path based on the content type (UID) and the document data.
const getPreviewPathname = (uid, { document }) => {
  if (uid === 'api::article.article') {
    // Your article path structure
    return `/articles/${document.slug}`;
  }

  return null;
};

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },

  // 🚀 PREVIEW CONFIGURATION
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CLIENT_URL')],

      async handler(uid, { documentId, locale, status }) {
        // 1️⃣ Fetch the document to get the slug
        const document = await strapi.documents(uid).findOne({ documentId });

        // 2️⃣ Generate the preview path
        const pathname = getPreviewPathname(uid, { document });

        if (!pathname) return null;

        const clientUrl = env('CLIENT_URL');
        const previewSecret = env('PREVIEW_SECRET');

        // 3️⃣ Use the SLUG instead of the documentId in the preview URL
        const urlSearchParams = new URLSearchParams({
          url: pathname,
          secret: previewSecret,
          slug: document.slug, // ✅ changed from documentId → slug
        });

        // 4️⃣ Return the full preview URL
        return `${clientUrl}/api/preview?${urlSearchParams}`;
      },
    },
  },
});
