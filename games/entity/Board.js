// Board: size -> board : Array<Cheer>[][]
function Board() {
    var x = x || 8;
    var y = y || 8;
    this.board =  new Array[x][y];
    this.history =  new Array();
    this.crtStep =  0; // 初始状态假定为第0步。
}

function previous() {
    if(this.crtStep>1) {
        this.crtStep--;
    }
}

function next() {
    if(this.crtStep < this.history.length - 1) {
        this.crtStep++;
    }
}