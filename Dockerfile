# Step 1: Use a Node.js image to build the app
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Expose the port that the development server will run on
EXPOSE 3000

# Step 7: Run the development server
CMD ["npm", "run", "dev"]
