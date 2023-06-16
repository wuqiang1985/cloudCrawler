const { crawProductListPage } = require("../../crawler");

const config = {
  productListUrl: "https://cloud.google.com/products?hl=zh-cn",
  productSelector: ".cws-headline",
  fileName: "gcp_cloud",
  title: "谷歌云",
  maxConnections: 20,
  excludeCategory: ["精选产品"],
  isThridCategory: false,
  getProductListInfo: function ($, el) {
    const productElem = $(el);
    const descElem = productElem.next();
    const linkElem = productElem.parent().parent().parent();
    const firstCategory = linkElem.parent().parent().parent().parent().parent();

    const productInfo = {};
    productInfo.name = productElem.text();
    productInfo.desc = descElem.text();
    productInfo.link = linkElem.attr("href");
    productInfo.firstCategory = firstCategory
      .find(".cws-content-block__headline")
      .text();
    productInfo.firstCategoryCount = firstCategory.find(".cws-headline").length;

    return productInfo;
  },
  getProductDetailInfo: function ($, productInfo) {
    productInfo.desc_info = $("div.cws-body--large.richtext").text();
    // const match = productInfo.desc_info.match(/（.*?）/);
    // if (match) {
    //   var fullName = match[0].replace("（", "").replace("）", "");
    //   // console.log(fullName);
    //   var names = fullName.split("，");
    //   productInfo.enName = names[0] ?? "";
    //   productInfo.enShortName = names[1] ?? "";
    // }

    return productInfo;
  },
};

crawProductListPage(config);
