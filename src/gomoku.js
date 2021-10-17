canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");
var ChessColor = ["#fffff0", "#101010"]; //white Black
var step = 1;
var checkerboard = []; // store (x,y) state
var computer = 0;
var human = 0;
var enable = 1; // user click controler 
var mode = [
    [1,0], //水平
    [0,1], //垂直
    [1,1], //右下左上
    [1,-1] //右上左下
];
//AI
var wins = []; //store all the win ways for AI
var over = false;
var me = true;
var humanWin = [];
var computerWin = [];

var count = 0;

var depth = 3; // minimax depth
var print = 0;
var test = 0;
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
    step = 1; computer = 0; human = 0;
    over = false; me = true; count = 0;
    enable = 1;
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
    human = 1;
    winsINIT();
}

function AI(){
    $("#gameStart").remove();
    computer = 1;
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
    //直的
    for(var i=0;i<19;i++){
        for(var j=0;j<15;j++){
            for(var k=0;k<5;k++)
                wins[i][j+k][count]=true;
            count++
        }
    }
    //橫的
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
    // console.log("hello js")
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
            if(
                CheckWin(px, py, ChessColor[step%2], mode[0], checkerboard) ||
                CheckWin(px, py, ChessColor[step%2], mode[1], checkerboard) ||
                CheckWin(px, py, ChessColor[step%2], mode[2], checkerboard) ||
                CheckWin(px, py, ChessColor[step%2], mode[3], checkerboard)
            ){
                enable =! enable;
                EndGame(ChessColor[step%2]);
            }
            step++;
        }
    }
    else if(computer){  //if play human v.s. computer
        if(over) return;
        if(!me) return; //initial me=1
        var px = Math.floor((e.offsetX+15)/30)-1;
        var py = Math.floor((e.offsetY+15)/30)-1;
        if((px+1)*30==0||(px+1)*30==600||(py+1)*30==0||(py+1)*30==600)
            return;
        if(checkerboard[px][py] == 0){
            DrawChess((px+1)*30,(py+1)*30,ChessColor[step%2]);//black
            console.log("hello black")
            checkerboard[px][py]=ChessColor[step%2];
            // check all posible winning statement and see
            // if the human player win the game or not
            for(var k=0;k<count;k++){
                if(wins[px][py][k]){
                    humanWin[k]++;
                    computerWin[k]=6;
                    if(humanWin[k]==5){  // if human win the game
                        EndGame(ChessColor[step%2]);
                        over=true;
                    }
                }
            }
            step++;
            
            if(!over){
                me=!me; //computer turn
                // setTimeout(computerAI, 100);
                setTimeout(function(){
                    var checkerboardCopy = checkerboard.map(function(arr) { return arr.slice(); });
                    var computerWinCopy = computerWin.slice();
                    var humanWinCopy = humanWin.slice();
                    
                    
                    // console.log("==== draw black chess ====");
                    var bestEval = minimax([px, py], depth, true, checkerboardCopy, 1, Number.NEGATIVE_INFINITY, 
                                            Number.POSITIVE_INFINITY, humanWinCopy, computerWinCopy, 0);
                    // console.log("==== best score ====");
                    console.log(bestEval[0]);
                    var best_x = bestEval[1][0];
                    var best_y = bestEval[1][1];
                    DrawChess((best_x+1)*30,(best_y+1)*30,ChessColor[step%2]);
                    checkerboard[best_x][best_y] = ChessColor[step%2];
                    for(var k=0;k<count;k++){
                        if(wins[best_x][best_y][k]){
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
                }, 500);
                // setTimeout(minimax, 100, [px, py], depth, true, checkerboard);
            }
        }
    }
});

