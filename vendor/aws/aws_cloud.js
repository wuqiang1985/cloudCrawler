const { crawProductListPage, trim } = require('../../crawler');

const config = {
  productListUrl: 'https://aws.amazon.com/cn/',
  productSelector:
    '#m-nav-panel-products .m-nav-col-1 .m-nav-panel-link:not(.m-nav-txt-large)',
  fileName: 'aws_cloud',
  title: '亚马逊云',
  maxConnections: 20,
  excludeCategory: ['特色服务'],
  isThridCategory: false,
  isProductListCsr: true,
  getProductListInfo: async function (page) {
    const productList = { info: [] };
    const excludeCategory = ['特色服务'];

    const products = await page
      .locator(
        '#m-nav-panel-products .m-nav-col-1 .m-nav-panel-link:not(.m-nav-txt-large):not(.m-nav-txt-xlarge) > a'
      )
      .all();
    let i = 0;
    let index = 0;
    for (let product of products) {
      const productInfo = {};

      const linkElem = product;
      const firstCategory = product.locator('../..');

      const nameDescription = await linkElem.innerHTML();
      let [name, description] = nameDescription.split('<span>');
      description = description.replace('</span>', '');

      productInfo.name = name;
      productInfo.desc = description;
      productInfo.link = await linkElem.getAttribute('href');
      productInfo.firstCategory = await firstCategory
        .locator('.m-nav-panel-link')
        .first()
        .textContent();
      productInfo.firstCategoryCount =
        (await firstCategory.locator('.m-nav-panel-link').count()) - 1;

      if (i === 0) {
        productInfo.needFirstCategory = true;
      } else {
        const preProd = productList.info[i - index - 1];
        productInfo.needFirstCategory =
          productInfo.firstCategory === preProd?.firstCategory ? false : true;
      }

      if (excludeCategory) {
        if (!excludeCategory.includes(trim(productInfo.firstCategory))) {
          productList.info.push(productInfo);
        } else {
          index++;
        }
      } else {
        productList.info.push(productInfo);
      }
      i++;
    }

    return productList;
  },
  getProductDetailInfo: function ($, productInfo) {
    productInfo.desc_info =
      $('.lb-row h3.lb-txt-white').text() ||
      $('.lb-row h1.lb-txt-white').text();
    // const match = productInfo.desc_info.match(/（.*?）/);
    // if (match) {
    //   var fullName = match[0].replace("（", "").replace("）", "");
    //   var names = fullName.split("，");
    //   productInfo.enName = names[0] ?? "";
    //   productInfo.enShortName = names[1] ?? "";
    // }

    return productInfo;
  },
};

crawProductListPage(config);
