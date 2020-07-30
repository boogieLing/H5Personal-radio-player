function ajaxGetWay(curUrl,curType,callback) {
    $.ajax({
        url:curUrl,
        type: "GET" ,
        headers:{"X-CSRFToken":$.cookie('csrftoken')},
        dataType: curType ,
        timeout:15000 ,
        async:false ,
        cache:false ,
        success:callback
    }) ;
}

function getDjradioPlay(djId) {
    var curUrl="https://api.imjad.cn/cloudmusic/?type=djradio&id="+djId.toString() ;
    var ans ;
    ajaxGetWay(curUrl,"json",function (data,status,xhr) {
            ans=data ;
    });
    curUrl=curUrl+"&limit="+ans["count"].toString() ;
    ajaxGetWay(curUrl,"json",function (data,status,xhr) {
            ans=data ;
    });
    //alert(Object.getOwnPropertyNames(ans["programs"]).length); 
    //会比节目数多一个，最后一个是undefined
    console.log("dj list search done") ;
    return ans ;
}
function getDjIdList(ans) {
    var djList = new Object() ;
    var listLen=ans["count"] ;
    djList.length=listLen ;
    djList.list=[] ;
    for( var i=0 ; i<listLen ; ++i )
    {
        var temp = new Object() ;
        temp.song=ans["programs"][i]["name"] ;
        /*歌曲名*/
        temp.blurCoverUrl=ans["programs"][i]["blurCoverUrl"] ;
        /*歌曲高斯模糊图片*/
        temp.nickname=ans["programs"][i]["dj"]["nickname"] ;
        /*作者*/
        temp.creator=ans["programs"][i]["dj"]["nickname"] ;
        temp.brand=ans["programs"][i]["dj"]["brand"] ;
        /*所属群组*/
        temp.lrc=ans["programs"][i]["description"] ;
        temp.coverUrl=ans["programs"][i]["coverUrl"] ;
        temp.songid=ans["programs"][i]["id"] ;
        temp.songurl="https://api.imjad.cn/cloudmusic/?type=dj&id="+ans["programs"][i]["id"].toString() ;
        /*歌曲图片*/
        djList.list.push(temp) ;
    }
    return djList ;
}
function getNormalPlay(djId) {
    //使用新api
    var curUrl="https://api.plsseer0qaq.top/?type=playlist&id="+djId.toString() ;
    var ans ;
    //console.log(curUrl) ;
    ajaxGetWay(curUrl,"json",function (data,status,xhr) {
            ans=data ;
    });
    console.log("song list search done") ;
    return ans ;
}
function getExtraPlay(djId) {
    //使用旧api
    var curUrl="https://api.imjad.cn/cloudmusic/?type=playlist&id="+djId.toString() ;
    var ans ;
    //console.log(curUrl) ;
    ajaxGetWay(curUrl,"json",function (data,status,xhr) {
            ans=data ;
    });
    console.log("extra song list search done") ;
    return ans ;
}

function getNormalIdList(ans,extraAns) {
    var djList = new Object() ;
    var listLen=ans.length ;
    djList.length=listLen ;
    //console.log(listLen) ;
    djList.list=[] ;

    for(var i=0 ; i<listLen ; ++i ) 
    {
        var temp = new Object() ;
        temp.song=ans[i]["name"] ;
        temp.blurCoverUrl=ans[i]["cover"] ;
        temp.nickname=ans[i]["artist"] ;
        temp.creator=extraAns["playlist"]["creator"]["nickname"] ;
        temp.brand=extraAns["playlist"]["name"] ;
        temp.lrc=ans[i]["lrc"] ;
        temp.coverUrl=ans[i]["cover"] ;
        temp.songid=extraAns["playlist"]["trackIds"][i]["id"] ;
        temp.songurl=ans[i]["url"] ;
        //console.log(temp.lrc) ;
        djList.list.push(temp) ;
    }
    return djList ;
    
}
//以下操作内存
function getMp3(djList,index,type){
    if (type=="song") {
        return djList.list[index].songurl ;
     } else {}
    var curMp3Url ;
    ajaxGetWay(djList.list[index].songurl,"json",function (data,status,xhr) {
        curMp3Url=data["data"][0]["url"] ;
    });
    return curMp3Url ;
}
function getPic(djList,index)
{
    return djList.list[index].coverUrl ;
}
function getPicBlur(djList,index)
{
    return djList.list[index].blurCoverUrl ;
}

$.fn.extend({
    lzhDrag: function (obj) {
        /*let max_left = $(this).offsetParent().outerWidth() - $(this).outerWidth(),
            max_top = $(this).offsetParent().outerHeight() - $(this).outerHeight();*/
        /*let max_left = $(this).offsetParent().outerWidth() ,
            max_top = $(this).offsetParent().outerHeight() ;*/
        //console.log(parent_left+":"+parent_top) ;
        //console.log(max_left+":"+max_top) ;
        $(this).on('mousedown', event => {
            let ele_x = event.offsetX ,
                ele_y = event.offsetY ;
            let fix_x=$(this).offset().left ,
                fix_y = $(this).offset().top ;
            //console.log("click:"+ele_x+":"+ele_y) ;
            //console.log("position:"+fix_x+":"+fix_y) ;
            obj.startDown && obj.startDown();
            let parent_left=$(this).offsetParent().offset().left  ,
                parent_top = $(this).offsetParent().offset().top ;
            let max_left=$(this).offsetParent().outerWidth() ,
                max_top=$(this).offsetParent().outerHeight()+parent_top- $(this).outerHeight() ;
            $(document).on('mousemove', e => {
                obj.startMove && obj.startMove();
                e.preventDefault();
                //e:获得鼠标指针在页面中的位置：
                //不要执行与事件关联的默认动作
                /*let left = e.clientX - ele_x,
                    top = e.clientY - ele_y ;*/
                let left = e.clientX - ele_x ,
                    top = e.clientY - ele_y ;
                left-=parent_left;
                top-=parent_top ;
                //处理相对定位误差
                //console.log("parent"+parent_left+":"+parent_top ) ;
                //console.log("flex:"+e.clientX+":"+e.clientY) ;
                left = left < 0 ? 0 : left;
                top = top < 0 ? 0 : top;
                left = left > max_left ? max_left : left;
                top = top > max_top ? max_top : top;
                //console.log(left+":"+top) ;
                $(this).css({
                    left, top
                }) ;
            })
        })
        $(document).on('mouseup', () => {
            $(document).off('mousemove');
            obj.overMove && obj.overMove();
        })
        return this;
    }
}) ;