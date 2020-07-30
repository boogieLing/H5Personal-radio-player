var lrc="" ;
var oLRC ;
var lrcProcess={
    nextTime:0.00 ,
    curIndex:0 ,
    nextIndex:0 ,
    offset: -45     //滚动距离（应等于行高）
} ;
var oComments ;
$(document).ready(function() {

    var getAudioSucc=false ;
    var getNormalAudioSucc=false ;
    var randomFlag=false ;
    var firPlay=true ;
    var picStatus=false ;
    var picHidden=false ;
    var myAudio ;
    var djList ;
    var type="song"
    var randomNum=1 ;
    var listLenth=0 ;
    var songUrl ;
    var picUrl ;
    var picBlurUrl ;
    var targetNum=794975380 ;
    var targetNormalNum=2894610642 ;

    $("#Audio_1").on("loadedmetadata",function () {
        if (!djList || listLenth==0 ) {
            console.log("Audio does not ready") ;
            return  ;
        } else {}
        $(".myPlay span").text("-"+transTime(this.duration)) ;
        myAudio.addEventListener("timeupdate" , updateProgress , false ) ;
        myAudio.addEventListener("timeupdate" , updateLrc , false ) ;
        myAudio.addEventListener("ended" , audioEnded , false ) ;
    }) ;
    $("#Audio_1").on("error",function () {
        alert("抱歉，该资源暂时无法获取（可能是付费资源）。") ;
        var prevIndex=randomNum ;
        randomNum=(randomNum+1+listLenth)%listLenth ;
        if (randomFlag) {
            randomNum=Math.floor((Math.random()*(djList.length+1))%djList.length ) ;
        } else {
            randomNum=randomNum ;
        }
        startAudio(randomNum) ;
        updateSongList(prevIndex,randomNum) ;
    }) ;
    $(".lightnessSet").lzhDrag({
        startDown: function () {}, 
        startMove: function () {}, 
        overMove: function () {} 
    }).html("");
    $('.lightnessSet').mousemove(function(e) {
        e = e || window.event;
        let parent_left=$(this).offsetParent().offset().left ,
            parent_top = $(this).offsetParent().offset().top ;
        let fix_x=$(this).offset().left ,
            fix_y = $(this).offset().top ;
        let run_x=fix_x-parent_left ,
            run_y=fix_y-parent_top ;
        let min_x=70 , max_x=370 ,
            min_y=0 , max_y=300 ;
        run_x = run_x<min_x ? min_x : run_x ;
        run_x = run_x>max_x ? max_x : run_x ;
        run_y = run_y<min_y ? min_y : run_y ;
        run_y = run_y>max_y ? max_y : run_y ;
        var target_x=220 , target_y=150 ;
        var curDis= (run_x-target_x)*(run_x-target_x) + (run_y-target_y)*(run_y-target_y) ;
        var rate=1-curDis/45000 ;
        rate*=0.9 ;
        //console.log(rate) ;
        //console.log(run_x+":"+run_y) ;
        var curLightness="5000px solid rgba(0, 0, 0,"+rate+")" ;
        $(".lightCover").css("outline",curLightness) ;
        //console.log(run_x+":"+run_y) ;
    });
    $(".songRate").click(function (event) {
        if (!djList || listLenth==0 ) {
            console.log("Audio does not ready") ;
            return  ;
        } else {}
        var psgWidth=$(".songRate").width() ;
        //console.log(psgWidth) ;
        var rate = (event.offsetX - ($(this).width()-psgWidth)/2)/psgWidth;
        //console.log(rate) ;
        myAudio.currentTime = myAudio.duration * rate; 
        updateProgress() ;
    }) ; 
    $(".songRateBack").click(function (event) {
        if (!djList || listLenth==0 ) {
            console.log("Audio does not ready") ;
            return  ;
        } else {}
        var psgWidth=$(".songRate").width() ;
        var rate = (event.offsetX - ($(this).width()-psgWidth)/2)/psgWidth;
        //console.log(rate) ;
        myAudio.currentTime = myAudio.duration * rate+myAudio.currentTime ;
        updateProgress() ;
    }) ; 

    $(".myPlay").click(function () {
        initAll(type) ;
    }) ;  
    $(".songPic + div").click(function () {
        //console.log(1) ;
        //$(".picMenu").toggleClass("picMenuScale") ;
        //$(".showInfo").addClass("show2hidden") ;
        var animateTime=600 ;
        if (picStatus==false) {
            myAnimation(".curPic","moveForPic1",animateTime,"translateX(-250px)") ;
            $(".picMenu").addClass("picMenuScale") ;
            picStatus=true ;
        } else {
            myAnimation(".curPic","moveForPic2",animateTime,"translateX(0px)") ;
            $(".picMenu").removeClass("picMenuScale") ;
            picStatus=false ;
        }
    }) ;
    $(".myType").click(function () {
        if ("dj"==type) {
            getAudioSucc=false ;
            firPlay=true ;
            type="song" ;
            initAll(type) ;
        } else if ("song"==type){
            getAudioSucc=false ;
            firPlay=true ;
            type="dj" ;
            initAll(type) ;
        } else {}
        setTypeShow(type) ;
    }) ;
    $(".myInfo").click(function () {
        $(".showInfo").toggleClass("show2hidden") ;
        $(".info").toggleClass("typeMachine") ;
        //$(".setOptions").toggleClass("hidden2show") ;
    })
    $(".myHidden").click(function () {
       var animateTime=600 ;
       if (getAudioSucc&&picHidden==false) {
            $(".curPic").addClass("newPicHidden") ;
            //myAnimation(".curPic","picHidden",animateTime,"scale(0),translateX(-250px)") ;
            picHidden=true ;
            //$(".picMenu").removeClass("picMenuScale") ;
            //$(".bodyBackgroud").addClass("picDisplay") ;
            $(".bodyBackgroud2").addClass("hidden2show") ;
            $(".myLrcCont").addClass("hidden2show") ;
            $(".songList li").css("color","rgb(223, 230, 233)") ;
        } else {} 
    }) ;
    $(".myRandom").click(function () {
        if (!randomFlag) {
            $(".myRandom .iconfont").removeClass("icon-order-play-fill") ;
            $(".myRandom .iconfont").addClass("icon-arrow-random") ;
            randomFlag=true ;
        } else {
            $(".myRandom .iconfont").removeClass("icon-arrow-random") ;
            $(".myRandom .iconfont").addClass("icon-order-play-fill") ;
            randomFlag=false ;
        }
    }) ;
    $(".myPause").click(function () {
        randomNum=randomNum ;
        pauseAudio() ;
    }) ;
    $(".myPrevious").click(function () {
        if (djList && listLenth!=0) {
            var prevIndex=randomNum ;
            randomNum=(randomNum-1+listLenth)%listLenth ;
            if (randomFlag) {
                randomNum=Math.floor((Math.random()*(djList.length+1))%djList.length ) ;
            } else {
                randomNum=randomNum ;
            }
            startAudio(randomNum) ;
            updateSongList(prevIndex,randomNum) ;
        } else { 
            console.log("djList does not ready") ;
        }
    }) ;
    $(".myNext").click(function () {
        if (djList && listLenth!=0) {
            var prevIndex=randomNum ;
            randomNum=(randomNum+1+listLenth)%listLenth ;
            if (randomFlag) {
                randomNum=Math.floor((Math.random()*(djList.length+1))%djList.length ) ;
            } else {
                randomNum=randomNum ;
            }
            startAudio(randomNum) ;
            updateSongList(prevIndex,randomNum) ;
        } else { 
            console.log("djList does not ready") ;
        } 
    }) ;
    $(".myComment").click(function () {
        $("#comments").toggleClass("picMenuScale") ;
    }) ;
    $(".myBack").click(function () {
        var animateTime=600 ;
        if (picHidden==true) {
            picHidden=false ;
            //picStatus=false ;
            $(".curPic").removeClass("newPicHidden") ;
            //myAnimation(".curPic","moveForPic2",animateTime,"translateX(0px)") ;
            $(".songList li").css("color","rgb(45, 52, 54)") ;
            //$(".bodyBackgroud").removeClass("picDisplay") ;
            $(".bodyBackgroud2").removeClass("hidden2show") ;
            $(".myLrcCont").removeClass("hidden2show") ;
        } else {}
    }) ;
    $(".lrcLoad").click(function () {
        //getLrc() ;
        showLRC() ;
        showComment() ;
    }) ;
    $(".header .catEars1").click(function () {
        $(".songRate").toggleClass("bg10S") ;
    }) ;
    $(".header .catEars2").click(function () {
        startSakura() ;
    }) ;
    $(".listName").click(function () {
        $(".songList").toggleClass("listMove") ;
    }) ;

    $(".songList").on("click","li",function () {
        var prevIndex=randomNum ;
        randomNum=$(this).index() ;
        startAudio(randomNum)  ;
        updateSongList(prevIndex, randomNum ) ;
    }) ;

    function setDjInformation( randomNum ) {
        //$(".myPlay span").text("-"+"PLAY") ;
        var songName=djList.list[randomNum].song ;
        //songName="泡沫、哀のまほろば(with senya) <幻想万華鏡 永夜異変の章 OP主題歌>" ;
        if (songName.length>12) {
            songName=songName.substring(0,12) ;
            songName=songName+"..." ;
        } else {}
        var autorName=djList.list[randomNum].nickname ;
        var creatorName=djList.list[randomNum].creator ;
        var listName=djList.list[randomNum].brand ;
        $(".songTitle").text(songName) ;
        var newAutor="<div class=\"songAutor\">Autor:"+autorName+"</div>" ;
        var newGroup="<div class=\"songGroup\">"+creatorName+"\'s list</div>" ;
        $(".songTitle").append(newAutor) ;
        $(".songTitle").append(newGroup) ;
        $(".listName").text(listName) ;
    }
    function startAudio(randomNum) {
        //console.log(randomNum) ;
        if("song"==type){
            endUpateLrc() ;
            getLrc(djList,randomNum) ;
            getSongComment(djList,randomNum) ;
        }
        if (!djList || listLenth==0 ) {
            console.log("djList does not ready") ;
            return  ;
        } else {}
        songUrl=getMp3(djList,randomNum,type) ;
        //console.log(djList.list[randomNum].song+myAudio.error) ;
        $("#Audio_1").attr("src",songUrl) ;
        if("song"==type){
            setTimeout(showLRC,1500) ;  
            setTimeout(function () {
            showComment() ;
                //console.log(oComments.hotComments[0].wordTime) ;
            },2000) ; 
        }

        if (myAudio && myAudio.paused) {
            myAudio.play() ;
            setDjInformation(randomNum) ;
            $("main .catBody .songPic").removeClass("scale1S") ;
            $("main .catBody .songPic").addClass("rote10S") ;
             //console.log(newColor) ;
        } else { 
            console.log("Audio does not ready") ; 
        }
        picUrl=getPic(djList,randomNum) ;
        picBlurUrl=getPicBlur(djList,randomNum) ;
        $("main .catBody .songPic").attr("src",picUrl) ;
        var cssNew="url("+picUrl+")" ;
        $(".bodyBackgroud").css("background" , cssNew) ;
        $(".bodyBackgroud").css("background-size","cover") ;
        $(".bodyBackgroud").css("background-position","center") ;  
        $(".bodyBackgroud2").css("background" , cssNew) ;
        $(".bodyBackgroud2").css("background-size","cover") ;
        $(".bodyBackgroud2").css("background-position","center") ; 
    }
    function startAudioCon() {
        if (!djList || listLenth==0 ) {
            console.log("djList does not ready") ;
            return  ;
        } else {}
        if (myAudio && myAudio.paused) {
            myAudio.play() ;
            setDjInformation(randomNum) ;
            $("main .catBody .songPic").removeClass("scale1S") ;
            $("main .catBody .songPic").addClass("rote10S") ;
             //console.log(newColor) ;
        } else { 
            console.log("Audio does not ready") ; 
        }
    }
    function pauseAudio() {
        if (myAudio && myAudio.play) {
            myAudio.pause() ;
            /*$(".end").addClass("fromRight1S") ;*/
            $("main .catBody .songPic").addClass("scale1S") ;
            $("main .catBody .songPic").removeClass("rote10S") ;
            // body...
        } else {
            console.log("Audio does not ready") ;
        }
    }
    function audioEnded() {
        if (djList && listLenth!=0) {
            endUpateLrc() ;
            var prevIndex=randomNum ;
            randomNum=(randomNum+1+listLenth)%listLenth ;
            startAudio(randomNum) ;
            updateSongList(prevIndex ,randomNum) ;
        } else { 
            console.log("djList does not ready") ;
        } 
    }
    function updateLrc() {
        var curHeight=$("#lyric").height() ;
        if ($.isEmptyObject(oLRC)||oLRC.ms.length<=1||lrcProcess.curIndex>=oLRC.ms.length) {
            return ;
        } else { 
            //console.log(oLRC) ;
        }
        if (lrcProcess.curIndex>=5) {
            var pos=lrcProcess.offset*(lrcProcess.curIndex-5) ;
            /*var pos=-((myAudio.currentTime/myAudio.duration)*curHeight-270) ;*/
            $("#lyric").css("transform", "translateY("+pos.toString()+"px)" ) ;
        } else {}
        if (myAudio.currentTime>=oLRC.ms[lrcProcess.curIndex].t) {
            var curLi="#lyric li:nth-child("+(lrcProcess.curIndex).toString()+")" ;
            var nextLi="#lyric li:nth-child("+(lrcProcess.nextIndex).toString()+")" ;
            $(curLi).removeClass("lrcBg") ;
            $(nextLi).addClass("lrcBg") ;
            lrcProcess.curIndex=lrcProcess.nextIndex ;
            lrcProcess.nextIndex++ ;
        } else if (lrcProcess.curIndex-1>=1 && myAudio.currentTime<=oLRC.ms[lrcProcess.curIndex-1].t) {  
            var curLi="#lyric li:nth-child("+(lrcProcess.curIndex).toString()+")" ;
            var nextLi="#lyric li:nth-child("+(lrcProcess.curIndex-1).toString()+")" ;
            $(curLi).removeClass("lrcBg") ;
            $(nextLi).addClass("lrcBg") ;
            lrcProcess.nextIndex=lrcProcess.curIndex ;
            lrcProcess.curIndex-- ;
        }
    }
    function endUpateLrc() {
        lrcProcess.curIndex=0 ;
        lrcProcess.nextIndex=0 ;
        $("#lyric").css("transform", "translateY(0px)" ) ;
        var curLi="#lyric li:nth-child("+(lrcProcess.curIndex).toString()+")" ;
        $(curLi).removeClass("lrcBg") ;
    }
    function initAll(type) {
        if (type=="dj") {
            if (getAudioSucc) {
                //console.log("Already played.") ;
                //notthing to do ;
            } else {
                getAudioSucc=true ;
                var ans=getDjradioPlay(targetNum) ; 
                djList=getDjIdList(ans) ;
                listLenth=djList.length ;
                myAudio = $("#Audio_1")[0] ; 
            }
        } else {
            if (getAudioSucc) {
                //console.log("Already played.") ;
            } else {
                getAudioSucc=true ;
                var ans=getNormalPlay(targetNormalNum) ;
                var extraAns=getExtraPlay(targetNormalNum) ; 
                djList=getNormalIdList(ans,extraAns) ;
                listLenth=djList.length ;
                myAudio = $("#Audio_1")[0] ; 
            }
        }
        if (randomNum>=listLenth) {
            randomNum=0 ;
        } else {}
        if (firPlay) {
            if (randomFlag) {
                randomNum=Math.floor((Math.random()*(djList.length+1))%djList.length ) ;
            } else {
                randomNum=randomNum ;
            }
            startAudio(randomNum) ;
             setSongList( djList ) ; 
             firPlay=false ;
             updateSongList(randomNum,randomNum) ;
             setTypeShow(type) ;

        } else {
             startAudioCon() ;  
        }
    }

}) ;

