
 var $auto = $('.auto'),
     $num = $('.auto li div'),
         HEIGHT = 30,
             BaseX = -213,
                 BaseY = -642;
function toNum (string) {
      return parseInt( string.slice(0,string.length-2), 10);
}

function animate (ele, base_x, base_y, cell) {
        if (toNum(ele.css('background-position-y')) < -1182) {
                  ele.css('background-position-y', BaseY);
                      }
            ele.animate({
                      "background-position-y": "+="+cell
                              },500);
}

function split (num) {
      var string = num + '',
          local = string.split('');
        return function() {
                return {
                        num0: local[0] * 1,
                        num1: local[1] * 1,
                            num2: local[2] * 1,
                                num3: local[3] * 1
                                      };
                  };
}

function mock() {
        var base_num = 1000;
            return {
                      getNum :function () {
                                  base_num = base_num + Math.random(10);
                                          return base_num;
                                                }
                                  };
}

var previous = 1000,
        current,
            log = console.log;

function Node(ele, num) {
      this.ele = ele;
        this.num = num;
}

Node.prototype.setDomNum =  function (num) {
        var div = this.num - num;
            log(this.num);
                log(num);
                    animate($(this.ele), BaseX, BaseY, HEIGHT * div);
};


var node0 = new Node($num[0], split(previous)().num0),
        node1 = new Node($num[1], split(previous)().num1),
            node2 = new Node($num[2], split(previous)().num2),
                node3 = new Node($num[3], split(previous)().num3),
                    MOCK = mock();

setInterval(function() {
      current = 1000 + Math.round(Math.random()*10000);
          var newNum = split(current);
            console.log(node0);
              node0.setDomNum(newNum().num0);
                node1.setDomNum(newNum().num1);
                  node2.setDomNum(newNum().num2);
                    node3.setDomNum(newNum().num3);
                      previous = current;
}, 2000);
