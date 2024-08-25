import { app } from "./app.js";
import dotenv from 'dotenv'
import connectDb from "./db/index.js";
 

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8001;
connectDb()
.then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongodb connection error", err);
  });

