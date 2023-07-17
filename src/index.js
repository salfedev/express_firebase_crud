import "dotenv/config";
import express from 'express';
import cors from 'cors';
import logger from "./logger.js";
import routes from "./routes/index.js";
import * as db from "./firebase.js";
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
// initialize express
const app = express();
app.use(cors());

// port
const port = process.env.PORT || 3000;

// routes
routes(app, db, logger);

// server-side rendering
app.get("*", async (req, res) => {
  const app = createSSRApp({
    template: `
      <div id="app">
        <h1>Server-side rendering</h1>
        <p>{{ message }}</p>
        <button @click="count++">{{ count }} +</button>
      </div>
    `,
    data() {
      return {
        message: "Hello, Vue!",
        count: 0,
      };
    },
  });
  const appContent = await renderToString(app);
  const html = `
    <html>
      <head>
        <title>Vue 3 SSR</title>
        <script>
          // this runs in the browser.
          import { createSSRApp } from 'vue'

          const app = createSSRApp({
            // ...same app as on server
          })

          // mounting an SSR app on the client assumes
          // the HTML was pre-rendered and will perform
          // hydration instead of mounting new DOM nodes.
app.mount('#app')
        </script>
      </head>
      <body>
        ${appContent}
      </body>
    </html>
  `;
  res.send(html);
});


// start the Express server
app.listen(port, () => {
  logger.log_green(`Server listening on port ${port}!`);
});
