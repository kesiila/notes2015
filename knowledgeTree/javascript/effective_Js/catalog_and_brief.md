*  1\. 清楚Javascript版本
	* 总是在执行严格模式检查的环境中测试严格代码
	* 当心链接那些在不同严格模式下有不同预期的脚本。
*  2\. 理解浮点数
	* Javacript的数字都是·双精度的浮点数·。
	* 整数仅仅是双精度浮点数的一个子集，而不是一个单独的数据类型
	* 位元素运算符将数字视为·32位的有符号整数·。
	* 当心浮点运算中的精度陷阱。
*  3\. 当心隐式的强制转换
	*  3 + true；// output 4   
	*  类型错误可能被隐式的强制转化锁隐藏   
	*  重载的运算符+是进行加法运算还是字符链接取决于其参数类型  
	*  对象通过valueOf方法强制转化为数字，还是toString强制转化为字符串  
	*  具有valueOf方法的对象应该实现toString方法，返回一个valueOf方法产生的字符串表示  
	*  测试一个值是否为未定义的值时，应该使用typeOf或者与undefined进行比较而不是使用真值运算  
*  4\. 原始类型优于封装对象  
	*   



###### 第三章  使用函数  
*  18\.   理解函数调用、方法调用及构造函数调用之间的不同
	*  方法调用的接受者是当前对象。
	*  函数调用的接受者是全局对象。
	*  构造函数的调用
		* 它将一个全新的对象作为this变量的值，并隐式返回这个新对象作为调用结果。
		* 构造函数的主要职责是初始化该对象  



###### 第四章 对象和原型 
* 41\. 将原型视为实现细节 
	* 对象是接口，原型是实现 
	*

###### 第五章 
* 57\. 使用结构类型设计更为灵活的接口 
	* structural typing, duck typing  
		* 只要提供了consume需要的东西就可以，不必要求特定的类型。
		* suppose that client-side need a structed object or just a Object with some function or property ,if we choose the first one, we must ensure the smae type. for second,we just construct the functions and properties  user need. Obviously, the second one is more convience than first.     
