const BACKEND = "https://united-school-api.onrender.com";

export async function onRequest(context) {
  const url = new URL(context.request.url);

  const target = new URL(
    url.pathname + url.search,
    BACKEND
  );

  const request = new Request(target, context.request);

  return fetch(request, {
    redirect: "follow"
  });
}
