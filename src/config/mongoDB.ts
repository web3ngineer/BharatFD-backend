import mongoose, { ConnectOptions } from "mongoose";
import { DB_NAME } from "../constants";

const mongoDB = async (): Promise<void> => {
    try {
        const connectionResponse = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`,
            {} as ConnectOptions
        );

        console.log(`MongoDB connected !! DB HOST: ${connectionResponse.connection.host}`);
    } catch (error) {
        console.error("MONGODB Connection error!", error);
        process.exit(1);
    }
};

export default mongoDB;
