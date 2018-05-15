let board = require("../../board/main").board;
let R = require("../../board/role.js")
var b ;

Page({
	data:{
		status:'',
		array:[],
		range:['双人对战','电脑版本'],
		range_index:0,
		showAlert:false,
		alertContent:''
	},
	start_btn:function (argument) {
		if (b.started) return;
		b.start();
		this.setData({
			status:'欢迎加入五子棋游戏'
		});
		this.draw();
		this.draw(7,7);
	},
	fail_btn:function (argument) {
		// body...
		 b.stop();
	},
	back_btn:function(){
		b.back();
	},
	forward_btn:function (argument) {
		// body...
		b.forward();
	},
	alert_btn:function (argument) {
		// body...
		this.setData({
			showAlert:false,
			alertContent:''
		})
	},
	bindPickerChange:function(e){
		let _val = e.detail.value;
		this.setData({
			range_index:_val
		})
	   	if(_val !='1'){
            b.backCount = 1;
            b.isComVersion = false;
            b.stop();
        }else{
            b.backCount = 2;
            b.isComVersion = true;
            b.stop();
        }
        this.setData({
			status:'请重新开始'
		});
	},
	board_tap:function (e) {
		if(b.lock || !b.started)
			return;
		let x,y;
		x = Math.round(((e.detail.x - b.offsetLeft) - b.offset) / b.boardItemWidth);
        y = Math.round(((e.detail.y - b.offsetTop) - b.offset) / b.boardItemWidth);
        if (b.isComVersion)
            b.set(x, y, R.hum);
        else {
            if (b.isWhiteTurn)
                b.set(x, y, R.hum);
            else
                b.set(x, y, R.com);
        }
	},
	draw:function(x,y){
		let board = b.board;
		let _arr = this.data.array.slice();
		if(arguments.length <2){
			this.setData({
				array:[]
			})
			return;
		}
		if (board[x][y] != 0) {
			var _style ="top:"+ Number(b.offset + y * b.boardItemWidth) + "px;" + "left:" + Number(b.offset + x * b.boardItemWidth) + "px";
			_arr.push({
				id:x + "and" + y,
				class:"chessman " + (board[x][y] == 2 ?'black':''),
				style:_style
			});
	        this.setData({
	        	array:_arr
	        })
	    } else {
	    	let _index =0;
    		_arr.forEach((item,index)=>{
				if(item.id == (x + "and" + y))
					_index = index;
    		})
    		_arr.splice(_index,1);
    		this.setData({
    			array:_arr
    		})
	    }
	},
	onReady:function(){
		b = new board("#board");
		this.setData({
			status:'请点击开始按钮'
		});
		let _event = getApp().globalData.eventCenter;
		let that = this;
		_event.on('draw',function(coordinate){
			if(coordinate.length == 2)
				that.draw(coordinate[0],coordinate[1]);
			else
				that.draw();
		});
		_event.on('alert',function(content){
			that.setData({
				showAlert:true,
				alertContent:content[0]
			})
		});
		_event.on('setStatus',function(content){
			that.setData({
				status:content[0]
			})
		})
	}
})
