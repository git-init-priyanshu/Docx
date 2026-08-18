/**
 * Browser-side Google Drive picker.
 *
 * The access token never leaves the browser and is never persisted. Import is
 * an on-demand action, so there is nothing to do in the background and no
 * reason to hold a refresh token — which also keeps the app out of Google's
 * restricted-scope review, since `drive.file` only ever grants access to the
 * exact files a user hands over through this picker.
 */

const SCOPE = "https://www.googleapis.com/auth/drive.file";
const DOCS_MIME_TYPE = "application/vnd.google-apps.document";

export type PickedDocument = {
  id: string;
  name: string;
};

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
};

type TokenClient = {
  callback: (response: TokenResponse) => void;
  requestAccessToken: (overrides?: { prompt?: string }) => void;
};

type PickerBuilder = {
  addView: (view: unknown) => PickerBuilder;
  setOAuthToken: (token: string) => PickerBuilder;
  setDeveloperKey: (key: string) => PickerBuilder;
  setAppId: (appId: string) => PickerBuilder;
  setTitle: (title: string) => PickerBuilder;
  setCallback: (callback: (data: PickerCallbackData) => void) => PickerBuilder;
  build: () => { setVisible: (visible: boolean) => void };
};

type PickerCallbackData = {
  action?: string;
  docs?: { id: string; name: string }[];
};

type GoogleGlobal = {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }) => TokenClient;
    };
  };
  picker: {
    PickerBuilder: new () => PickerBuilder;
    DocsView: new (viewId?: string) => {
      setMimeTypes: (types: string) => unknown;
    };
    ViewId: { DOCS: string };
    Action: { PICKED: string; CANCEL: string };
  };
};

declare global {
  interface Window {
    google?: GoogleGlobal;
    gapi?: { load: (name: string, callback: () => void) => void };
  }
}

export class GooglePickerError extends Error {}

const config = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const developerKey = process.env.NEXT_PUBLIC_GOOGLE_PICKER_KEY;
  const appId = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER;

  if (!clientId || !developerKey || !appId)
    throw new GooglePickerError("Google import is not configured");

  return { clientId, developerKey, appId };
};

export const isPickerConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
      process.env.NEXT_PUBLIC_GOOGLE_PICKER_KEY &&
      process.env.NEXT_PUBLIC_GOOGLE_PROJECT_NUMBER,
  );

const loading = new Map<string, Promise<void>>();

// Loaded on first use rather than from the layout, so Google's scripts are not
// pulled into every page for a feature most visits never touch.
const loadScript = (src: string) => {
  const pending = loading.get(src);
  if (pending) return pending;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading.delete(src);
      reject(new GooglePickerError("Could not reach Google"));
    };
    document.body.appendChild(script);
  });

  loading.set(src, promise);
  return promise;
};

const loadPickerApi = async () => {
  await loadScript("https://apis.google.com/js/api.js");
  await new Promise<void>((resolve) => window.gapi?.load("picker", resolve));
};

/**
 * Warms both Google scripts ahead of the click. Google's consent popup is
 * opened from a user gesture, and a gesture does not survive waiting on a
 * network request, so the scripts have to already be there when the handler
 * runs. Called on hover and focus rather than on mount, to keep Google's code
 * off dashboard visits that never import anything.
 */
export const preloadGooglePicker = () => {
  if (!isPickerConfigured()) return;
  loadScript("https://accounts.google.com/gsi/client").catch(() => {});
  loadPickerApi().catch(() => {});
};

let cachedToken: { value: string; expiresAt: number } | null = null;

const requestToken = async () => {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  await loadScript("https://accounts.google.com/gsi/client");
  const { clientId } = config();

  return new Promise<string>((resolve, reject) => {
    const client = window.google?.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: (response) => {
        if (!response.access_token) {
          reject(new GooglePickerError(response.error ?? "Access was denied"));
          return;
        }
        // A minute of headroom so a token cannot expire between the picker
        // handing back a file and the document fetch that follows.
        cachedToken = {
          value: response.access_token,
          expiresAt: Date.now() + ((response.expires_in ?? 3600) - 60) * 1000,
        };
        resolve(response.access_token);
      },
    });

    if (!client) {
      reject(new GooglePickerError("Could not reach Google"));
      return;
    }
    client.requestAccessToken();
  });
};

const showPicker = (token: string) => {
  const { developerKey, appId } = config();
  const picker = window.google?.picker;
  if (!picker) throw new GooglePickerError("Could not reach Google");

  return new Promise<PickedDocument | null>((resolve) => {
    const view = new picker.DocsView(picker.ViewId.DOCS);
    view.setMimeTypes(DOCS_MIME_TYPE);

    new picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(token)
      .setDeveloperKey(developerKey)
      .setAppId(appId)
      .setTitle("Choose a document to import")
      .setCallback((data) => {
        if (data.action === picker.Action.CANCEL) resolve(null);
        if (data.action !== picker.Action.PICKED) return;

        const [file] = data.docs ?? [];
        resolve(file ? { id: file.id, name: file.name } : null);
      })
      .build()
      .setVisible(true);
  });
};

/**
 * Resolves to the file the user chose, or null when they dismissed the picker.
 * The token is returned alongside because it is the only thing authorising the
 * document fetch that follows, and it is deliberately held nowhere else.
 */
export const pickGoogleDocument = async () => {
  const token = await requestToken();
  await loadPickerApi();
  const file = await showPicker(token);
  return file ? { file, token } : null;
};
