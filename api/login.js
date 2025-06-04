export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json();
  const { rfid } = body;

  const allowedRFIDs = ['0006351492', 'Fizzxx'];

  const valid = allowedRFIDs.includes(rfid);
  return new Response(JSON.stringify({ success: valid }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
