canvas=document.getElementById("cvs");
var ctx=canvas.getContext("2d");
var ChessColor=["#fffff0","#101010"]; //white Black
var step=1;
var checkerboard=[]; // store (x,y) state
var computer=0;
var human=0;
var enable=1; 
var mode=[
    [1,0], //水平
    [0,1], //垂直
    [1,1], //右下左上
    [1,-1] //右上左下
];
//AI
var wins=[]; //store all the win ways for AI
var over=false;
var me=true;
var humanWin=[];
var computerWin=[];
var count=0;

$(function(){
    newgame();
});

function newgame(){
    cleanCanvas();
    $("#gameStart").remove();
    init();
    // startGame();
}

function init(){
    step=1; computer=0; human=0;
    over=false; me=true; count=0;
    enable=1;
    $("#victor").text(" ");
    DrawLine();
    DrawPoint();
    checkerboardINIT();
    startGame();
}

function startGame(){
    $("#container").append("<div id='gameStart' class='gameStart'>"+
    "<a href='javascript:Human();' id='stratGameBtn1' class='p2'>Play with Human</a>" +
    "<a href='javascript:AI();' id='stratGameBtn2' class='p2'>Play with Computer</a></div>");
}

function Human(){
    $("#gameStart").remove();
    human=1;
}

function AI(){
    $("#gameStart").remove();
    computer=1;
    winsINIT();
}

function winsINIT(){
    // 3 dimension array
    for(var i=0;i<19;i++){
        wins[i]=[];
        for(var j=0;j<19;j++){
            wins[i][j]=[];
        }
    }
    //橫的
    for(var i=0;i<19;i++){
        for(var j=0;j<15;j++){
            for(var k=0;k<5;k++)
                wins[i][j+k][count]=true;
            count++
        }
    }
    //直的
    for(var i=0;i<19;i++){
        for(var j=0;j<15;j++){
            for(var k=0;k<5;k++)
                wins[j+k][i][count]=true;
            count++;
        }
    }
    //右上左下
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            for(var k=0;k<5;k++)
                wins[i+k][j+k][count]=true;
            count++;
        }
    }
    //左上右下
    for(var i=0;i<15;i++){
        for(var j=18;j>3;j--){
            for(var k=0;k<5;k++)
                wins[i+k][j-k][count]=true;
            count++;
        }
    }
    //console.log(count); //總共有1020種贏法
    for(var i=0;i<count;i++){
        humanWin[i]=0;
        computerWin[i]=0;
    }
}

function checkerboardINIT(){
    for(var i=0;i<19;i++){
        checkerboard[i]=[];
        for(var j=0;j<19;j++){
            checkerboard[i][j]=0;
        }
    }
}

function DrawLine(){
    ctx.beginPath();
    for(var i=1;i<20;i++){
        ctx.moveTo(30*i,30);
        ctx.lineTo(30*i,570);
        ctx.moveTo(30,30*i);
        ctx.lineTo(570,30*i);
    }
    ctx.stroke();
}

function cleanCanvas(){
    ctx.clearRect(0,0,600,600);
}

function point(x,y){
    ctx.beginPath();
    ctx.arc(x,y,4,0,2*Math.PI,true); //x,y,r,start angle,end angle,counterclockwise
    ctx.fillStyle="black";
    ctx.fill();
}

function DrawPoint(){
    for(var i=0;i<=360;i+=180){
        for(var j=0;j<=360;j+=180){
            point(120+i,120+j);
        }
    }
}

function DrawChess(x,y,color){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,14,0,2*Math.PI,true);
    ctx.fill();
    ctx.stroke();
}

