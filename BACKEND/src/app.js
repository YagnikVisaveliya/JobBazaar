import express, { application } from"express"
import cors from"cors"
import cookieParser from "cookie-parser";

const app = express();
const DEFAULT_WHITELIST = [
  "https://job-bazaar.vercel.app",
  "https://jobbazaar.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const envOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const WHITELIST = [...new Set([...DEFAULT_WHITELIST, ...envOrigins])];

// normalize helper to remove trailing slashes
const normalize = (u) => (typeof u === 'string' ? u.replace(/\/+$/, '') : u);

const normalizedWhitelist = WHITELIST.map(normalize);

app.set("trust proxy", 1);

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (e.g. server-to-server, Postman)
    if (!origin) return callback(null, true);

    const incoming = normalize(origin);
    console.log('CORS incoming origin:', incoming);

    if (normalizedWhitelist.includes(incoming)) {
      // echo back the exact incoming origin (no trailing slash)
      return callback(null, true);
    }

    return callback(new Error('CORS policy: This origin is not allowed: ' + origin));
  },
  credentials: true
}));
app.use(express.json())//limit is used when haivyload 
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())//browser ma CRUD operation carva

import userRoutes from "./routes/user.routes.js";
import companyRoute from "./routes/company.routes.js"
import jobRoute from "./routes/job.routes.js"
import applicationRoute from "./routes/application.routes.js"



app.use("/api/v2/user",userRoutes);
app.use("/api/v2/company",companyRoute);
app.use('/api/v2/jobs', jobRoute);
app.use('/api/v2/applications', applicationRoute);


export { app }