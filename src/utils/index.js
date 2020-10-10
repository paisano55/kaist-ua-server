const parseJSON = (jsonString, fallback = {}) => {
  if (typeof jsonString === 'object') {
    return jsonString;
  }

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error(jsonString);
    console.error(err.message);
    return fallback;
  }
};

const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
}

async function jwtMiddleware(ctx, next) {
  const token = ctx.cookies.get(process.env.ACCESS_TOKEN);
  if (!token) return next(); // 토큰이 없으면 바로 다음 작업을 진행합니다.
  try {
    const decoded = await decodeToken(token.toString()); // 토큰을 디코딩 합니다
    // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급합니다
    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      // 하루가 지나면 갱신해준다.
      const { id } = decoded;
      const { generateToken } = require('../routes/auth/generateToken');
      const freshToken = await generateToken({ id });
      ctx.cookies.set(process.env.ACCESS_TOKEN, freshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
        httpOnly: true,
      });
    }
    // ctx.request.user 에 디코딩된 값을 넣어줍니다
    ctx.request.user = decoded;
  } catch (e) {
    // token validate 실패
    ctx.request.user = 'ERROR';
  }

  return next();
}

module.exports = { parseJSON, jwtMiddleware };
