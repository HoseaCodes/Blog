// Links from the portfolio into Asperia Games (asperiagames.com), carrying the
// current auth token so the arcade can credit points to the shared wallet.
//
// The token rides in the URL *hash*, never the query string: a fragment is not
// sent to the server, and never lands in access logs or the Referer header.
// asperiagames.com captures it into localStorage and strips it from the URL on
// arrival (see the handoff script in its BaseLayout). It's the same short-lived
// `accesstoken` the Storm-Gate SDK already stores in a JS-readable cookie; the
// arcade uses it only until it expires.
export const ASPERIA_URL = "https://asperiagames.com";

function readAccessToken() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)accesstoken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * Build a link to an asperiagames.com path, appending `#t=<token>` when the
 * visitor is authenticated here. When logged out, returns the plain URL.
 */
export function asperiaLink(path = "/arcade") {
  const url = ASPERIA_URL + (path.startsWith("/") ? path : `/${path}`);
  const token = readAccessToken();
  return token ? `${url}#t=${encodeURIComponent(token)}` : url;
}
