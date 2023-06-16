const { crawProductListPage } = require("../../crawler");

const config = {
  productListUrl: "https://azure.microsoft.com/zh-cn/products/",
  productSelector: ".text-heading5",
  fileName: "azure_cloud",
  title: "微软云",
  maxConnections: 20,
  isThridCategory: false,
  getProductListInfo: function ($, el) {
    const getParentCategory = (ele) => {
      let preElement = ele.prev();
      while (preElement) {
        if (preElement.hasClass("column")) {
          return preElement;
        } else {
          preElement = preElement.prev();
        }
      }
    };

    const getCategoryProductCount = (ele) => {
      let count = 0;
      let nextElement = ele.next();
      while (nextElement && nextElement.length) {
        if (!nextElement.hasClass("column")) {
          count += nextElement.children().length;
          nextElement = nextElement.next();
        } else {
          return count;
        }
      }

      return count;
    };

    const productElem = $(el);
    const descElem = productElem.next();
    const linkElem = productElem.children();
    const firstCategory = getParentCategory(productElem.parent().parent());

    const productInfo = {};
    productInfo.name = productElem.text();
    productInfo.desc = descElem.text();
    productInfo.link = `https://azure.microsoft.com${linkElem.attr("href")}`;
    productInfo.firstCategory = firstCategory.find(".product-category").text();
    productInfo.firstCategoryCount = getCategoryProductCount(firstCategory);

    return productInfo;
  },
  getProductDetailInfo: function ($, productInfo) {
    productInfo.desc_info = $("#overview div[data-oc-token-text]").text();
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
