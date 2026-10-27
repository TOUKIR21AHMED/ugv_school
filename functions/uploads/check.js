export function onRequest() {
  return new Response("UPLOAD FUNCTION WORKING", {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
