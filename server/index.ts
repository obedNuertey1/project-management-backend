import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
config();
import schema from "./schema/schema";
import colors from "colors";
import ConnectDb from "./config/db";

const app = express();
// Connect to database
ConnectDb();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV=="development"
}));

const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
});