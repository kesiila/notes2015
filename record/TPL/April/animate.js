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
                                           "background-position-y": "-="+cell
                                               },500);
                                               }


                                               setInterval(function() {
                                                 animate($num, BaseX, BaseY,
                                                 HEIGHT);
                                                 }, 2000);



                                                 function split (num) {
                                                   var string = num + '',
                                                         local
                                                         = string.split('');
                                                           return function() {
                                                               return {
                                                                   num0:
                                                                   local[0],
                                                                       num1:
                                                                       local[1],
                                                                           num2:
                                                                           local[2],
                                                                               num3:
                                                                               local[3]
                                                                                 };
                                                                                   };
                                                                                   }

                                                                                   function
                                                                                   mock()
                                                                                   {
                                                                                       var
                                                                                       base_num
                                                                                       = 1000;
                                                                                           return
                                                                                           {
                                                                                                 get_num
                                                                                                 :function
                                                                                                 ()
                                                                                                 {
                                                                                                         base_num
                                                                                                         = base_num
                                                                                                         + random(10);
                                                                                                                 return
                                                                                                                 base_num;
                                                                                                                       }
                                                                                                                           };
                                                                                                                           }
