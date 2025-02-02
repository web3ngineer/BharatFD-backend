
import dotenv from "dotenv";
import mongoDB from "./config/mongoDB";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
