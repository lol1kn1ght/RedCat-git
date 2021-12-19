const http = require("http");
const createHandler = require("github-webhook-handler");
const shell = require("shelljs");
const REPO_NAME = "RedCat-git";
const PORT = process.env.PORT || 6769;

let handler = createHandler({path: "/", secret: "test"});

let handler = createHandler({path: "/", secret: "redcattest"});

http
  .createServer((req, res) => {
    handler(req, res, () => {
      res.statusCode = 404;
      res.end("no such location");
    });
  })
  .listen(PORT);

handler.on("error", err => console.error("Error:", err.message));
handler.on("push", function(event) {
  const repository = event.payload.repository.name;
  console.log(`Получен Push из ${repository}`);
  if (repository === REPO_NAME) {
    shell.cd("..");
    shell.exec("~/bots/RedCat-git/auto_deploy");
  }
});
