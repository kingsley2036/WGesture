class Gesture {
    
    constructor(node) {
        this.node = node;
        this.handlers = {
            tap: [],
            doubleTap: [],
            swipe: [],
            longTap: [],
            touchstart: [],
            touchmove: [],
            touchend: [],
        };

        this.delta = null;
        this.interval=null;
        this.lastTime = null;
        this.now = null;
        this.tapTimeout = null;
        this.prePosition = { x: null, y: null };
        this.x1 = this.x2 = this.y1 = this.y2 = null;
        this.isDoubleTap = false;
        this.isRemove=false;
        this.bind();
          
    }
    
    //绑定原生事件
    bind() {
        let that=this
        
        this.node.addEventListener(
            "touchstart",
            this.ontouchstartFn.bind(this)
           ,
            { passive: true }
        );
        this.node.addEventListener(
            "touchmove",
            (evt) => {
               
                this.dispatch("touchmove", evt);
                this.x2 = evt.touches[0].pageX;
                this.y2 = evt.touches[0].pageY;
                
            },
            { passive: true }
        );
        this.node.addEventListener(
            "touchend",
            (evt) => {
              
                this.dispatch("touchend", evt);
                this.interval=Date.now()-this.now;
                console.log([this.x1,this.y1],[this.x2,this.y2])
                if(this.interval> 1000 && (!this.x2 || Math.abs(this.x1 - this.x2) < 30)&&( !this.y2|| Math.abs(this.y1 - this.y2) < 30)){
                    this.dispatch("longTap", evt);
                    this.clearMoveInfo();
                    return;
                }
                if (
                    (this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
                    (this.y2 && Math.abs(this.y1 - this.y2) > 30)
                ) {
                    let direction = this._swipeDirection(
                        this.x1,
                        this.x2,
                        this.y1,
                        this.y2
                    );
                    evt.direction = direction;
                    this.dispatch("swipe", evt);
                        this.clearMoveInfo();
                    return;
                }

                if (!this.isDoubleTap) {
                    this.tapTimeout = setTimeout(() => {
                        this.dispatch("tap", evt);
                    }, 300);
                }
                if (this.isDoubleTap) {
                    this.dispatch("doubleTap", evt);
                    this.isDoubleTap = false; //重置状态
                    this.prePosition = { x: null, y: null };
                    this.lastTime = null;
                }
            },
            { passive: true }
        );
        
       
    }
    //判定swipe方向
    _swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
            ? x1 - x2 > 0
                ? "Left"
                : "Right"
            : y1 - y2 > 0
                ? "Up"
                : "Down";
    }
    clearMoveInfo(){
        this.x2=this.y2=null;
    }
     
    //touchstart监听函数
    ontouchstartFn(evt){ 
        this.dispatch("touchstart", evt);
        this.now = Date.now();
        this.x1 = evt.touches[0].pageX;
        this.y1 = evt.touches[0].pageY;
        this.delta = this.lastTime ? this.now - this.lastTime : 0;
        if (this.prePosition.x !== null && this.prePosition.y !== null) {
            this.isDoubleTap =
                this.delta > 0 &&
                this.delta <= 300 &&
                Math.abs(this.x1 - this.prePosition.x) < 30 &&
                Math.abs(this.y1 - this.prePosition.y) < 30;
            if (this.isDoubleTap) {
                clearTimeout(this.tapTimeout);
            }
        }
        this.lastTime = this.now;
        this.prePosition = { x: this.x1, y: this.y1 };
      
    }
    //是事件监听,向对应事件添加回调函数
    on(eventType, handler) {
        this.handlers[eventType].push(handler);
        console.log("on");
    }
    off(eventType, handler) {
        if (
            this.handlers[eventType] &&
            this.handlers[eventType].indexOf(handler) !== -1
        ) {
            this.handlers[eventType].splice(
                this.handlers[eventType].indexOf(handler),
                1
            );
          
          
        }
    }
    remove(){
        this.node.removeEventListener('touchstart', this.ontouchstartFn);
        this.isRemove=true;
        console.log('remove')
       
    }
    //分发事件,执行对应事件里面的回调函数
    dispatch(eventType, evt) {
        this.handlers[eventType].forEach((handler) => {
            handler.call(this.node, evt);
        });
    }
}


export default WGesture;



