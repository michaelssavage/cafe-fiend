import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, _context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  const { latitude, longitude, radius } = event.queryStringParameters || {};

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=cafe&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ results: data.results, status: "OK" }),
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: data.status }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch places" }),
    };
  }
};
