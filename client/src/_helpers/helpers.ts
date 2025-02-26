export const sanitizeKey = (key: string) => key.replace(/\./g, '_');

export async function retryOriginalRequest(originalResponse: Response, newToken: string): Promise<any> {
  const originalRequest = {
    method: originalResponse.url,
    headers: {
      ...originalResponse.headers,
      'Authorization': `Bearer ${newToken}`
    },
    body: originalResponse.body
  };

  const retryResponse = await fetch(originalResponse.url, originalRequest);
  const retryText = await retryResponse.text();
  return retryText && JSON.parse(retryText);
}