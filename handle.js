/**
 * 具体的信息处理
 * @param {*} $ 
 * @returns score曲谱对象
 */
exports.jitabaHandle = function($) {
  return new Promise((resolve, reject) => {
    let score = {
      title: '',
      name: '',
      keys: '',
      singer: '',
      poster: '',
      tags: '',
      rating: '',
      views: '',
      spectrum: '',
      description: ''
    }

    let header = $('body > div.main.newslist > div.listl > div > div.listlcon > div.listltitle > h1').text()
      // 转换下分隔符 有的是 ',' 有的是 '_'
    header = header.replace(/\,/g, '_')

    //【标题 title】
    score.title = header

    // 【歌曲名称】 + 【演唱歌手】
    // '周华健《其实不想走》吉他谱_C调指法_弹唱六线谱' '爱就一个字吉他谱_张信哲_C调_弹唱六线谱'
    // '是云白吉他谱_秦霄贤_G调弹唱谱_电影《白蛇情劫》主题曲' '形容吉他谱_沈以诚《形容》六线谱_G调弹唱谱'
    // '我们的纪念吉他谱_李雅微_《放羊的星星》_C调简单版' '萱草花吉他谱_张小斐《你好李焕英》插曲_弹唱演示视频'
    let headerArr = header.split('_')
    if (headerArr[0].includes('《')) {
      let tempArr = headerArr[0].split(/\《|\》/g)
      score.singer = tempArr[0]
      score.name = tempArr[1]
    } else {
      score.name = headerArr[0].split('吉他谱')[0]
      if (!headerArr[1].includes('调')) {
        if (headerArr[1].includes('《')) {
          score.singer = headerArr[1].split(/\《|\》/g)[0]
        } else {
          score.singer = headerArr[1]
        }
      }
    }
    // 若标题没有歌手，则演唱歌手为群星（根据观察得到的规律）
    score.singer = (score.singer === '') ? '群星' : score.singer

    // 【调号】
    let indexOfKeys = header.indexOf('调') - 1
    if (indexOfKeys !== -1 && header.charCodeAt(indexOfKeys) >= 65 && header.charCodeAt(indexOfKeys) <= 90) {
      score.keys = header.charAt(indexOfKeys)
    }
    // 若标题无调号，则默认为C调。（比较基础的简易指法）
    score.keys = (score.keys === '') ? 'C' : score.keys


    // TODO:  以下内容在详情页可能没有，有两种不同结构的详情页
    try {
      // 【海报】
      score.poster = $('#tabzone > p:nth-child(1) > img').attr('src')

      // 【曲谱简介】
      score.description = $('#tabzone > p:nth-child(1)').text().concat($('#tabzone > p:nth-child(2)').text()).replace(/\t|\n/g, '')

      // 根据曲谱简介 也可得到歌曲名称 
      score.name = (score.name === '') ? score.description.split('吉他谱')[0] : score.name



      resolve(score)

    } catch (error) {

      reject(error, score)

    } finally {

      // 【曲谱图片地址】  多个图片地址 将地址拼接
      // 1 '#tabzone > p:nth-child(2) > img:nth-child(2)'
      // 2 '#tabzone > img:nth-child(5)' 第一个img元素 是 海报
      // 3 '#tabzone > img:nth-child(1)' 没有海报，没有简介
      //结构一
      let spectrumImgs = $('#tabzone > p:nth-child(2) > img')
      spectrumImgs.each((index, item) => {
        if (index === 0) {
          score.spectrum = $(item).attr('src') + '; '
        } else if (index === spectrumImgs.length - 1) {
          score.spectrum = score.spectrum + $(item).attr('src')
        } else {
          score.spectrum = score.spectrum + $(item).attr('src') + '; '
        }
      })

    }


  })
}