FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency definition files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app in dev mode with hot-reloading
CMD ["pnpm", "run", "dev"]
