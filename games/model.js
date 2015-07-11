/*  ----------------------- Cheer -------------------------------------------
 */
function Cheer(type, position){
   this.x = 'x';
   this.y = 'y';
   this[this.x] = position[x];
   this[this.y] = position[y];
}

Cheer.prototype.moveTo = moveTo;

// Cheer.moveTo:position -> boolean
function moveTo(position, board) {
    board.history.push(new Step(this, postion)) ;
    board.crtStep ++;
}
/*
 */
// 每一步，某个棋子的走法
function Step(cheer, postion) {
    assert.notNull(cheer);
    assert.notNull(postion);
    this.cheer = cheer;
    this.postion = postion;
}

/* **************************************************************************
 */


/* ------------------------Board --------------------------------------------
 */
// Board: size -> board : Array<Cheer>[][]
function Board() {
    var x = x || 8;
    var y = y || 8;
    this.board =  new Array[x][y];
    this.history =  new Array();
    this.crtStep =  0; // 初始状态假定为第0步。
}

function previous() {
    if(this.crtStep > 1) {
        this.crtStep--;
    }
}

function next() {
    if(this.crtStep < this.history.length - 1) {
        this.crtStep++;
    }
}
/* ******************* Board ***********************************************
 */

//------------------------------ Render ---------------------------------------
function Render(target, board) {
    this.target = target; // 暂时没有用到
    this.board = board;
}

function rend () {
    for(var i = 0; i < this.board; i ++ ) {
        $(makeClass(this.postion))
    }
    function makeClass (position) {
        return ['.cheer', '_x', positon.x, '_y', postion.y].join('');
    }
}
//**************************************************************************
