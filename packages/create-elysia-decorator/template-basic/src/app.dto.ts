import { type Static, Type } from 'elysia-decorator';

export const AppParams = Type.Object({
  name: Type.String(),
});

export type AppParams = Static<typeof AppParams>;

export const AppPostSchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
});

export type AppPostSchema = Static<typeof AppPostSchema>;
