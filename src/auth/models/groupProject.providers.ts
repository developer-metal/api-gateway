import { GroupProjectSchema } from '../schemas/GroupProject.schema';

export const GroupProjectsProviders = {
  name: 'GroupProject',
  useFactory: () => GroupProjectSchema
};
