//保存游戏进度的变量
var opened = {};
var remain;//纪录剩余卡片数量
var i = -1;//前一个被翻开的方块序号
var temp = {};//前一个被翻开的方块属性
var content = [];//匹配内容
var blocks;
var icon = ["glyphicon glyphicon-cd","glyphicon glyphicon-camera","glyphicon glyphicon-home","glyphicon glyphicon-fire",
            "glyphicon glyphicon-star-empty","glyphicon glyphicon-tint","glyphicon glyphicon-music","glyphicon glyphicon-star"];
var list = [0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7];

//生成图片块
$(document).ready(function () {
    var colmd3 = document.getElementsByClassName("col-md-3");
    for(var index in colmd3){
        colmd3[index].innerHTML = "<div class='block'></div>";
    }
});

//添加点击监听
window.onload = function () {
    blocks = document.getElementsByClassName("block");
    remain = blocks.length;
    var randomlist = shuffle(list);
    //TODO 添加悬停效果
    for(var index in blocks) {
        blocks[index].id = index;
        content[index] = "<span class='"+ icon[randomlist[index]]+"' aria-hidden=\"true\"></span>";
        blocks[index].addEventListener("click",mycheck());
    }
}

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

//闭包返回函数，避免在添加监听时（触发时）被执行
function mycheck() {
    return function () {
        var index = this.id;

        if(i !== -1 && i === index){
            return;
        }
        if(index in opened){//opened.hasOwnProperty(index))
            return;
        }

        //展示当前卡片内容
        blocks[index].className = "block show";
        blocks[index].innerHTML = content[index];

        //TODO 添加匹配、失败的动态效果


        //保存当前翻开的卡片
        if (i === -1) {
            i = index;
            temp[i] = blocks[index].innerHTML ;
            blocks[i].removeEventListener("click", mycheck());//TODO 没有用？？？？？
            return;
        }

        //与已经翻开的卡片相同
        if (temp[i] === blocks[index].innerHTML ) {

            opened[i] = temp[i];
            opened[index] = blocks[index].innerHTML ;

            blocks[i].removeEventListener("click", mycheck());
            blocks[index].removeEventListener("click", mycheck());
            blocks[i].className = "block match";
            blocks[index].className = "block match";

            remain = remain-2;
            // if (opened.length !== content.length) {//TODO 如何获取对象的属性数量？？
            if (remain===0) {
                //TODO 添加游戏计时（倒计时）
                document.getElementsByClassName("gameresult")[0].innerHTML = "恭喜！顺利过关！"
                return;
            }else {
                delete temp[i];
                i = -1;
                return;

            }
        }

            //与已翻开的不同
        setTimeout(function () {
            blocks[i].addEventListener("click", mycheck());
            blocks[i].className = "block";
            blocks[i].innerHTML = "";
            blocks[index].className = "block";
            blocks[index].innerHTML = "";

            delete temp[i];
            i = -1;

        },300);

    }
}
