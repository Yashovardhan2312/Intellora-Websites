// Serves the static site from ./public and enforces one canonical address:
//   http://*  ->  https://*
//   https://intellora.co.in/...  ->  https://www.intellora.co.in/...
// `assets.run_worker_first` is enabled so this runs before static files are served.

const CANONICAL_HOST = "www.intellora.co.in";
const APEX_HOST = "intellora.co.in";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";

    if (!isLocal && (url.protocol === "http:" || url.hostname === APEX_HOST)) {
      url.protocol = "https:";
      if (url.hostname === APEX_HOST) url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
