import { ProfilesSchema } from '../schemas/Profiles.schema';

export const ProfilesProviders = {
  name: 'Profiles',
  useFactory: () => ProfilesSchema
};
