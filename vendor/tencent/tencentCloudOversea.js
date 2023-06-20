const { crawProductListPage } = require('../../crawler');

const config = {
  productListUrl: 'https://www.tencentcloud.com/zh/product',
  productSelector: '.v3-product-menu-card-cell-tit',
  fileName: 'tencent_cloud_oversea',
  title: '腾讯云国际站',
  rateLimit: 500,
  // maxConnections: 20,
  isThridCategory: true,
  getProductListInfo: function ($, el) {
    const productElem = $(el);
    const descElem = productElem.next();
    const linkElem = productElem.parent();
    const secondCategory = linkElem
      .parent()
      .parent()
      .parent()
      .parent()
      .parent();
    const firstCategory = secondCategory.parent();

    const productInfo = {};
    productInfo.name = productElem.text();
    productInfo.desc = descElem.text();
    productInfo.link =
      'https://www.tencentcloud.com/zh' +
      linkElem.attr('href').replace('product', 'products');
    productInfo.firstCategory = firstCategory
      .find('.v3-product-menu-card-tit')
      .text();
    productInfo.firstCategoryCount = firstCategory.find(
      '.v3-product-menu-card-cell-tit'
    ).length;
    productInfo.secondCategory = secondCategory.children(':first-child').text();
    productInfo.secondCategoryCount = secondCategory.find(
      '.v3-product-menu-card-cell-tit'
    ).length;

    return productInfo;
  },
  getProductDetailInfo: function ($, productInfo) {
    if (!$) {
      console.error(`触发防护，请适当增大rateLimit`);
      process.exit(0);
    }

    productInfo.desc_info = $('.f-d-p-i-c__c__content__left > article').text();
    const match = productInfo.desc_info.match(/（.*?）/);
    if (match) {
      var fullName = match[0].replace('（', '').replace('）', '');
      // console.log(fullName);
      var names = fullName.split('，');
      productInfo.enName = names[0] ?? '';
      productInfo.enShortName = names[1] ?? '';
    }

    return productInfo;
  },
};

crawProductListPage(config);
