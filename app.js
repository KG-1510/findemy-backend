const express = require("express");
const coursesRoutes = require("./courses/courses.routes");
// import { onError, onNotFound } from './error/error.controller';

const app = express();

/** Routes connection */
app.use("/courses", coursesRoutes);

/** Middleware Endpoints */
//   app.use(onNotFound);
//   app.use(onError);

app.listen(process.env.PORT || 3001, () => {
  console.log("✅ Server is started at port: 3001");
});