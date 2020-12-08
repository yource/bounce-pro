function BounceHandler() {
	var ua = window.navigator.userAgent.toLowerCase();
	this.scroll = {
		left: 0,
		top: 0
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
	this.limit = 50;
	this.resetLeft = false;
	this.resetTop = false;
	this.stopEvent = false;
	this.notStopPropagation = false;

	this.init = function(childDom, parentDom) {
		this.childDom = childDom;
		this.parentDom = parentDom || childDom.parentNode;
		this.spaceLimit = {
			x: this.childDom.clientWidth - this.parentDom.clientWidth,
			y: this.childDom.clientHeight - this.parentDom.clientHeight
		}

		if (this.spaceLimit.x > 0 || this.spaceLimit.y > 0) {
			this.parentDom.style.scrollBehavior = "smooth";
			this.canMove = true;
			var that = this;

			this.touchStart = function(e) {
				that.startPoint = {
					x: e.touches[0].clientX,
					y: e.touches[0].clientY
				}
				that.scroll = {
					left: that.parentDom.scrollLeft,
					top: that.parentDom.scrollTop
				}
				that.childDom.style.transition = "";
			}

			this.touchMove = function(e) {
				e.preventDefault();
				that.distance = {
					x: e.touches[0].clientX - that.startPoint.x,
					y: e.touches[0].clientY - that.startPoint.y
				}
				if(!that.isVerticalMove && !that.isHorizontalMove){
					if (Math.abs(that.distance.y) > Math.abs(that.distance.x)) {
						that.isVerticalMove = true;
					}else{
						that.isHorizontalMove = true;
					}
				}
				var scrollStep = {};
				scrollStep.top = that.scroll.top - that.distance.y;
				scrollStep.left = that.scroll.left - that.distance.x;
				
				if(that.isVerticalMove){
					if (scrollStep.top <= 0) {
						scrollStep.top = 0;
					} else if (scrollStep.top >= that.spaceLimit.y) {
						scrollStep.top = that.spaceLimit.y
					}else{
						e.stopPropagation();
					}
					that.parentDom.scrollTop = scrollStep.top;
				}
				if(that.isHorizontalMove){
					if (scrollStep.left <= 0) {
						that.resetLeft = scrollStep.left*0.3;
						if(that.resetLeft < 0-that.limit){
							that.resetLeft = 0-that.limit;
							that.notStopPropagation = true;
						}
						scrollStep.left = 0;
					} else if (scrollStep.left >= that.spaceLimit.x) {
						that.resetLeft = (scrollStep.left - that.spaceLimit.x)*0.2;
						if(that.resetLeft > that.limit*0.75){
							that.resetLeft = that.limit*0.75;
							that.notStopPropagation = true;
						}
						scrollStep.left = that.spaceLimit.x;
					}
					if(!that.notStopPropagation){
						e.stopPropagation();
					}else{
						e.returnValue = true;
					}
					that.parentDom.scrollLeft = scrollStep.left;
					if(that.resetLeft){
						that.childDom.style.transform = "translate3d("+(0-that.resetLeft)+"px,0px,0px)"
					}
				}
			}

			this.touchEnd = function(e) {
				if(that.resetLeft){
					that.childDom.style.transition = "transform 0.2s";
					that.childDom.style.transform = "translate3d(0px,0px,0px)"
				}
				that.isVerticalMove = false;
				that.isHorizontalMove = false;
				that.resetLeft = false;
				that.resetTop = false;
				that.stopEvent = false;
				that.notStopPropagation = false;
			}
			this.childDom.addEventListener('touchstart', this.touchStart, true);
			this.childDom.addEventListener('touchmove', this.touchMove, true);
			this.childDom.addEventListener('touchend', this.touchEnd, true);
		}
		return this;
	};

	this.destory = function() {
		try {
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
		} catch (e) {}
	};
}

export {
	BounceHandler
}
