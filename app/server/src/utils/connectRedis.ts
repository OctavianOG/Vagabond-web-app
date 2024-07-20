import { createClient } from "redis";

const redisURL = `redis://localhost:6379`;
const redisClient = createClient({
  url: redisURL,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectRedis();

redisClient.on("error", (err) => console.error(err));

export default redisClient;
