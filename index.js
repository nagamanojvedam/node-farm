const http = require("http");
const url = require("url");
const fs = require("fs");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

const homepageTemplate = fs.readFileSync(
  `${__dirname}/templates/menu.html`,
  "utf-8"
);
const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const cardsTemplate = fs.readFileSync(
  `${__dirname}/templates/card.html`,
  "utf-8"
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const apiData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const apiDataObj = JSON.parse(apiData);

apiDataObj.forEach((obj) => {
  obj.slug = slugify(obj.productName, { lower: true });
});

const port = 8000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const { pathname, query } = parsedUrl;

  switch (pathname) {
    case "/": {
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      res.end(homepageTemplate);
      break;
    }
    case "/product": {
      const product = replaceTemplate(productTemplate, apiDataObj[query.id]);

      res.writeHead(200, {
        "Content-type": "text/html",
      });
      res.end(product);
      break;
    }
    case "/overview": {
      const cardsHtml = apiDataObj
        .map((data) => replaceTemplate(cardsTemplate, data))
        .join("");

      const overview = overviewTemplate.replace(
        /{%PRODUCT_CARDS%}/g,
        cardsHtml
      );

      res.writeHead(200, {
        "Content-type": "text/html",
      });
      res.end(overview);
      break;
    }
    case "/api": {
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      res.end(JSON.stringify(apiDataObj));
      break;
    }
    default: {
      res.writeHead(200, {
        "Content-type": "text/html",
        "My-Own-Header": "testing-my-header",
      });
      res.end("<h1>Page not found!</h1>");
    }
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
