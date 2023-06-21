const config = {
  productListUrl: 'https://www.huaweicloud.com/intl/zh-cn/product/',
  productSelector: '.card-title-text',
  fileName: 'huawei_cloud_oversea',
  title: '华为云国际站',
  maxConnections: 20,
  excludeCategory: ['精选推荐'],
  isThirdCategory: false,
  getProductListInfo: function ($, el) {
    const productElem = $(el);
    const descElem = productElem.parent().next();
    const linkElem = productElem.parent().parent().parent();
    const secondCategory = linkElem.parent().parent().parent();

    const productInfo = {};
    productInfo.name = productElem.text();
    productInfo.desc = descElem.text();
    productInfo.link = linkElem.attr('href');
    productInfo.firstCategory = secondCategory.children(':first-child').text();
    productInfo.firstCategoryCount =
      secondCategory.find('.card-title-text').length;

    return productInfo;
  },
  getProductDetailInfo: function ($, productInfo) {
    productInfo.desc_info = $('.prodoc-description.pc').text();
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

module.exports = config;
