const { crawProductListPage } = require("../../crawler");

const config = {
  productListUrl: "https://www.alibabacloud.com/zh/product",
  productSelector: ".product-tit",
  fileName: "ali_cloud_oversea",
  title: "阿里云国际站",
  rateLimit: 800,
  // maxConnections: 20,
  isThridCategory: true,
  getProductListInfo: function ($, el) {
    const productElem = $(el);
    const descElem = productElem.next();
    const linkElem = productElem.parent();
    const secondCategory = linkElem.parent().parent().parent();
    const firstCategory = secondCategory.parent();

    const productInfo = {};
    productInfo.name = productElem.text();
    productInfo.desc = descElem.text();
    productInfo.link = linkElem.attr("href").replace("/product", "/zh/product");

    productInfo.firstCategory = firstCategory.children(":first-child").text();
    productInfo.firstCategoryCount = firstCategory.find(".product-tit").length;
    // 有几个大类没有二级标题
    productInfo.secondCategory =
      secondCategory.children(":first-child").attr("class").indexOf("card-ti") >
      -1
        ? secondCategory.children(":first-child").text()
        : "";
    productInfo.secondCategoryCount =
      secondCategory.find(".product-tit").length;

    return productInfo;
  },
  getProductDetailInfo: function ($, productInfo) {
    if ($("title").text() === "") {
      console.error(`\n触发防护，请适当增大rateLimit`);
      process.exit(0);
    }

    const desc_info =
      $(".solution-text").text() ||
      $(".adv-desc").text() ||
      $(".module-wrap .container .description").eq(0).text();

    productInfo.desc_info = desc_info;
    // console.log(productInfo.name + ":" + productInfo.desc_info);
    // console.log(`title:${$("title").text()}`);
    // console.log("--------------------------------------------------------");
    const match = productInfo.desc_info.match(/（.*?）/);
    if (match) {
      var fullName = match[0].replace("（", "").replace("）", "");
      // console.log(fullName);
      var names = fullName.split("，");
      productInfo.enName = names[0] ?? "";
      productInfo.enShortName = names[1] ?? "";
    }

    return productInfo;
  },
};

crawProductListPage(config);
