const Crawler = require("crawler");
const { chromium } = require("playwright");
const ProgressBar = require("progress");

const {
  generateProductJson,
  generateProductMd,
  generateProductPdf,
  trim,
} = require("./fileHelper");

function crawProductListPage(config) {
  const { title, rateLimit, isProductListCsr } = config;

  console.log(`---------->>>>> 开始${rateLimit ? "串行" : "并行"}爬取${title}`);

  if (isProductListCsr) {
    crawProductListPageCSR(config);
  } else {
    crawProductListPageSSR(config);
  }
}

function crawProductListPageSSR(config) {
  const {
    productListUrl,
    productSelector,
    getProductListInfo,
    excludeCategory,
  } = config;

  const crawler = new Crawler();
  crawler.direct({
    uri: productListUrl,
    skipEventRequest: false,
    callback: (error, res) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`【1】商品列表页：${productListUrl}`);
        const productList = { info: [] };
        const $ = res.$;

        let index = 0;
        $(productSelector).map((i, el) => {
          const productInfo = getProductListInfo($, el);

          if (i === 0) {
            productInfo.needFirstCategory = true;
            productInfo.needSecondCategory = true;
          } else {
            const preProd = productList.info[i - index - 1];
            productInfo.needFirstCategory =
              productInfo.firstCategory === preProd?.firstCategory
                ? false
                : true;
            productInfo.needSecondCategory =
              productInfo.secondCategory === preProd?.secondCategory
                ? false
                : true && productInfo.secondCategory?.length > 0;
          }

          if (excludeCategory) {
            // 被排除的分类才加入
            if (!excludeCategory.includes(trim(productInfo.firstCategory))) {
              productList.info.push(productInfo);
            } else {
              index++;
            }
          } else {
            productList.info.push(productInfo);
          }
        });

        console.log("产品列表页爬取完毕");
        generateProductJson(productList.info, config);
        crawProductDetail(productList.info, config);
      }
    },
  });
}

async function crawProductListPageCSR(config) {
  const { productListUrl, getProductListInfo } = config;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(productListUrl);

  const productList = await getProductListInfo(page);

  // generateProductJson(productList.info, config);
  crawProductDetail(productList.info, config);

  console.log("产品详情页爬取完毕");

  await page.close();
  await context.close();
  await browser.close();
}

let index = 0;
function crawProductDetail(productList, config) {
  const { getProductDetailInfo, rateLimit, maxConnections, title } = config;

  const bar = new ProgressBar(
    "【2】产品详情页 [:bar] :current :total :percent :etas",
    {
      width: 50,
      total: productList.length,
    }
  );

  const crawlerConfig = {
    callback: function (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        const $ = res.$;
        // const productInfo = productList[index];
        const productInfo = productList.find(
          (product) => product.link === res.request.uri.href
        );
        if (productInfo) {
          getProductDetailInfo($, productInfo);
        } else {
          if (rateLimit) {
            console.warn(`\n产品列表URL：${productList[index].link}`);
            console.warn(`实际跳转URL：${res.request.uri.href}`);
          } else {
            console.warn(`\n实际跳转URL：${res.request.uri.href}`);
          }
        }
      }
      bar.tick();
      index++;
      done();
    },
  };

  if (rateLimit) {
    // 串行爬取
    crawlerConfig.rateLimit = rateLimit;
  } else {
    // 并行爬取
    crawlerConfig.maxConnections = maxConnections;
  }

  const crawler = new Crawler(crawlerConfig);

  crawler.queue(productList.map((ele) => ele.link));
  crawler.on("drain", () => {
    console.log("产品详情页爬取完毕");

    generateProductJson(productList, config);
    generateProductMd(productList, config);
    // generateProductPdf(config);
    console.log(`<<<<<---------- ${title}爬取完成`);
  });
}

function analyzeProduct(productList) {
  const firstCategories = productList.filter(
    (product) => products.needFirstCategory
  );

  const secondCategories = productList.filter(
    (product) => products.needSecondCategory
  );
}

module.exports = { crawProductListPage, crawProductDetail, trim };
