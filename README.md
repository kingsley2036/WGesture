# WGesture
使用原生JavaScript实现的一套移动端手势库，支持 tap、swipe、doubletap、longtap手势,后续会添加缩放和旋转手势.
### 使用方法
```
import WGesture from 'WGesture.js'
```

### 添加手势
```
WGesture.on(type,selectors,handler)
```
- type为手势类型:包含tap、swipe、doubletap、longtap手势

- selectors为选择器
- handler为手势添加的回调函数
- 添加手势时会返回相应的实例,存放在一个数组里,因而返回值类型为数组

#### 示例
```
  WGesture.on("doubleTap", ".touch", function () {
      console.log("doubleTap");
  });
```
### 移除手势监听
WGesture.off(newGestures,type, handler)
- newGestures:为添加手势时返回的实例
- type为手势类型:包含tap、swipe、doubletap、longtap手势
- handler为手势添加的回调函数
- 使用方法类似于`clearTimeout`,需要把添加手势时生成的实例传给`off`方法
#### 示例 
```
  let longTapcb=function () {console.log("longTap")}
  let newGestures=WGesture.on("longTap",".test",longTapcb );
  WGesture.off(newGestures,"longTap",longTapcb)
```
