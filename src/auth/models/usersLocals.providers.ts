import { UsersLocalsSchema } from '../schemas/UsersLocals.schema';

export const UsersLocalsProviders = {
  name: 'Users',
  useFactory: () => UsersLocalsSchema
};
