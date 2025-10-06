module.exports = ({ env }) => ({
  'preview-button': {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: 'api::article.article', // your content type
          draft: {
            url: `${env('FRONTEND_URL')}/articles/{slug}?preview_secret=${env('PREVIEW_SECRET')}`,
            query: {
              secret: env('PREVIEW_SECRET'),
            },
          },
          published: {
            url: `${env('FRONTEND_URL')}/articles/{slug}`,
          },
        },
      ],
    },
  },
});
