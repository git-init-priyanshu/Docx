import {
  issueSignedToken,
  presignUrl,
  type IssuedSignedToken,
} from "@vercel/blob";

// Minting a delegation token is a round trip to Vercel's control API and costs
// around 250ms; signing a URL from one is local HMAC and costs about 1ms. Doing
// the first per image meant a dashboard paid it once per thumbnail, so the
// token is minted once and reused until it is close to lapsing.
const TOKEN_TTL_MS = 30 * 60 * 1000;
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

// Long enough for a slow page to finish loading its images, short enough that a
// copied URL is worthless by the time it is pasted anywhere. The margin above
// guarantees the token always has at least this much life left, so a URL is
// never cut short by the token behind it.
const LINK_TTL_MS = 5 * 60 * 1000;

type CachedToken = { token: IssuedSignedToken; validUntil: number };

let cached: CachedToken | null = null;
let inFlight: Promise<CachedToken> | null = null;

// Scoped to the whole store rather than to one path, which is what makes it
// reusable. It never leaves the server: callers only ever receive a URL for a
// single path, and only after the caller has been authorised for it.
const mintToken = async (): Promise<CachedToken> => {
  const validUntil = Date.now() + TOKEN_TTL_MS;

  const token = await issueSignedToken({
    // Explicit for the same reason as the upload route: left out, the SDK
    // prefers VERCEL_OIDC_TOKEN whenever BLOB_STORE_ID is set, which fails
    // anywhere OIDC is not enabled.
    token: process.env.BLOB_READ_WRITE_TOKEN,
    pathname: "*",
    operations: ["get"],
    validUntil,
  });

  return { token, validUntil };
};

const delegationToken = async () => {
  if (cached && cached.validUntil - REFRESH_MARGIN_MS > Date.now())
    return cached.token;

  // Without this, the first paint of a dashboard full of images would fire one
  // mint per thumbnail before any of them resolved.
  inFlight ??= mintToken()
    .then((minted) => {
      cached = minted;
      return minted;
    })
    .finally(() => {
      inFlight = null;
    });

  return (await inFlight).token;
};

/** A short-lived URL the browser can fetch one private blob with. */
export const signedImageUrl = async (pathname: string) => {
  const token = await delegationToken();

  const { presignedUrl } = await presignUrl(token, {
    operation: "get",
    pathname,
    access: "private",
    validUntil: Date.now() + LINK_TTL_MS,
  });

  return presignedUrl;
};

export const IMAGE_LINK_TTL_MS = LINK_TTL_MS;
