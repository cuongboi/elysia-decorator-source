import { t, type Static } from 'elysia';

export const AppParams = t.Object({
  name: t.String(),
});

export type AppParams = Static<typeof AppParams>;

export const AppPostSchema = t.Object({
  title: t.String(),
  content: t.String(),
});

export type AppPostSchema = Static<typeof AppPostSchema>;
