export const configLoader = () => ({
    port: process.env.PORT ?? 5500,
    hostApi: process.env.HOST_API ?? 'http://localhost:3500',
    endpointCsrf: '/api/v1/csrf-check',
    endpointSendform: '/api/v1/form-general',
    sendSurvey: '/api/v1/survey',
    apiKey: process.env.APIKEY,
    googleRecaptchaOptions: process.env.GOOGLE_RECAPTCHA_SECRET_KEY ?? ''
  });
  