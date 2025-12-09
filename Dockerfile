FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port 4200 for Angular dev server
EXPOSE 4200

# Start Angular development server
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]