canvas.addEventListener("click",function(e){
    if(human && enable){  //if play human v.s. human
        var px = Math.floor((e.offsetX+15)/30)-1;
        var py = Math.floor((e.offsetY+15)/30)-1;
        if((px+1)*30==0||(px+1)*30==600||(py+1)*30==0||(py+1)*30==600)
            return;
        if(checkerboard[px][py]==0){
            DrawChess((px+1)*30,(py+1)*30,ChessColor[step%2]);
            checkerboard[px][py]=ChessColor[step%2];
            //console.log(px,py,color);
            setTimeout(CheckWin,100,px,py,ChessColor[step%2],mode[0]);
            setTimeout(CheckWin,100,px,py,ChessColor[step%2],mode[1]);
            setTimeout(CheckWin,100,px,py,ChessColor[step%2],mode[2]);
            setTimeout(CheckWin,100,px,py,ChessColor[step%2],mode[3]);
            //setTimeout(CheckWinY,100,px,py,ChessColor[step%2]);
            step++;
        }
        //setTimeout(CheckWin,100,px,py,ChessColor[step%2]);
        //CheckWin(px,py,ChessColor[step%2]);
    }
    else if(computer){  //if play human v.s. computer
        if(over) return;
        if(!me) return; //initial me=1
        var px = Math.floor((e.offsetX+15)/30)-1;
        var py = Math.floor((e.offsetY+15)/30)-1;
        if((px+1)*30==0||(px+1)*30==600||(py+1)*30==0||(py+1)*30==600)
            return;
        if(checkerboard[px][py]==0){
            DrawChess((px+1)*30,(py+1)*30,ChessColor[step%2]);//black
            checkerboard[px][py]=ChessColor[step%2];
            for(var k=0;k<count;k++){
                if(wins[px][py][k]){
                    humanWin[k]++;
                    computerWin[k]=6;
                    if(humanWin[k]==5){
                        // alert("you win");
                        EndGame(ChessColor[step%2]);
                        over=true;
                    }
                }
            }
            step++;
            if(!over){
                me=!me; //computer turn
                setTimeout(computerAI,100);
            }
        }
    }
});

function computerAI(){
    var humanScore=[];
    var computerScore=[];
    var best=0; //value of the chess which we want to drop
    var u=0,v=0;
    for(var i=0;i<19;i++){
        humanScore[i]=[];
        computerScore[i]=[];
        for(var j=0;j<19;j++){
            humanScore[i][j]=0;
            computerScore[i][j]=0;
        }
    }
    for(var i=0;i<19;i++){
        for(var j=0;j<19;j++){
            if(checkerboard[i][j]==0){
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]){ 
                        if(humanWin[k]==1)  //black
                            humanScore[i][j]+=200;
                        else if(humanWin[k]==2)
                            humanScore[i][j]+=400;
                        else if(humanWin[k]==3)
                            humanScore[i][j]+=2000;
                        else if(humanWin[k]==4)
                            humanScore[i][j]+=10000;
                        if(computerWin[k]==1)  //white
                            computerScore[i][j]+=220;
                        else if(computerWin[k]==2)
                            computerScore[i][j]+=420;
                        else if(computerWin[k]==3)
                            computerScore[i][j]+=2200;
                        else if(computerWin[k]==4)
                            computerScore[i][j]+=20000;
                    }
                }
                if(humanScore[i][j]>best){
                    best=humanScore[i][j];
                    u=i;
                    v=j;
                }
                else if(humanScore[i][j]==best){
                    if(computerScore[i][j]>computerScore[u][v]){
                        u=i;
                        v=j;
                    }
                }
                if(computerScore[i][j]>best){
                    best=computerScore[i][j];
                    u=i;
                    v=j;
                }
                else if(computerScore[i][j]==best){
                    if(humanScore[i][j]>humanScore[u][v]){
                        u=i;
                        v=j;
                    }
                }
            }
        }
    }
    DrawChess((u+1)*30,(v+1)*30,ChessColor[step%2]);
    checkerboard[u][v]=ChessColor[step%2];
    for(var k=0;k<count;k++){
        if(wins[u][v][k]){
            computerWin[k]++;
            humanWin[k]=6;
            if(computerWin[k]==5){
                // alert("computer win");
                EndGame(ChessColor[step%2]);
                over=true;
            }
        }
    }
    if(!over) me=!me;
    step++;
}

function CheckWin(x,y,color,mode){
    //console.log(x,y,color);
    var count=0;
    for(var i=1;i<=5;i++){
        if(checkerboard[x+i*mode[0]]){
            if(checkerboard[x+i*mode[0]][y+i*mode[1]]==color)
                count++;
            else break;
        }
    }
    for(var i=1;i<=5;i++){
        if(checkerboard[x-i*mode[0]]){
            if(checkerboard[x-i*mode[0]][y-i*mode[1]]==color)
                count++;
            else break;
        }
    }
    //console.log("水平方向有",count+1,"個",color);
    if(count>=4){
        // alert(color+"win");
        enable=!enable;
        EndGame(color);
    }
}

function EndGame(color){
    if(color=="#fffff0")
        $("#victor").text(" White");
    else if(color=="#101010")
        $("#victor").text(" Black");
}