function myAnimation(className,animateName,animateTime,endStatus) {
    $(className).css("animation-name", animateName ) ;
    $(className).css("animation-play-state", "running") ;
    setTimeout(function () {
        $(className).css("animation-play-state", "paused") ;
    },animateTime) ;
    setTimeout(function () {
        $(className).css("transform", endStatus ) ;
    },animateTime) ;
    // body...
}
function setTypeShow(type) {
    if ("dj"==type)
        $(".myType span").text("-DJAUDIO-") ;
    else if ("song"==type)
        $(".myType span").text("-SONG-") ;
    else {}
}
function setSongList( songList ) {
    $(".songList").text("") ;
    var i ;
    listLenth=songList.length ;
    //console.log(listLenth) ;
    for( i=0 ; i<listLenth ; ++i ) {
        /*var newInfor=songList.list[i].song+"-"+songList.list[i].nickname ;*/
        var newInfor=songList.list[i].song ;
        if (newInfor.length>16) {
            newInfor=newInfor.substring(0,16) ;
            newInfor=newInfor+"..." ;
        } else {}
        var newInfor="<li>"+newInfor+"</li>" ;
        $(".songList").append(newInfor) ;
    }
}

function updateSongList(prev,next) {
    prev+=1 ;
    next+=1 ;
    var prevPos=".songList li:nth-of-type("+prev.toString()+")" ;
    $(prevPos).removeClass("listLight") ;
    //console.log(prevPos) ;
    var nextPos=".songList li:nth-of-type("+next.toString()+")" ;
    //console.log(nextPos) ;
    $(nextPos).addClass("listLight") ;
}
//转换音频时长显示
function transTime(time) {
    var duration = parseInt(time);
    var minute = parseInt(duration/60);
    var sec = duration%60+'';
    var isM0 = ':';
    if(minute == 0){
        minute = '00';
    }else if(minute < 10 ){
        minute = '0'+minute;
    }
    if(sec.length == 1){
        sec = '0'+sec;
    }
    return minute+isM0+sec
}
//更新进度条
function updateProgress() {
    var audio=document.getElementById("Audio_1"); //js获取的方式
    var psgWidth=$(".songRate").width() ;
    var value = (audio.currentTime / audio.duration) * psgWidth  ;
    //value/=100000000 ;
    //console.log(value) ;
    var newVal=(value).toString() ;
    newVal_1="translateX("+newVal+"px)" ;
    newVal_2=newVal+"px" ;
    $(".songRateBack").css("transform",newVal_1) ;
    $(".songRateShow").css("left",newVal_2) ;
}
var getCnt=1 ;
function getLrc(djList,index) {
    var ajax=new XMLHttpRequest() ;
    ajax.open("GET", djList.list[index].lrc) ;
    ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                lrc = ajax.responseText;  
                oLRC=createLrcObj(lrc) ;
                console.log(oLRC.ti+"lrc solve done.") ; 
            } else {}
    };
    ajax.send(null) ;
}
//把LRC歌词解析为JS对象
function createLrcObj(lrc) {
    var oLRC = {
        ti: "", //歌曲名
        ar: "", //演唱者
        al: "", //专辑名
        by: "", //歌词制作人
        offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
        ms: [] //歌词数组{t:时间,c:歌词}
    };
    if(lrc.length==0) return oLRC ;
    var lrcs = lrc.split('\n');//用回车拆分成数组
    for(var i in lrcs) {//遍历歌词数组
        lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
        var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
        var s = t.split(":");//分离:前后文字
        if(isNaN(parseInt(s[0]))) { //不是数值
            for (var i in oLRC) {
                if (i != "ms" && i == s[0].toLowerCase()) {
                    oLRC[i] = s[1];
                }
            }
        }else { //是数值
            var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
            var start = 0;
            for(var k in arr){
                start += arr[k].length; //计算歌词位置
            }
            var content = lrcs[i].substring(start);//获取歌词内容
            for (var k in arr){
                var t = arr[k].substring(1, arr[k].length-1);//取[]间的内容
                var s = t.split(":");//分离:前后文字
                oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                    t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
                    c: content
                });
            }
        }
    }
    oLRC.ms.sort(function (a, b) {//按时间顺序排序
        return a.t-b.t;
    });
    /*
    for(var i in oLRC){ //查看解析结果
        console.log(i,":",oLRC[i]);
    }*/
    return oLRC ;
}
function showLRC() {
    var s="";
    document.getElementById("lyric").innerHTML = s;
    for(var i in oLRC.ms){//遍历ms数组，把歌词加入列表
        s+='<li>'+oLRC.ms[i].c+'</li>';
    }
    document.getElementById("lyric").innerHTML = s;
}

