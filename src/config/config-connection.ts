export const configConnect = {
  useFactory: () => ({
    uri: process.env.URI_MONGO_BACKEND ?? 'mongodb://mongodb:27017/backend'
  })
};
