const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Ensure the request method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Parse the request body
  let requestData;
  try {
    requestData = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON' }),
    };
  }

  const { awb, courier } = requestData;

  // Ensure that the required fields are present
  if (!awb || !courier) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'AWB and Courier are required' }),
    };
  }

  try {
    // Replace this URL with the actual API endpoint you're using
    const response = await fetch(`https://api.binderbyte.com/v1/track?api_key=${process.env.API_KEY}&courier=${courier}&awb=${awb}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,  // Example of using an API key from environment variables
      },
    });

    const data = await response.json();

    // If the external API returns an error
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: data.message || 'Error fetching tracking data' }),
      };
    }

    // Return the tracking data
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully tracked package', data }),
    };

  } catch (error) {
    // Handle errors
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server Error', error: error.message }),
    };
  }
};