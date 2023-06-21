# cloudCrawler - 云产品爬虫

为方便大家学习了解各家云厂商产品，本程序爬取了`腾讯云`，`阿里云`，`华为云`，`AWS`，`Azure`，`GCP`等云厂商产品，并做根据分类做简单聚合


- 腾讯云（纯三级分类）
    - 腾讯云国内站，一共包含16个大类，458款产品
        - 产品列表页：SSR
        - 产品详情页：SSR，并行
    - 腾讯云国际站，一共包含15个大类，149款产品
        - 产品列表页：SSR
        - 产品详情页：SSR，串行 500
  
  国内站和国际站不是同一套代码

- 阿里云（三级分类）
   -  阿里云国内站，一共包含15个大类，273款产品
        - 产品列表页：CSR，产品列表显示出来后，需要再次点击每个导航菜单才会挂载
        - 产品详情页：SSR，并行
   -  阿里云国际站，一共包含15个大类，179款产品
        - 产品列表页：SSR
        - 产品详情页：SSR，串行 800
  
    国内站和国际站不是同一套代码，国际站详情页甚至都不是一个模板


- 华为云（三级分类）
   -  华为云国内站（二三混用，二级多），一共包含21个大类，226款产品
        - 产品列表页：SSR
        - 产品详情页：SSR，并行
   -  华为云国际站（纯二级），一共包含18个大类，121款产品
        - 产品列表页：SSR
        - 产品详情页：SSR，并行
  
  国内站和国际站可能是同一套代码，html结构都一致


- 谷歌云（二级分类）
   -  谷歌云中文，一共包含20个大类，217款产品
        - 产品列表页：SSR
        - 产品详情页：SSR，并行

- 亚马逊云（二级分类）
   -  亚马逊云中文，一共包含25个大类，290款产品
        - 产品列表页：CSR
        - 产品详情页：SSR，并行

- 微软云（二级分类）
   -  微软云中文，一共包含21个大类，307款产品
        - 产品列表页：SSR
        - 产品详情页：SSR，并行
  

```javascript
const config = {
  // 产品列表页URL 
  productListUrl: "https://www.huaweicloud.com/product/",
  // 产品列表页产品选择器  
  productSelector: ".card-title-text",
  // 输出的文件名，约定为下划线连接
  // e.g. fileName为tencent_cloud，生成md文件会在output/tencent/tencent_cloud.md
  fileName: "huawei_cloud",
  // 标题
  title: "华为云国内站",
  // 并发模式，每次20个请求
  // 适用于站点未添加类似 DDos 防护
  maxConnections: 20,
  // 串行模式，每500ms发送一次请求
  // rateLimit 设置后 maxConnections 不再生效
  rateLimit: 500,
  // 排除分类
  excludeCategory: ["精选推荐"],
  // 是否为三级标题模式
  isThirdCategory: true,
  // 产品列表页爬取，有 SSR 和 CSR 两种模式
  // SSR 参数为 function ($, el) $ 类似 jQuery 中的$, el 为 productSelector 遍历的当前产品元素
  // CSR 参数为 function (page) page 是 playwright 中的对象
  getProductListInfo: function ($, el) {
    
  },
  // 产品详情页爬取，SSR 模式
  getProductDetailInfo: function ($, productInfo) {
    
  },
};
```