// 目前捨棄不用
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
                    u = i;
                    v = j;
                }
                else if(humanScore[i][j]==best){
                    if(computerScore[i][j]>computerScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
                if(computerScore[i][j]>best){
                    best=computerScore[i][j];
                    u = i;
                    v = j;
                }
                else if(computerScore[i][j]==best){
                    if(humanScore[i][j]>humanScore[u][v]){
                        u = i;
                        v = j;
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

function gameOver(board, pos, color){
    return(
        CheckWin(pos[0], pos[1], ChessColor[color], mode[0], board) ||
        CheckWin(pos[0], pos[1], ChessColor[color], mode[1], board) ||
        CheckWin(pos[0], pos[1], ChessColor[color], mode[2], board) ||
        CheckWin(pos[0], pos[1], ChessColor[color], mode[3], board)
    )
}

function score(board, humanWin_temp, computerWin_temp){
    var blackScore = 0;
    var whiteScore = 0;

    for(var i=0; i<count; i++){
        if(humanWin_temp[i] === 1)
            blackScore += 5;
        else if(humanWin_temp[i] === 2)
            blackScore += 420;
        else if(humanWin_temp[i] === 3)
            blackScore += 2200;
        else if(humanWin_temp[i] === 4)
            blackScore += 20000;
        else if(humanWin_temp[i] === 5)
            blackScore += 60000;
        if(computerWin_temp[i] === 1)
            whiteScore += 0;
        else if(computerWin_temp[i] === 2)
            whiteScore += 220;
        else if(computerWin_temp[i] === 3)
            whiteScore += 1200;
        else if(computerWin_temp[i] === 4)
            whiteScore += 10000;
        else if(computerWin_temp[i] === 5)
            whiteScore += 60000;
    }
    return whiteScore - blackScore; // AI score - human score
}

function heuristic(x, y, board, hw, cw){
    var score = 0;
    // assume pos is white / black
    for(var i=0; i<count; i++){
        if(wins[x][y][i]){
            if(hw[i] === 1) score += 200;
            else if(hw[i] === 2) score += 2000;
            else if(hw[i] === 3) score += 20000;
            else if(hw[i] === 4) score += 60000;
            if(cw[i] === 1) score += 200;
            else if(cw[i] === 2) score += 2000;
            else if(cw[i] === 3) score += 20000;
            else if(cw[i] === 4) score += 60000;
        }
    }
    return score;
}

function getChildPos(board, hw, cw){
    // 回傳所有可以下的子節點，只考慮有落子的範圍為2的區間
    var pos_list = [], score_list = [];
    var minx = 0, miny = 0, maxx = 18, maxy = 18;
    loop1:
    for(var i=0; i<19; i++){
        for(var j=0; j<19; j++){
            if(board[i][j] != 0){
                minx = (i - 2 >= 0) ? i - 2 : 0;
                break loop1;
            }
        }
    }
    loop2:
    for(var i=18; i>=0; i--){
        for(var j=0; j<19; j++){
            if(board[i][j] != 0){
                maxx = (i + 2 < 19) ? i + 2 : 18;
                break loop2;
            }
        }
    }
    loop3:
    for(var j=0; j<19; j++){
        for(var i=0; i<19; i++){
            if(board[i][j] != 0){
                miny = (j - 2 >= 0) ? j - 2 : 0;
                break loop3;
            }
        }
    }
    loop4:
    for(var j=18; j>=0; j--){
        for(var i=0; i<19; i++){
            if(board[i][j] != 0){
                maxy = (j + 2 < 19) ? j + 2 : 18;
                break loop4;
            }
        }
    }
    for(var i=minx; i<=maxx; i++){
        for(var j=miny; j<=maxy; j++){
            if(board[i][j] === 0){
                var score = heuristic(i, j, board, hw, cw);
                var pos = 0;
                for(var idx=0; idx<=score_list.length; idx++){
                    if(idx === score_list.length){
                        pos_list.splice(idx, 0, [i, j]);
                        score_list.splice(idx, 0, score);
                        break;
                    }
                    if(score_list[idx] <= score){
                        pos_list.splice(idx, 0, [i, j]);
                        score_list.splice(idx, 0, score);
                        break;
                    }
                }
                //pos_list.push([i, j]);
            }
        }
    }
    //console.log("========= heuristic ========")
    //console.log(pos_list);
    //console.log(score_list);
    return pos_list;
}

function minimax(pos, depth, maximixingPlayer, board, color, alpha, beta, hw, cw, flag){
    
    board[pos[0]][pos[1]] = ChessColor[color];
    if(flag){
        for(var k=0; k<count; k++){
            if(wins[pos[0]][pos[1]][k]){
                if(color === 1){
                    hw[k] += 1;
                    cw[k] = 6;
                }
                else{
                    cw[k] += 1;
                    hw[k] = 6;
                }
            }
        }
    }
    if(depth == 0 || gameOver(board, pos, color)){
        
        //console.log(score(board));
        return [score(board, hw, cw), pos];
    }
    //board[pos[0]][pos[1]] = ChessColor[color];
    var pos_list = getChildPos(board, hw, cw);
    //console.log(pos_list);
    if(maximixingPlayer){ //computer player: max layer
        var maxEval = Number.NEGATIVE_INFINITY;
        var bestpos = [];
        for(const p of pos_list){
            var boardCopy = board.map(function(arr) { return arr.slice(); });
            var hwCopy = hw.slice();
            var cwCopy = cw.slice();
            var evaluate = minimax(p, depth - 1, false, boardCopy, 1 - color, alpha, beta, hwCopy, cwCopy, 1);
            if(evaluate[0] > maxEval){
                maxEval = evaluate[0];
                bestpos = p;
            }
            alpha = Math.max(alpha, evaluate[0]);
            if(beta <= alpha)
                break;
        }
        return [maxEval, bestpos];
    } 
    else{  // human player
        var minEval = Number.POSITIVE_INFINITY;
        var bestpos = [];
        for(const p of pos_list){
            var boardCopy = board.map(function(arr) { return arr.slice(); });
            var hwCopy = hw.slice();
            var cwCopy = cw.slice();
            var evaluate = minimax(p, depth - 1, true, boardCopy, 1 - color, alpha, beta, hwCopy, cwCopy, 1);
            if(evaluate[0] < minEval){
                minEval = evaluate[0];
                bestpos = p;
            }
            beta = Math.min(beta, evaluate[0]);
            if(beta <= alpha)
                break;
        }
        return [minEval, bestpos];
    }
}

function CheckWin(x, y, color, mode, board){
    var count=0;
    for(var i=1;i<=5;i++){
        if(board[x+i*mode[0]]){
            if(board[x+i*mode[0]][y+i*mode[1]]==color)
                count++;
            else break;
        }
    }
    for(var i=1;i<=5;i++){
        if(board[x-i*mode[0]]){
            if(board[x-i*mode[0]][y-i*mode[1]]==color)
                count++;
            else break;
        }
    }
    //console.log("水平方向有",count+1,"個",color);
    if(count>=4) return true;
    else return false;
}

function EndGame(color){
    if(color == ChessColor[0])
        $("#victor").text(" White");
    else if(color == ChessColor[1])
        $("#victor").text(" Black");
}

function scoretest(board){
    var humanWin_temp = [];
    var computerWin_temp = [];
    var blackScore = 0;
    var whiteScore = 0;
    for(var i=0; i<count; i++){
        humanWin_temp[i] = 0;
        computerWin_temp[i] = 0;
    }
    
    // initial computerWin_temp to current condition
    for(var i=0; i<19; i++){
        for(var j=0; j<19; j++){
            if(board[i][j] == ChessColor[0]){ // if the chess is white
                for(var k=0; k<count; k++){
                    if(wins[i][j][k] == true){
                        if(computerWin_temp[k] != 6)
                            computerWin_temp[k]++;
                        humanWin_temp[k] = 6;
                    }
                }
            }
        }
    }
    // initial humanWin_temp to current condition
    for(var i=0; i<19; i++){
        for(var j=0; j<19; j++){
            if(board[i][j] == ChessColor[1]){ // if the chess is black
                for(var k=0; k<count; k++){
                    if(wins[i][j][k] == true){
                        if(humanWin_temp[k] != 6)
                            humanWin_temp[k]++;
                        computerWin_temp[k] = 6;
                    }
                }
            }
        }
    }
    console.log(humanWin_temp);
    console.log(computerWin_temp);
    for(var i=0; i<count; i++){
        if(humanWin_temp[i] === 1)
            blackScore += 20;
        else if(humanWin_temp[i] === 2)
            blackScore += 50;
        else if(humanWin_temp[i] === 3)
            blackScore += 2000;
        else if(humanWin_temp[i] === 4)
            blackScore += 7000;
        else if(humanWin_temp[i] === 5)
            blackScore += 100000;
        if(computerWin_temp[i] === 1)
            whiteScore += 10;
        else if(computerWin_temp[i] === 2)
            whiteScore += 40;
        else if(computerWin_temp[i] === 3)
            whiteScore += 1000;
        else if(computerWin_temp[i] === 4)
            whiteScore += 4000;
        else if(computerWin_temp[i] === 5)
            whiteScore += 10000;
    }
    return whiteScore - blackScore; // AI score - human score
}