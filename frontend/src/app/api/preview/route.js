import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const slug = url.searchParams.get('slug');

  // 1. Validate the secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid Preview Secret', { status: 401 });
  }

  // 2. Validate the path
  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 });
  }
  
  // Await the draftMode() function and store the result
  const draft = await draftMode(); 
  
  // 3. Enable Draft Mode using the awaited object
  draft.enable(); // <-- FIX: Use 'draft.enable()' instead of 'draftMode().enable()'

  // 4. Redirect to the content page
  redirect(`/articles/${slug}`);
}
// Example fix for app/articles/page.js
async function getArticles() {
  const { isEnabled } = await draftMode(); // Must be awaited here too!
  // ... rest of logic
}
