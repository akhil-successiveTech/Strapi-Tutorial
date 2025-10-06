// config/admin.js

// Function to generate the preview path based on the content type (UID) and the document data.
// You must adjust this logic for every content type you want to preview.
const getPreviewPathname = (uid, { document }) => {
    // Check for your specific Article content type UID
    if (uid === 'api::article.article') {
        // Assuming your article page path is /articles/[slug]
        return `/articles/${document.slug}`; 
    }
    // Add logic for other content types here (e.g., 'api::page.page', etc.)
    
    return null; // Return null if no preview path exists for this content type
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

  // START: PREVIEW CONFIGURATION 🚀
  preview: {
    enabled: true, // Enable the preview feature
    config: {
      // The URL of your Next.js frontend application
      allowedOrigins: [env('CLIENT_URL')],
      
      // The handler function runs when the user clicks the "Open draft preview" button
      async handler(uid, { documentId, locale, status }) {
        
        // 1. Fetch the complete document from Strapi to get the slug
        const document = await strapi.documents(uid).findOne({ documentId });
        
        // 2. Determine the path/pathname
        const pathname = getPreviewPathname(uid, { document });

        // If no path is found, don't show the preview button
        if (!pathname) {
          return null;
        }

        // Environment variables needed for the Next.js URL
        const clientUrl = env('CLIENT_URL');
        const previewSecret = env('PREVIEW_SECRET');

        // Build the query parameters for the Next.js API route /api/preview
        const urlSearchParams = new URLSearchParams({
          // 'url' is the path Next.js will redirect to after enabling Draft Mode
          url: pathname,
          // 'secret' authenticates the request to Next.js
          secret: previewSecret,
          // Pass the slug again, as Next.js will use it for redirection (as defined in the previous response)
          slug: document.slug
        });

        // Return the full URL that the Strapi button will open
        // This URL hits your Next.js /api/preview route
        return `${clientUrl}/api/preview?${urlSearchParams}`;
      },
    },
  },
  // END: PREVIEW CONFIGURATION
});