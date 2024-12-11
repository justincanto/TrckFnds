# Use the official Node.js image as the base image
FROM node:20 AS base

# Set up PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy the application code
COPY . /app

# Set the working directory
WORKDIR /app

# Install dependencies (without rebuilding or building the app)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

RUN pnpm add -g tsx

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["pnpm", "start"]