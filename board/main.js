var R = require("./role.js");
var W = require("./win.js");
//require("../util/util");
var primaryAi = require("./primaryAi.js");

var Board = function (container, status) {
    this.container = container;
    this.status = status;
    this.backCount = 1;
    this.isComVersion = false;

    let that = this;

    //棋盘的边角offset
    this.boardItemWidth = '';
    this.offset = '';
    this.offsetLeft = '';
    this.offsetTop = '';

    wx.createSelectorQuery().select(container).boundingClientRect(function(rect){
        let _width = rect.width;
        that.boardItemWidth= parseInt(_width) * 0.065;
        that.offset = parseInt(_width) * 0.041;
        that.offsetLeft = rect.left;
        that.offsetTop = rect.top;
    }).exec()

    this.steps = [];  //存储
    this.forwardSteps = []; //撤销悔棋
    this.started = false;

    /*标志位*/
    this.isWhiteTurn = true;
};

Board.prototype.start = function () {
    if (this.started) return;
    this.initBoard();
    this.board[7][7] = R.com;
    this.steps.push([7, 7]);
    this.started = true;
}

Board.prototype.stop = function () {
    if (!this.started) return;
    this.started = false;
    this.setStatus("请重新开始");
}

Board.prototype.setStatus = function (s) {
    let _event = getApp().globalData.eventCenter;
    _event.emit('setStatus',s);
}

Board.prototype.initBoard = function () {
    this.board = [];
    for (var i = 0; i < 15; i++) {
        var row = [];
        for (var j = 0; j < 15; j++) {
            row.push(0);
        }
        this.board.push(row);
    }
    this.steps = [];
    this.forwardSteps =[];
}

Board.prototype.draw = function (x, y) {
    let _event = getApp().globalData.eventCenter;
    _event.emit('draw',x,y);
}

Board.prototype._set = function (x, y, role) {
    let _event = getApp().globalData.eventCenter;
    if (!this.isComVersion)
        this.isWhiteTurn = !this.isWhiteTurn;
    this.board[x][y] = role;
    this.steps.push([x, y]);
    this.draw(x, y);
    var winner = W(this.board);
    var self = this;
    if (winner == R.com) {
        if(this.isComVersion)
            _event.emit('alert',"电脑赢了！");
        else
            _event.emit('alert',"黑棋赢了！");
        self.stop();
    } else if (winner == R.hum) {
        _event.emit('alert',"白棋赢了！");
        self.stop();
    }
}

Board.prototype.set = function (x, y, role) {
    if (this.board[x][y] !== 0) {
        console.log("此位置不为空");
        return;
    }
    this._set(x, y, role);
    this.forwardSteps = [];
    if(this.isComVersion)
        this.com();
};

Board.prototype.com = function () {
    if (!this.started) return;
    var result = primaryAi(this.board);
    this._set(result[0], result[1], R.com);
}

Board.prototype.back = function (count) {
    if(!this.started)
        return;
    count = this.backCount ? this.backCount : 1;
    while (count > 0 && this.steps.length > 0) {
        var s = this.steps.pop();
        this.forwardSteps.push(s.concat(this.board[s[0]][s[1]]));
        this.board[s[0]][s[1]] = R.empty;
        this.draw(s[0], s[1]);
        count--;
        this.isWhiteTurn = !this.isWhiteTurn;
    }
};

Board.prototype.forward = function (count) {
    if(!this.started)
        return;
    count = this.backCount ? this.backCount : 1;
    while (count > 0 && this.forwardSteps.length > 0) {
        var s = this.forwardSteps.pop();
        this.board[s[0]][s[1]] = s[2];
        this.draw(s[0], s[1]);
        this.steps.push([s[0], s[1]]);
        count--;
        this.isWhiteTurn = !this.isWhiteTurn;
    }
};

module.exports = {
    board : Board
}
// var b = new Board($("#board"), $(".status"));
// $("#start").addEventListener('click', function () {
//     b.start();
// });

// $("#fail").addEventListener('click', function () {
//     if (confirm("确定认输吗?")) {
//         b.stop();
//     }
// });

// $("#back").addEventListener('click', function () {
//     b.back();
// });

// $("#forward").addEventListener('click', function () {
//     b.forward();
// });

// $("#alertBtn").addEventListener('click',function () {
//     Util.css($("#alert"), 'display', 'none');
// });

// $("#selectMode").addEventListener('change',function (e) {
//         var val =e.target.value;
//         if(val =='1'){
//             b.backCount = 1;
//             b.isComVersion = false;
//             b.stop();
//         }else{
//             b.backCount = 2;
//             b.isComVersion = true;
//             b.stop();
//         }
// });
