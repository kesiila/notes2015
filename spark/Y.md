######Conerning  Y
* derivation
	* predicate:
	* let Y = lambda y. ( (lambda x. y (x x))
												(lambda x. y (x x)))
	* Y Y
	* base on define,expand first Y
	* ( lambda y. ( (lambda x. y (x x)) (lambda x. y (x x))) ) Y
	* BETA
	* (lambda x. Y(x x)) (lambda x. Y(x x))
	* Alpha[x/z]
	* (lambda x. Y(x x)) (lambda z. Y(z z))
	* BETA
	* Y ( (lambda z. Y(z z)) (lambda z. Y(z z)))
	* expand first Y Alpha[x/a][y/b]
	* (lambda b. ( (lambda a. b(a a))
								(lambda a. b(a a)) ) ) ( (lambda z. Y(z z)) (lambda z. Y(z z)))
	* BETA
	*  (lambda a. ( (lambda z. Y(z z)) (lambda z. Y(z z)) ) ( a a))
			(lambda a. ( (lambda z. Y(z z)) (lambda z. Y(z z) ) (a a)))
	* base on  Y Y = (lambda x. Y(x x)) (lambda x. Y(x x)),Alpah[a/x]
	* ( lambda x. (Y Y)(x x) ) (lambda x. (Y Y)(x x))
	* base on Y = lambda y. ( (lambda x. y(x x)) (lambda x. y(x x)))
	* (lambda y. ( (lambda x. y(x x)) (lambda x. y(x x)))) (Y Y)
	* Y (Y Y)
	* Y Y = Y (Y Y)
* derivation2: Y F = F (Y F)
	* Y F = ( lambda y. ( (lambda x. y(x x)) (lambda x. y(x x))) ) F
	* = (lambda x. F(x x)) (lambda x. F(x x))
	* = F( (lambda x. F(x x)) (lambda x. F(x x)) )
	* = F (Y F)
* eg base on javscript
	* begin at factorial
	 ```
		function fact1 (n) {
			return n==1? 1 : n*fact1(n-1)
		}
		```
	* suppose no closure supported on our call,which means we can't ref the property out of brace pair ,we can pass self as params
	```
		function fact2(self,n){
			return n==1? 1: n*self(self,n-1)
		}
	```
	* change the form to  fact1
 	```
		function fact3(self){
		return function(n) {
			return n==1? 1: n* self(self)(n-1)
		}
	}
	```
	* abstract the component about factorial and ref-self
	```
    function fact5 (self) {
			return function(n) {
				var f = function(q){
					retrun function (n) {
						return n==1? 1:n*q(n-1)
					}
				}
				return f(self(self))(n)
			}
		}
	```
	* function f can be out of fast5
	```
		function f(q) {
			return function (n) {
				return n==1? 1: n*q(n-1)
			}
		}
		function fact5(self) {
			return function(n){
				return f(self(self))(n)
			}
		}
	```
	* now we can find the new func f is just the parameterized factrial function -- the recursion has been the parameter q. for more,we can abstract the func f in further.then Y comes out:
	```
		function Y(f) {
			var g = function(self){
				return function(x) {
						return f(self(self))(x)
				}
			}
			return g(g);
		}
	```
	* finally,we construct the fact by using Y
	```
  	fact_final = Y (
			function(self){
				return function(n) {
					if (n ==1) return 1;
					return n* self(n-1);
			}
			}	)
	```

