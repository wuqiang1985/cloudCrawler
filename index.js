// const inquirer = require('inquirer');
const inquirer = require('inquirer');

const { crawProductListPage } = require('./crawler');

const ali_cloud = require('./vendor/ali/aliCloud');
const ali_cloud_oversea = require('./vendor/ali/aliCloudOversea');

const tencent_cloud = require('./vendor/tencent/tencentCloud');
const tencent_cloud_oversea = require('./vendor/tencent/tencentCloudOversea');

const huawei_cloud = require('./vendor/huawei/huaweiCloud');
const huawei_cloud_oversea = require('./vendor/huawei/huaweiCloudOversea');

const aws_cloud = require('./vendor/aws/aws');
const azure_cloud = require('./vendor/azure/azure');
const gcp_cloud = require('./vendor/gcp/gcp');

const allClouds = {
  tencent_cloud,
  tencent_cloud_oversea,
  ali_cloud,
  ali_cloud_oversea,
  huawei_cloud,
  huawei_cloud_oversea,
  aws_cloud,
  azure_cloud,
  gcp_cloud,
};
const allCloudArr = [];
Object.values(allClouds).forEach((cloudVendor) => {
  let info = {};
  info.name = cloudVendor.title;
  info.value = cloudVendor.fileName;

  allCloudArr.push(info);
});

const questions = [
  {
    type: 'checkbox',
    name: 'cloudVendors',
    message: '请选择要爬取的云厂商',
    choices: [
      {
        name: 'ALL - 爬取以下列表中所有云厂商产品',
        value: Object.keys(allClouds),
      },
      new inquirer.Separator(
        '==================================================='
      ),
      ...allCloudArr,
    ],
  },
];

inquirer.prompt(questions).then((answers) => {
  for (let cloudConfigKey of answers.cloudVendors) {
    if (typeof cloudConfigKey === 'string') {
      crawProductListPage(allClouds[cloudConfigKey]);
    } else {
      allClouds.values.forEach((cloudConfig) =>
        crawProductListPage(cloudConfig)
      );
      break;
    }
  }
});
