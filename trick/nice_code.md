           var exports = {
                template: [],
                templateAtom:{},
                randomGenerate: randomGenerate,
                generateWithArray: generateWithArray,
                unwrapper: unwrapper,
                getData: getData,
                generate: generate
            }
            /*
            节点类
            String->Array->{_:String,_:Array}
             */
            function Atom(type, body) {
                this.type = type || 'constant';
                this.body = (body = body || [], _.isArray(body) ? body : [body]);
                this.used = [];
            }

            _.extend(Atom.prototype, {
                setBody: function (body) {
                    this.body = _.isEmpty(this.body) ? (_.isArray(body) ? body : [body]) : (this.body.push(body), this.body);
                },
                setType: function (type) {
                    this.type = type || 'constant';
                },
                setUsed: function (num) {
                    this.used.push(num);
                },
                clear: function () {
                    this.type = 'constant';
                    this.body = [];
                },
                size: function () {
                    return this.body.length;
                },
                clone: function () {
                    return _.extend(new Atom(), this);
                },
                drop: function (index) {
                    this.body.split(index, 1);
                }
            })
            /*
            辅助类
             */
            function Stack() {
                this.data = [];
                this.pre = [];
            }

            _.extend(Stack.prototype, {
                push: function (char) {
                    this.pre = _.clone(this.data);
                    this.data.push(char)
                },
                pop: function () {
                    this.data.pop();
                },
                getCurrent: function () {
                    var t = _.clone(this.data.join(''));
                    return t;
                },
                clear: function () {
                    this.data = [];
                },
                getPre: function () {
                    return _.clone(this.pre.join(''));
                }
            })
            /*
            simple lexer and construct abstract syntax tree
            String -> Atom
             {abc|def|g} --> [abc,def,g]
             */
            function unwrapper(data) {
                var exports = new Atom('multi', []);
                var stack = new Stack();
                var length = data.length;
                var flag = 0;
                var isVariable = false;
                var temp_atom = new Atom();
                var inner_atom = new Atom();
                _.forEach(data.slice(1, data.length - 1).split(''), function (item, index) {
                    stack.push(item);
                    //到达尾部
                    if (index == length - 3) {
                        if (inner_atom.size() > 0) {
                            stack.getPre() && inner_atom.setBody(new Atom('constant', stack.getPre()))
                            exports.setBody(inner_atom.clone());
                            inner_atom.clear();
                        } else {
                            temp_atom.setType('constant');
                            temp_atom.setBody(stack.getCurrent());
                            stack.clear();
                            exports.setBody(temp_atom.clone());
                            temp_atom.clear();
                        }
                    }
                    if (_.isEqual(item, '{')) {
                        flag++;
                    }
                    if (_.isEqual(item, '}')) {
                        flag--;
                    }
                    // 1{ 2| 3{ 4| 5} 6}  --->  | { | }  :: match 外层 2|   structure  Atom
                    if ((_.isEqual(item, '|')) && flag == 0 && isVariable == false) {
                        if (inner_atom.size() > 0) {
                            stack.getPre() && inner_atom.setBody(new Atom('constant', stack.getPre()))
                            exports.setBody(inner_atom.clone());
                            inner_atom.clear();
                            stack.clear()
                        } else {
                            temp_atom.setType('constant');
                            temp_atom.setBody(stack.getPre());
                            stack.clear();
                            exports.setBody(temp_atom.clone());
                            temp_atom.clear();
                        }
                    }
                    // 1{ 2| 3{ 4| 5} 6} match  ---> | { | } :: match 内层 3{ then structure Atom
                    if (flag == 1 && isVariable == false) {
                        inner_atom.setType('constant');
                        inner_atom.setBody(new Atom('constant', _.clone(stack.getPre())));
                        stack.clear();
                        stack.push(item);
                    }
                    // 1{ 2| 3{ 4| 5} 6} match  ---> | { | } :: match 内层 3{ 5} 之间的内容 -- 跳过
                    if (flag == 1 && isVariable == true) {
                        //skip
                    }
                    // 1{ 2| 3{ 4| 5} 6} match  ---> | { | } :: match 5} 递归调用
                    if (flag == 0 && isVariable == true) {
                        inner_atom.setBody(unwrapper(stack.getCurrent()))
                        stack.clear()
                    }
                    if (_.isEqual(item, '{') && flag > 0) {
                        isVariable = true;
                    }
                    if (_.isEqual(item, '}') && flag == 0) {
                        isVariable = false;
                    }
                });
                return exports
            };
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

            //this is just for test the predicate
            function testFn(str) {
                if (str.match(/\[公司产品\]/) || str.match(/\[收件人\]/) || str.match(/\[产品认证\]/) || str.match(/\[公司名称\]/)) {
                    return true;
                } else {
                    return false;
                }
            }
            /*
                解析AST的parser,对{|}采用随机生成的形式
                array->sourceTree->predicateFn
                arrayHook:用以存放得到的字符串对应的位置序列
                predicate:用以过滤的条件函数
                这里接受两种方式来生成遍历序列：完全随机生成 和 带有过滤条件的随机生成
                todo:这里可以做得更好，可以将生成方式抽象出来。得到一个可以接受生成方式和过滤条件的原子性的函数。
                todo:从底层的角度出发，限定和约束都是可抽象的。无耦合的部分都是可抽象的，运行完毕不需要继续存在内存地址中的部分？
                todo:从需求的角度出发，需求中不会变化的地方是可以抽象的，将变化的部分以参数传递进去，构造出来千变万化的东西，这也是框架的做法。
                todo：通用框架是以一种略底层的来抽象的，因为越底层越能拓展。而作为user需要以需求中变化与不变的部分来做一层shim plate（or shell），使使用者更加方便。（那么是不是可以说all program is a shell between user and computer electrical level switch？）
                todo：electrical-level -> 0/1(binary code) -> assemble -> jvm(compilor/parser) -> common language(c/c++/java/js/haskell/scala) -> natural language
                todo:pipe，dispatch。
                todo:一样东西的好坏，在于其最初设置时提供的接口与目标群体的契合。
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
            /*
            用字符串序列和AST还原遍历序列
            array：位置数组
            atom：AST
             */
            //[]->atom->string
            function generateWithArray(array, atom) {
                if (_.isEqual(atom.type, 'constant')) {
                    return _.chain(atom.body).reduce(function (mem, item) {
                        if (item instanceof Atom) {
                            return mem + generateWithArray(array, item);
                        } else {
                            return mem + item;
                        }
                    }, '').value()
                }
                if (_.isEqual(atom.type, 'multi')) {
                    var num = array.shift();
                    return generateWithArray(array, atom.body[num]);
                }
            }

            function getData(successFn, errorFn, thenFn) {
                $http.get("/json/templateGenerator.json")
                    .success(successFn)
                    .error(errorFn)
                    .then(thenFn);
            }

            getData(function (res) {
                exports.template = res.data;
                //取得数据后立即生成语法树用以缓存
                exports.templateAtom = unwrapper('{' + exports.template[0].body.join('') + '}');
            })

            return exports;
        }]
