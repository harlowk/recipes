# 🛠 Build the builder image
FROM node:16 as builder

WORKDIR /builder

# Copy
COPY . .

# Install
RUN yarn || (cat /tmp/*/build.log; exit 1)
RUN yarn build

# Using Yarn plugin-production-install to copy only production dependencies
RUN yarn prod-install /deploy/dependencies

# Copy other needed files
RUN cp -r . /deploy

FROM node:16 as runner
WORKDIR /runner

# Copy files in logical layer order
COPY --from=builder /deploy/dependencies .
COPY --from=builder /deploy .

# Expose port
EXPOSE 3000
EXPOSE 4000

# Start server
CMD ["yarn", "start"]