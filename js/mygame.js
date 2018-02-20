//保存游戏进度的变量
var opened = {};
var i = -1;//前一个被翻开的方块序号
var temp = {};//前一个被翻开的方块属性
var content = [];//匹配内容
var blocks;
var clicktimes = 0;
var level1 = 24;
var level2 = 40;
var level3 = 56;
var level4 = 72;
var level5 = 99;
var nIntervId;
var icon = ["glyphicon glyphicon-cd","glyphicon glyphicon-camera","glyphicon glyphicon-home","glyphicon glyphicon-fire",
            "glyphicon glyphicon-star-empty","glyphicon glyphicon-tint","glyphicon glyphicon-music","glyphicon glyphicon-star"];
var list = [0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7];
var anims = {"show":"flipInX","match":"pulse","wrong":"shake","mouseover":"bounce"};

//生成图片块
$(document).ready(function () {
    var colmd3 = $(".col-md-3");
    for (var index = 0; index < colmd3.length; index++){
        colmd3[index].innerHTML = "<div class='block'></div>";
    }

    //初始化评分、计时、步数等组件
    updateRateInfo(clicktimes);
});

//添加点击监听
window.onload = function () {
    var randomlist = shuffle(list);

    blocks = $(".block");
    for (var index = 0; index < blocks.length; index++){
        blocks[index].id = index;
        content[index] = "<span class='"+ icon[randomlist[index]]+"' aria-hidden=\"true\"></span>";
        blocks[index].addEventListener("click",mycheck());
    }
}

//闭包返回函数，避免在添加监听时（触发时）被执行
function mycheck() {
    return function () {
        var index = this.id;

        //更新游戏评分信息
        clicktimes += 1;
        updateRateInfo(clicktimes);

        //禁用不可点击的图片
        if(i !== -1 && i === index){
            return;
        }
        if(index in opened){
            return;
        }

        //展示当前卡片内容
        $(this).removeClass().addClass(anims["show"] + ' animated show').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass().addClass("show");
        });
        $(this).html(content[index]);

        //游戏处理逻辑
        //1.保存当前翻开的卡片
        if (i === -1) {
            i = index;
            temp[i] = content[index] ;
            return;
        }

        //2.与已经翻开的卡片相同
        if (temp[i] === content[index] ) {

            opened[i] = temp[i];
            opened[index] = content[index] ;

            $(".show").removeClass().addClass(anims["match"] + ' animated match').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass().addClass("match");
            });
            $(this).removeClass().addClass(anims["match"] + ' animated match').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass().addClass("match");
            });

            if(Object.getOwnPropertyNames(opened).length === content.length){
                <!--添当用户赢得游戏时，系统会弹出一个模式窗口，恭喜玩家获胜了，并询问是否再玩一次。还应该告诉用户赢得游戏花费了多长时间，星级评分是多少。-->
                var finaltime = "用时："+$("#time").text();
                var finalscore = "评分："+$("#rate").text();
                $("#costtime").html(finaltime);
                $("#score").html(finalscore);
                $("#myModal").modal();
                clearInterval(nIntervId);
                return;
            }else {
                // 继续游戏
                delete temp[i];
                i = -1;
                return;
            }
        }

        //3.与已翻开的不同
        setTimeout(function () {

            $(".show").removeClass().addClass(anims["wrong"] + ' animated wrong').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass().addClass("block");
                $(this).html("");
            });
            $(this).removeClass().addClass(anims["wrong"] + ' animated wrong').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass().addClass("block");
                $(this).html("");
            });

            delete temp[i];
            i = -1;

        },300);

    }

}

//随机方法
function shuffle(a) {
    var len = a.length;
    for (var i = 0; i < len - 1; i++) {
        var index = parseInt(Math.random() * (len - i));
        var temp = a[index];
        a[index] = a[len - i - 1];
        a[len - i - 1] = temp;
    }
    return a;
}

function updateRateInfo(times) {
    //计时器
    if(times === 0){
        $("#time").html("00:00:00");
    }
    if(times === 1){
        var starttime = 0;
        nIntervId = setInterval(function() {
            starttime  += 1;
            $("#time").html(timeForm(starttime));
        },1000);
    }
    //评级、步数
    var rate;
    if(times>=0 && times<=level1){
        rate = 5;
    }else if(times>level1 && times<=level2){
        rate = 4;
    }else if(times>level2 && times<=level3){
        rate = 3;
    }else if(times>level3 && times<=level4){
        rate = 2;
    }else if(times>level4 && times<=level5){
        rate = 1;
    }else if(times>level5){
        rate = 0;
    }
    $("#rate").html("★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate));
    $("#steps").html("  "+times+"步");
}

function reloadPage(){
    window.location.reload()
}

//输入 秒数
//输出 00：00：00格式的时间
function timeForm(time) {
    var hour,minute,second = -1;

    if(time/3600 >= 1){
       minute = time % 3600;
       hour = (time-minute)/3600;
    }else {
        minute = time;
    }

    if(minute/60 >= 1){
        second = minute % 60;
        minute = (minute-second)/60;
    }else {
        minute = -1;
        second = time;
    }

    var t = [hour,minute,second];

    for(var index in t){
        if(t[index] >= 0){
            t[index] = t[index]>9?t[index]:("0"+t[index]);
        }else {
            t[index] = "00";
        }
    }
    return t.join(":");

}