function getSongComment(djList,index) {
    var ajax=new XMLHttpRequest() ;
    var idUrl="https://api.imjad.cn/cloudmusic/?type=comments&id="+djList.list[index].songid.toString() ;
    ajax.open("GET", idUrl) ;
    //console.log(idUrl) ;
    ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var curComments = JSON.parse(ajax.responseText);  
                oComments=createCommentsObj(curComments) ;
                console.log("comments solve done.") ; 
            } else {}
    };
    ajax.send(null) ;
}

function createCommentsObj(curComments) {
    var oComments={
        hotLength:0 ,
        norLength:0 ,
        hotComments:[] ,
        comments:[]
    } ;
    if (curComments["hotComments"].length==0 && curComments["comments"].length==0) {
        console.log("empty json") ;
        return oComments ;
    } else {}
    var hotLen=curComments["hotComments"].length ;
    for( var i=0 ; i<hotLen ; ++i )
    {
        var temp=new Object() ;
        temp.userName=curComments["hotComments"][i]["user"]["nickname"] ;
        temp.userPic=curComments["hotComments"][i]["user"]["avatarUrl"] ;
        temp.word=curComments["hotComments"][i]["content"] ;
        temp.wordTime=getDate(curComments["hotComments"][i]["time"]) ;
        oComments.hotComments.push(temp) ;
    }
    var norLen=curComments["comments"].length ;
    for( var i=0 ; i<norLen ; ++i )
    {
        var temp=new Object() ;
        temp.userName=curComments["comments"][i]["user"]["nickname"] ;
        temp.userPic=curComments["comments"][i]["user"]["avatarUrl"] ;
        temp.word=curComments["comments"][i]["content"] ;
        temp.wordTime=getDate(curComments["comments"][i]["time"]) ;
        //避免使用conten或者text
        oComments.comments.push(temp) ;
    }
    oComments.hotLength=hotLen ;
    oComments.norLength=norLen ;
    return oComments ;
}

