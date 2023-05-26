/**
 * @see {@link https://developers.cloudflare.com/workers/examples/cors-header-proxy/}
 */
export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');

  // Rewrite request to point to target URL.
  // This also makes the request mutable so you can add the correct
  // Origin header to make the API server think that this request is not cross-site.
  context.request = new Request(targetUrl, context.request);
  context.request.headers.set('Origin', new URL(targetUrl).origin);

  // Recreate the response so you can modify the headers
  let response = await fetch(context.request);
  response = new Response(response.body, response);

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');

  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append('Vary', 'Origin');

  return response;
};

/**
 * Handle CORS preflight requests.
 */
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
  });
};