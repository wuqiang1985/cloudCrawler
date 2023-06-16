const { crawProductListPage } = require("../../crawler");

const config = {
  productListUrl: "https://www.aliyun.com/product/list",
  productSelector: ".sitem-title",
  fileName: "ali_cloud",
  title: "阿里云国内站",
  maxConnections: 20,
  isThridCategory: true,
  isProductListCsr: true,
  getProductListInfo: async function (page) {
    const productList = { info: [] };
    const nav = await page.locator(".ace-tabs-nav");
    await nav.waitFor();
    for (const li of await page.locator(".ace-tabs-tab").all()) {
      await li.click();
    }

    const products = await page.locator(".sitem-title").all();
    let i = 0;
    for (let product of products) {
      const productInfo = {};

      const descElem = product.locator("..").locator(".sitem-des");
      const linkElem = product.locator("..");
      const secondCategory = product.locator("../../../../..");
      const firstCategory = product.locator("../../../../../../..");

      productInfo.name = await product.textContent();
      productInfo.desc = await descElem.textContent();
      productInfo.link = await linkElem.getAttribute("href");
      productInfo.firstCategory = await firstCategory
        .locator(".header-title")
        .textContent();
      productInfo.firstCategoryCount = await firstCategory
        .locator(".sitem-title")
        .count();
      productInfo.secondCategory = await secondCategory
        .locator(".citem-box-title")
        .textContent();
      productInfo.secondCategoryCount = await secondCategory
        .locator(".sitem-title")
        .count();

      if (i === 0) {
        productInfo.needFirstCategory = true;
        productInfo.needSecondCategory = true;
      } else {
        const preProd = productList.info[i - 1];

        productInfo.needFirstCategory =
          productInfo.firstCategory === preProd.firstCategory ? false : true;
        productInfo.needSecondCategory =
          productInfo.secondCategory === preProd.secondCategory ? false : true;
      }

      productList.info.push(productInfo);
      i++;
    }

    return productList;
  },
  getProductDetailInfo: function ($, productInfo) {
    productInfo.desc_info = $(".desc").text();
    const match = productInfo.desc_info.match(/（.*?）/);
    if (match) {
      var fullName = match[0].replace("（", "").replace("）", "");
      var names = fullName.split("，");
      productInfo.enName = names[0] ?? "";
      productInfo.enShortName = names[1] ?? "";
    }

    return productInfo;
  },
};

crawProductListPage(config);
