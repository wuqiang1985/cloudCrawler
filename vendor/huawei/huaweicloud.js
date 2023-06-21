const config = {
  productListUrl: 'https://www.huaweicloud.com/product/',
  productSelector: '.card-title-text',
  fileName: 'huawei_cloud',
  title: '华为云国内站',
  maxConnections: 20,
  isThirdCategory: true,
  excludeCategory: ['精选推荐'],
  getProductListInfo: function ($, el) {
    const productElem = $(el);
    const descElem = productElem.parent().next();
    const linkElem = productElem.parent().parent().parent();
    const secondCategory = linkElem.parent().parent().parent();
    const firstCategory = secondCategory.parent();

    const isMutiCategory =
      firstCategory.attr('class').indexOf('classify-item') > -1;

    const productInfo = {};
    productInfo.name = productElem.text();
    productInfo.desc = descElem.text();
    productInfo.link = linkElem.attr('href');

    if (isMutiCategory) {
      productInfo.firstCategory = firstCategory.children(':first-child').text();
      productInfo.firstCategoryCount =
        firstCategory.find('.card-title-text').length;
      productInfo.secondCategory = secondCategory
        .children(':first-child')
        .text();
      productInfo.secondCategoryCount =
        secondCategory.find('.card-title-text').length;
    } else {
      productInfo.firstCategory = secondCategory
        .children(':first-child')
        .text();
      productInfo.firstCategoryCount =
        secondCategory.find('.card-title-text').length;
    }

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
