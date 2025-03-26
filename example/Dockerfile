FROM oven/bun AS base


FROM base AS build
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun build --compile --minify-whitespace --minify-syntax --target bun --outfile ./dist/server ./src/main.ts


FROM gcr.io/distroless/base AS runner

LABEL maintainer="Cuong Nguyen <cuongnt2612@gmail.com>"
LABEL version="1.0"

WORKDIR /app

COPY --from=build /app/dist ./

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -I http://localhost:3000 || exit 1

ENV PATH="/app:${PATH}"
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

USER nonroot

CMD ["serve"]