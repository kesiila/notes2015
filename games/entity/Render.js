(function () {
    'use strict';
//---------------------------- Render ----------------------
    function Render(target, board) {
        this.target = target; // 暂时没有用到
        this.board = board;
    }

    function rend() {
        for(var i = 0; i < this.board; i++ ) {
            $(makeClass(this));
        }
        function makeClass(position) {
            return ['.cheer', '_x', position.x, '_y', position.y].join('');
        }
    }

    Render.prototype.rend = rend;
//**********************Render ******************************
})();
