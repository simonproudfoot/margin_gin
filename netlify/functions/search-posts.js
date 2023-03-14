const axios = require("axios");
const https = require("https");

exports.handler = async (event, context) => {
  const consumerKey = process.env.WOO_USER;
  const consumerSecret = process.env.WOO_SECRET;
  const storeUrl = process.env.BASE_URL;
  const { title } = JSON.parse(event.body);

  try {
    const response = await axios({
      method: "get",
      url: `${storeUrl}/wp-json/wp/v2/search/?search=${title}`,
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    const posts = response.data;
    return {
      statusCode: 200,
      body: JSON.stringify({
        posts,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