function showComment() {
    var hotLen=oComments.hotLength ;
    var norLen=oComments.norLength ;
    document.getElementById("comments").innerHTML = "<div><i class=\"iconfont icon-Comment4\"></i> -COMMENTS-</div>";
    for(var i=0 ; i<hotLen ; ++i )
    {
        var ans="<li>" ;
        var picText="<img class=\"userPic\" src=\""+oComments.hotComments[i].userPic+"\">" ;
        var nameText="<div class=\"userName\">"+oComments.hotComments[i].userName+"</div>" ;
        var wordText="<p class=\"userWord\">"+oComments.hotComments[i].word+"</p>" ;
        var timeText="<div class=\"userWordTime\">"+oComments.hotComments[i].wordTime+"</div>" ;
        ans=ans+picText+nameText+wordText+timeText+"</li>" ;
        $("#comments").append(ans); 
    }
    for(var i=0 ; i<norLen ; ++i )
    {
        var ans="<li>" ;
        var picText="<img class=\"userPic\" src=\""+oComments.comments[i].userPic+"\">" ;
        var nameText="<div class=\"userName\">"+oComments.comments[i].userName+"</div>" ;
        var wordText="<p class=\"userWord\">"+oComments.comments[i].word+"</p>" ;
        var timeText="<div class=\"userWordTime\">"+oComments.comments[i].wordTime+"</div>" ;
        ans=ans+picText+nameText+wordText+timeText+"</li>" ;
        $("#comments").append(ans); 
    }
}
function getDate(tm){ 
    //var tt=new Date(parseInt(tm)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, "         ") ;
    var tt=new Date(parseInt(tm)).toLocaleString().replace(/上午/g, " am").replace(/下午/g, " pm");
    return tt; 
} 

function typeMachineSet(className,step)
{
    var temp_1="typeGrow "+"4s "+"steps("+step+") "+"1s "+"normal both " ;
    var temp_2="typeBlink "+"500ms "+"steps("+step+") "+"infinite normal " ;
    $(className).css("animation",temp_1+","+temp_2) ;
}