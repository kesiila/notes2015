# about base assert
```
(function () {
    function assert () {
       return {
            typeEqual: function (param, type) {
                if (param typeOf Array && type typeOf array){
                    for(var i; i < param.length; i++) {
                        if (! param[i] typeOf type[0]) {
                            throw TypeError();
                        }
                    }
                    throw TypeError();
                }
                if (!param typeOf type) throw TypeError();
            }
       }
    }
})();
```