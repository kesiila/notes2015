```
        /*
         再次封装提交一个可以获取更少细节的polyfill接口
         内部做了两个判断为server增加一层shell
         array[->predicateFn]->String
         arrayHook:用以存放得到的字符串对应的位置序列
         predicate:用以过滤的条件函数
          */
        function generate(arrayHook, predicate) {
            arrayHook = arrayHook || [];
            if (_.isFunction(predicate)) {
                return randomGenerate(arrayHook, this.templateAtom, predicate);
            } else {
                return randomGenerate(arrayHook, this.templateAtom);
            }
        }

        /*
            解析AST的parser,对{|}采用随机生成的形式
            array->sourceTree->predicateFn
            arrayHook:用以存放得到的字符串对应的位置序列
            predicate:用以过滤的条件函数
         */
        //生成开发信 atom->([],@string)
        function randomGenerate(arrayHook, atom, predicate) {
            if (_.isEqual(atom.type, 'constant')) {
                return _.chain(atom.body).reduce(function (mem, item) {
                    if (item instanceof Atom) {
                        return mem + randomGenerate(arrayHook, item, predicate);
                    } else {
                        return mem + item;
                    }
                }, '').value()
            }
            if (_.isEqual(atom.type, 'multi')) {
                var num = Math.ceil(Math.random() * (atom.size() - 1));
                var str = randomGenerate(arrayHook, atom.body[num], predicate);
                //如果传递了第三个参数，就以此做判断
                if (_.isFunction(predicate)) {
                    var count = 0;
                    while (predicate(str)) {
                        num = Math.ceil(Math.random() * (atom.size() - 1));
                        str = randomGenerate(arrayHook, atom.body[num], predicate);
                        count++;
                        if (count > 200) throw new Error("超过迭代次数");
                    }
                }
                arrayHook.push(num);
                return str;
            }
        }
```

* parser部分
    * 这里接受两种方式来生成遍历序列：完全随机生成 和 带有过滤条件的随机生成
    * 这里可以做得更好，可以将生成方式抽象出来。得到一个可以接受生成方式和过滤条件的原子性的函数。
* 关于抽象
    * 从底层的角度出发，限定和约束都是可抽象的。无耦合的部分都是可抽象的，运行完毕不需要继续存在内存地址中的部分？
    * 从需求的角度出发，需求中不会变化的地方是可以抽象的，将变化的部分以参数传递进去，构造出来千变万化的东西，这也是框架的做法。
    * 通用框架是以一种略底层的来抽象的，因为越底层越能拓展。而作为user需要以需求中变化与不变的部分来做一层shim plate（or shell），使使用者更加方便。（那么是不是可以说all program is a shell between user and computer electrical level switch？）
        * electrical-level -> 0/1(binary code) -> assemble -> jvm(compilor/parser) -> common language(c/c++/java/js/haskell/scala) -> natural language
* 关于实现
    * 这整个层层的实现中，应该会有很多类似pipe，dispatcher，manager来管理数据 请求 流向的地方
    * 一样东西的好坏，在于其最初设计时提供的接口对用户的友好度。
