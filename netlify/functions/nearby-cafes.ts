import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, _context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  const { latitude, longitude, radius } = event.queryStringParameters || {};

  // Validate required parameters
  if (!latitude || !longitude || !radius) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: "Missing required parameters: latitude, longitude, radius" 
      }),
    };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=cafe&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`;
    
    console.log("Fetching from Google Places API...");
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("Google Places API error:", response.status, response.statusText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Google Places API error: ${response.status}` }),
      };
    }

    const data = await response.json();

    if (data.status === "OK") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ results: data.results, status: "OK" }),
      };
    } else {
      console.error("Google Places API returned error status:", data.status);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: data.status }),
      };
    }
  } catch (error) {
    console.error("Error in nearby-cafes function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch places" }),
    };
  }
};
