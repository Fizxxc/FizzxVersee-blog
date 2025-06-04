export default async function handler(req) {
  const { rfid } = await req.json();
  const allowedRFIDs = ['0006351492', 'Fizzx'];

  const valid = allowedRFIDs.includes(rfid);
  return new Response(JSON.stringify({ success: valid }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
