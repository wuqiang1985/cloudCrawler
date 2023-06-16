const fs = require("fs-extra");
const prettyMdPdf = require("pretty-markdown-pdf");

function generateProductJson(productList, config) {
  fs.outputJsonSync(
    `output/${config.fileName.split("_")[0]}/${config.fileName}_original.json`,
    productList
  );
  generateHandledProductJson(productList, config);
}

function generateHandledProductJson(productList, config) {
  for (let product of productList) {
    product.firstCategory = trim(product.firstCategory);
    product.secondCategory = trim(product.secondCategory);
    product.name = trim(product.name);
    product.desc = trim(product.desc);
    product.enName = trim(product.enName);
    product.enShortName = trim(product.enShortName);
  }

  const categories = productList.filter((product) => product.needFirstCategory);
  const categoryCount = categories.length;
  const categoryList = categories.map(
    (category) => `${category.firstCategory}(${category.firstCategoryCount})`
  );
  const productCount = productList.length;

  const products = {
    name: config.title,
    productList,
    productCount,
    categoryList,
    categoryCount,
  };

  fs.outputJsonSync(
    `output/${config.fileName.split("_")[0]}/${config.fileName}.json`,
    products
  );
}

function generateProductMd(productList, config) {
  const { fileName, title, isThridCategory } = config;

  const stream = fs.createWriteStream(
    `output/${fileName.split("_")[0]}/${fileName}.md`,
    {
      flags: "w",
      autoClose: true,
    }
  );
  const writeLine = (content) => {
    stream.write(`\n${content}`);
  };

  writeLine(`# ${title}产品列表`);
  writeLine("");
  writeLine(`\`本文档生成于：${new Date().toLocaleDateString()} @qiangwu\``);
  writeLine("");
  writeLine(
    `\`${title}一共包含${
      productList.filter((product) => product.needFirstCategory).length
    }个大类，${productList.length}款产品，详情如下\``
  );

  for (let index = 0; index < productList.length; index++) {
    let product = productList[index];
    if (product.needFirstCategory) {
      writeLine("");
      writeLine(
        `## ${trim(product.firstCategory)}(${product.firstCategoryCount})`
      );

      if (!isThridCategory || !product.secondCategory) {
        setTableHeader(writeLine);
      }
    }

    if (isThridCategory) {
      if (product.needSecondCategory) {
        if (product.secondCategory) {
          writeLine(
            `### ${trim(product.secondCategory)}(${
              product.secondCategoryCount
            })`
          );
        }
        setTableHeader(writeLine);
      }
    }

    writeLine(
      `|  [${trim(product.name)}](${product.link})  | ${trim(
        product.enName
      )}  | ${trim(product.enShortName)} | ${trim(product.desc)}   | ${trim(
        product.desc_info
      )}  |`
    );
  }

  console.log("【3】markdown已完成");
}

async function generateProductPdf(config) {
  await prettyMdPdf.convertMd({ markdownFilePath: `${config.fileName}.md` });
  console.log("PDF已完成");
}

function trim(str) {
  return str?.replace(/^\s+|\s+$|[\n]/g, "");
}

function setTableHeader(writeLine) {
  writeLine("|  产品   |  英文名  | 英文简称 | 概述  | 详情 |");
  writeLine("|  ----  | ----  | ----  | ----  |  ----  |");
}

function generatesummaryMd(fileName, cloundInfo) {
  const stream = fs.createWriteStream(`${fileName}`, {
    flags: "w",
    autoClose: true,
  });
  const writeLine = (content) => {
    stream.write(`\n${content}`);
  };

  writeLine(`# 云厂商产品 Overview`);
  writeLine("");
  writeLine(`\`本文档生成于：${new Date().toLocaleDateString()} @qiangwu\``);
  writeLine("");
  writeLine("|  云厂商   |  产品分类（个）  | 产品（个） | 分类详情  |");
  writeLine("|  ----  | ----  | ----  | ----  |");

  for (let info of Object.values(cloundInfo)) {
    writeLine(
      `| ${info.name} | ${info.categoryCount} | ${
        info.productCount
      } | ${info.categoryList.join("<br>")} |`
    );
  }
}

module.exports = {
  generateProductJson,
  generateProductMd,
  generateProductPdf,
  generatesummaryMd,
  trim,
};
