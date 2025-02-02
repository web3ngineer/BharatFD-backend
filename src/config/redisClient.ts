
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string) // Ensure the port is a number
  }
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });
  
  async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}
connectRedis();

export default redisClient;