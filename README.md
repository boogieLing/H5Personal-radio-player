# H5个人电台主页
![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/all.png)


## Whisper

制作原因是因为 网易云 的电台不能放歌词，于是利用现有的网易云api制作了一个替代品。也用于练习css。目前的歌单与电台都是本人的歌单与电台 。

有模仿 Osu! 的布局 （经典粉饼）

体积较小，总体采用函数式编程 ， 没有后端 。有些地方写得比较丑陋，后期有 重构 与使用Electron 开发为客户端 的计划 。

没什么亮点，可能亮点是有 某些动画实现方式较为有趣 。

弃用 request，请求改成 AJAX 。

### 开发环境

1. Windows 10
2. jQuery JavaScript Library v3.5.1
3. Vanilla JS
4. Plain CSS

### 接口

功能不多，不打算给出登录入口，使用 [Meting](https://github.com/metowolf/Meting) 的api。



## 页面

**层级**

![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/main.png)

![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/main_2.png)
![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/search_1.png)

<video src="pic\search2.mp4"></video>





**主页**

![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/page_1.png)



**歌词页**

![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/picpage_2.png)

**评论页**

![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/page_3.png)

**信息页**

![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/page_4.png)

**搜索页**

![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/page_5.png)



## 已实现功能

1. 切换个人歌单/个人电台
    ![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/use_1.png)

2. INFO：个人详情页

3. HIDDEN：收起图片并查看歌词

4. 评论：查看对应评论
    ![](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/use_2.png)

5. 返回：收起歌词

6. reload：重新加载歌词与评论

7. 信息栏：作者、歌曲名、专辑名/歌单创建者/电台创建者，目前歌单/电台详情，目前歌单/电台名称。

    ![image-20200801210842621](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/use_3.png)

8. 调节亮度：在个人详情页，将”暗月球“覆盖”发光月球“，可以根据覆盖面积调整亮度。
    ![image-20200801211115577](https://github.com/boogieLing/H5Personal-radio-player/blob/master/pic/use_4.png)

9. 调节音量：拖动底部的白色波浪，可以根据波浪的高低调节音量。

10. ”加一点特效“：点击”发光月球“，可以开启樱花飘落 、 音量条动态变化， 背景动态变化。

11. 搜索：可以根据歌曲名称搜索（内部使用的api其实可以根据类型指定其他搜索项目，比如歌手、用户等，有兴趣的同学可以修改）

12. 词曲同步：包括同步前进、后退的动作。



## 其他

1. 歌曲、歌单、电台的加载都是同步的，歌词、评论的加载是异步的。
2. 有一些歌曲存在版权保护，无法播放，后期打算加入破解的功能。



Autho：boogieLing'o

Date:2020/07/31

