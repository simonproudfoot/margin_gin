const axios = require("axios");
const https = require("https");

exports.handler = async (event, context) => {
  const consumerKey = process.env.WOO_USER;
  const consumerSecret = process.env.WOO_SECRET;
  const storeUrl = process.env.BASE_URL;
  const { couponCode } = JSON.parse(event.body);

  try {
    const response = await axios({
      method: "get",
      url: `${storeUrl}/wp-json/wc/v2/coupons/?code=${couponCode}`,
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    const discount = response.data;
    return {
      statusCode: 200,
      body: JSON.stringify({
        discount: discount.length ? discount[0] : null,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
