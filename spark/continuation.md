######concerning continuation and cps 
* function without continuation  
``` 
	function factorial(n) {
		return n==1? 1 : n*factorial(n-1) 
	}
```
* with continuation 
``` 
function factorial(n) {
	function f(n,acc) {
		if(n==1){
			return acc;
		} else {
		f(n-1,acc*n);
		}
	}
	return factorial(n,1);	
}
``` 
continuation is passing to the next function recursion call,to calculate the result immediately when it arrive at the export of recursion.it runs without backtracking,it is faster than the traditional recursion 

