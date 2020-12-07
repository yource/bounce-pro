// nobounce.js
function NoBounce() {
    var ua = window.navigator.userAgent.toLowerCase();
    this.position = {
        x: 0,
        y: 0
    }
    this.newPosition = {
        x: 0,
        y: 0
    }
    this.startPoint = {
        x: 0,
        y: 0
    }
    this.distance = {
        x: 0,
        y: 0
    }
    this.spaceLimit = {
        x: 0,
        y: 0
    }
    this.canMove = false;
    this.touchStart = null;
    this.touchMove = null;
    this.touchEnd = null;
    this.isVerticalMove = false;
    this.isHorizontalMove = false;
    this.parentDom = null;
    this.childDom = null;
    this.isIOS = ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1;
    this.onlyIOS = false;
    this.timer = false;

    this.init = function(childDom, onlyIOS) {
    	this.childDom = childDom;
    	this.parentDom = childDom.parentNode;
    	this.onlyIOS = !!(onlyIOS === true);
        this.spaceLimit = {
            x: this.childDom.clientWidth - this.parentDom.clientWidth,
            y: this.childDom.clientHeight - this.parentDom.clientHeight
        }
        if ((this.spaceLimit.x > 0 || this.spaceLimit.y > 0) && (!this.onlyIOS || this.onlyIOS && this.isIOS)) {
            this.canMove = true;
            this.parentDom.style.overflow = "hidden";
            this.childDom.style.transition = "transform 0.05s linear";
            var that = this;
            // touchstart事件，记录起始点
            this.touchStart = function(e) {
                e.stopPropagation();
                that.startPoint = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                }
            }

            // touchmove事件，实时计算子元素该移动的位置
            this.touchMove = function(e) {
                // 计算手指移动的距离
                that.distance = {
                    x: e.touches[0].clientX - that.startPoint.x,
                    y: e.touches[0].clientY - that.startPoint.y
                }

                // 根据手机移动判断是垂直滚动还是水平滚动
                if (that.isVerticalMove || Math.abs(that.distance.y) > Math.abs(that.distance.x)) {
                    that.isVerticalMove = true;
                    that.isHorizontalMove = false;
                }
                if (that.isHorizontalMove || Math.abs(that.distance.x) > Math.abs(that.distance.y)) {
                    that.isVerticalMove = false;
                    that.isHorizontalMove = true;
                }
                // 如果滚动到边际，则不再更新子元素的定位，也不阻止事件传递
                if (
                    (that.isVerticalMove && (
                        that.spaceLimit.y === 0 || (
                            (that.distance.y > 0 && that.position.y === 0) || (that.distance.y < 0 && that.position.y === 0 - that.spaceLimit.y)
                        )
                    )) || (that.isHorizontalMove && (
                        that.spaceLimit.x === 0 || (
                            (that.distance.x > 0 && that.position.x === 0) || (that.distance.x < 0 && that.position.x === 0 - that.spaceLimit.x)
                        )
                    ))
                ) {
                    return;
                }
                // 阻止事件传递
                e.stopPropagation();
                e.preventDefault();

                if (that.timer) {
                    return;
                } else {
                    that.timer = window.setTimeout(function(){
                        that.timer = false;
                        // 根据手机移动的距离，以及子元素初始位置，计算子元素的新位置
                        that.newPosition = {
                            x: that.position.x + that.distance.x,
                            y: that.position.y + that.distance.y
                        }
                        if (that.newPosition.x > 0) {
                            that.newPosition.x = 0
                        } else if (that.newPosition.x < 0 - that.spaceLimit.x) {
                            that.newPosition.x = 0 - that.spaceLimit.x
                        }
                        if (that.newPosition.y > 0) {
                            that.newPosition.y = 0
                        } else if (that.newPosition.y < 0 - that.spaceLimit.y) {
                            that.newPosition.y = 0 - that.spaceLimit.y
                        }
                        // 更新子元素位置
                        that.childDom.style.transform = 'translate3d(' + that.newPosition.x + 'px,' + that.newPosition.y + 'px,' + '0)';
                    }, 50)
                }
            }

            // touchend事件，清空标记
            this.touchEnd = function(e) {
                that.isVerticalMove = false;
                that.isHorizontalMove = false;
                that.position = that.newPosition; // 将最后移动的位置记录下来
            }
            this.childDom.addEventListener('touchstart', this.touchStart);
            this.childDom.addEventListener('touchmove', this.touchMove);
            this.childDom.addEventListener('touchend', this.touchEnd);
        }
        return this;
    };
    this.remove = function() {
        if (this.canMove) {
            this.childDom.removeEventListener('touchstart', this.touchStart);
            this.childDom.removeEventListener('touchmove', this.touchMove);
            this.childDom.removeEventListener('touchend', this.touchEnd);
        }
    	delete this.touchStart;
    	delete this.touchMove;
    	delete this.touchEnd;
    	delete this.parentDom;
    	delete this.childDom;
    };
}

