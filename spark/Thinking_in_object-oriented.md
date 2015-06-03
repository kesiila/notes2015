##### Thinking in Object Oriented
*. key words
    * 将需求表达为类型的正确的编程方法
    * 泛对象
    * 泛函
    * 泛信号
    * what first citizen means ?
1.将需求表达为类型的正确的编程方法
    * 语出 Eric Maye,写需求就是写类型描述
    * curring in FP equals inherit in OO sometimes
2. 泛对象
    * 如果把function也视一个对象，那么OO是不是也可以变成FP？
        * 曾经有人用java只含一个方法的类来当作 function
          object,而且好像是可行的.
        * 对于啰嗦至极的java，有callable和functional 的interface来供实现。
          但没有改掉一贯的啰嗦习惯.
        * 在haskell里，function
          是一个原生的大集合，里边有各种类型的function--通过函数签名来区分。是否可以视为一个范畴？
            * 待细究
3. 泛函
    * 如果把所有的Object视为function，是不是意味着 OO
      只是FP的某个类型的一个子范畴，子类型
            * 待细究
4. 泛信号
    * 如果把FP 和OO中的call and eval expression 视为时间轴上的高低电平跳动的信号，从这个角度是不是可以得到下边的结论。
        * programing 中的计时单位--step，对应到 real world的time
          line中,其实是不均匀的。无论是在FP和OO中都是如此。在FP中，one step
          means to eval one expression in the scope，which should be embed with the same
          concept。在OO，one step means one message sending from sender to
          receiver。
        * in this point, the abstract means the resize the volume of the
          objects in the world. eg. I am confused, may be it means the
          inhomogeneous distribution,which should be the nature about our
          universe, in the general meaning,
        * if it is true, what does matter is the dimension,which is one to one
          coresponding with
          unit, which means there is a type combinated with the litter element
          or type.
        * 同样重要的是那些在普遍意义上没有单位的集合。这是不是就是普通意义上的范
          畴.将不同的东西组合到一起,（包括时间，空间，分子，原子）,变成一个单位（类型）,
          which is inhomhnerous. 再将这些不均匀的类型组合到一起变成更加复杂的单位。
5. what is first class citizen
    * first class citizen is the object which could be used as arguments ,return
      value and assign to a variable.
    * second. only as aruments,can't be returned and assigned.
    * third.  nothing.
