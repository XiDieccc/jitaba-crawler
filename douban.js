const puppeteer = require('puppeteer');
const simplify = require("hanzi-tools").simplify;
/**
 * 通过 puppeteer 动态爬取曲谱剩余的信息
 * @param {*} score 传入的曲谱对象
 */
exports.doubanDetail = (score) => {
  return new Promise(async(resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const doubanHost = 'https://www.douban.com/'
    try {
      await page.goto(doubanHost);
      // 搜索框输入 歌曲名
      // await page.type('#anony-nav > div.anony-srh > form > span.inp > input[type=text]', '当年情')
      await page.type('#anony-nav > div.anony-srh > form > span.inp > input[type=text]', score.name)
      await page.keyboard.press('Enter');
      await page.waitForSelector('#content > div > div.article > div.search-cate > ul > li:nth-child(4) > a')

      // BUG li.on BUG
      // await page.click('#content > div > div.article > div.search-cate > ul > li.on > a')
      await page.click('#content > div > div.article > div.search-cate > ul > li:nth-child(4) > a')
      await page.waitForSelector('#content > div > div.article > div.search-result > div.result-list')

      // 繁体字转化为简体
      const scoreName = simplify(await page.$eval('#content > div > div.article > div.search-result > div.result-list > div:nth-child(1) > div.content > div > h3 > a', a => a.innerText)).trim()
      if (score.name === scoreName) {
        const doubanDetailUrl = await page.$eval('#content > div > div.article > div.search-result > div.result-list > div:nth-child(1) > div.content > div > h3 > a', a => a.href)
        console.log(scoreName + doubanDetailUrl)

        //此处 click貌似不起作用了，直接使用 goto 跳转
        // await page.click('#content > div > div.article > div.search-result > div.result-list > div:nth-child(1) > div.content > div > h3 > a')
        await page.goto(doubanDetailUrl)

        await page.waitForSelector('#interest_sectl > div > div.rating_self.clearfix > strong')
        score.rating = await page.$eval('#interest_sectl > div > div.rating_self.clearfix > strong', strong => strong.innerText)
        score.views = await page.$eval('#interest_sectl > div > div.rating_self.clearfix > div > div.rating_sum > a > span', span => span.innerText)
        const tagsArr = await page.evaluate(() => {
          const tags = document.querySelectorAll('#db-tags-section > div > a.music-tags')
          return Array.prototype.map.call(tags, a => a.innerText)
        })
        tagsArr.forEach((tag, index) => {
          // BUG
          // score.tags = score.tags + tag + (index === tagsArr.length - 1) ? '' : '; '
          if (index === 0) {
            score.tags = tag + '; '
          } else if (index === tagsArr.length - 1) {
            score.tags = score.tags + tag
          } else {
            score.tags = score.tags + tag + '; '
          }
        })
      }
      // console.log(score)
      resolve(score)
    } catch (error) {
      // 这里有可能没有搜索结果
      console.log('没有找到对应歌曲')
      reject(error)
    } finally {
      await browser.close();
    }
  })
}
exports.doubanDetail({ name: '当年情' })