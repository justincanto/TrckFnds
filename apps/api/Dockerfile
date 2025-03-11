# Use the official Node.js image as the base image
FROM node:20 AS base

# Set up PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack disable && npm install -g pnpm

# Set the working directory to the monorepo root
WORKDIR /monorepo

# Copy the root package.json, pnpm-workspace.yaml and pnpm-lock.yaml
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy the shared package
COPY packages/ ./packages/

# Copy the API app
COPY apps/api/ ./apps/api/

# Install dependencies
# RUN pnpm install
RUN pnpm install --no-frozen-lockfile

# Set the working directory to the API app
WORKDIR /monorepo/apps/api

# Install tsx globally
RUN pnpm add -g tsx

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["pnpm", "start"]