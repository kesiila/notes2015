(function () {
    'use strict';
    function Cheer(team, type, position) {
        this.x = 'x';
        this.y = 'y';
        this[this.x] = position[this.x];
        this[this.y] = position[this.y];
        this.type = type;
        this.team = team;
        this.status = 'defaults'; // defaults, active, attacked
    }

    Cheer.prototype.moveTo = moveTo;

// Cheer.moveTo:position -> boolean
    function moveTo(position, board) {
        board.history.push(new Step(this, position));
        board.crtStep++;
    }
})();
