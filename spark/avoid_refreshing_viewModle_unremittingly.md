######prevent double-way-binding from refreshing view-modle unremmittingly in angular  
---
look at the code first: 
```
 $watch('src',function(){
	f();
})  
function f() {
	setSrcToTarget();
}
``` 
if code write as above, src will set to target every time when it changes.
Is it a good way to implement our demands? of-course,not. In the coputer world,if things that has been done more than that should been done,then it's unneccery. 
This is a simple and nice way to do it.
``` 
$watch('src',function(){
	f();
})
function f() {
	if(hasRun(runAfter)) then cancel(runAfter) 
	else runAfter(setSrcToTarget());
}
```
