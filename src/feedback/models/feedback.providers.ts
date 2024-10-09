import { FeedbackSchema } from '../schemas/feedback.schema';

export const FeedbackProviders = {
  name: 'Feedback',
  useFactory: () => FeedbackSchema
};
