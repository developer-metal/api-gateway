export const jwtConstants = {
  secret: Buffer.from(process.env.SECRETKEY_FEEDBACK, 'base64')
};
