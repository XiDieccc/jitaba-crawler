***吉他谱网站逻辑***



```javascript
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
```



- 首先爬取列表页的url 
- 进入详情页，爬取 **title** 根据标题得到 **name singer keys**
- 根据 `$('#tabzone') ` 里面有无文字来判断是否用简介得到 **description** , 若没有则爬取豆瓣的简介
- 将所有`$('#tabzone')`里面的所有 img 元素 作为 **spectrum**曲谱，把第一张作为 **poster ** 海报地址，再爬取豆瓣页的海报，若有则替换
- 豆瓣页稳定爬取 **rating views tags**

