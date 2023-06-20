const { crawProductListPage } = require('../../crawler');

const config = {
  productListUrl: 'https://cloud.tencent.com/product',
  productSelector: '.proovr-collect__card-title',
  fileName: 'tencent_cloud',
  title: '腾讯云国内站',
  maxConnections: 20,
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
    productInfo.link = linkElem.attr('href');
    productInfo.firstCategory = firstCategory
      .find('.proovr-collect__param-title')
      .text();
    productInfo.firstCategoryCount = firstCategory.find(
      '.proovr-collect__card-title'
    ).length;
    productInfo.secondCategory = secondCategory.children(':first-child').text();
    productInfo.secondCategoryCount = secondCategory.find(
      '.proovr-collect__card-title'
    ).length;

    return productInfo;
  },
  getProductDetailInfo: function ($, productInfo) {
    // console.log("title:" + $("title").text());
    productInfo.desc_info = $('.tpm-prod-hero__desc').text();
    const match = productInfo.desc_info.match(/（.*?）/);
    if (match) {
      var fullName = match[0].replace('（', '').replace('）', '');
      var names = fullName.split('，');
      productInfo.enName = names[0] ?? '';
      productInfo.enShortName = names[1] ?? '';
    }

    return productInfo;
  },
};

crawProductListPage(config);
