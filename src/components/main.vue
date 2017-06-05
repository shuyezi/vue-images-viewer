<!-- Main of this component -->
<style>
    .iv-mask{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
    }
    .iv-container{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 10000;
    }
    .autoani{
        transition: all 0.25s ease;
    }
    .iv-items{
        list-style: none;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
    }
    .iv-items .iv-item-wrap{
        position: absolute;
        /*left: 0;*/
        top: 0;
        height: 100%;
        width: 100%;
    }
    .iv-items .iv-item-wrap.prev{
        left: -100%;
    }
    .iv-items .iv-item-wrap.current{
        left: 0;
    }
    .iv-items .iv-item-wrap.next{
        left: 100%;
    }
    .iv-items .iv-item-wrap:before{
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }
    .iv-items .iv-item-wrap .item{
        width: 100%;
        display: inline-block;
        vertical-align: middle;
    }
    .iv-items .iv-item-wrap .item>img{
        width: 100%;
        display: block;
    }
</style>
<template>
    <div>
        <div class="iv-mask"></div>
        <div class="iv-container">
            <div class="iv-items" :class="{'autoani': autoAni}" :style="{transform: `translateX(${imgsWrapTranslateX}px)`}">
                <div class="iv-item-wrap" :class="item.cls" v-for="(item, index) in imgs" v-if="imgs.length > 0" :style="{width: `${winWidth}px`}">
                    <v-touch class="item" :class="{'autoani': item.autoAni}" :ref="item.ref"
                             :style="{
                            transform: `scale(${item.scale}) translateY(${item.translateY}px)`,
                            transformOrigin: `${item.transformOriginX}px`
                        }"
                             @panstart="panStartHandle($event, item, index)"
                             @panmove="panMoveHandle($event, item, index)"
                             @panend="panEndHandle($event, item, index)"
                             @pinchstart="pinchStartHandle($event, item, index)"
                             @pinchmove="pinchMoveHandle($event, item, index)"
                             @pinchend="pinchEndHandle($event, item, index)"
                             @tap="doubleTapHandle($event, item, index)"
                    >
                        <img :src="item.url" :alt="item.alt" v-if="!!item.url" />
                    </v-touch>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueTouch from 'vue-touch';
    Vue.use(VueTouch, {name: 'v-touch'});

    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;

    export default {
        name: 'ImagesViewer',
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                winWidth,
                winHeight,
                autoAni: false, //开启全局动画
                imgsWrapTranslateX: 0,  //全局水平移动距离
                innerList: [],  //所有图片列表
                imgs: [],  //渲染中图片列表，每次只有3张，渲染结束之后修改列表数据
                currentImgIndex: 0,    //当前图片位置
                lastTime: 0,    //最新记录时间
                aniTarget: 1    //手指控制移动对象：1表示全部，3表示单个
            }
        },
        mounted() {
            this.innerList = this.list;
            let _first = Array.prototype.slice.call(this.innerList, 0, 1)[0];
            this.innerList.unshift(typeof _first == 'object' ? {} : '');

            this._imgsInit();
        },
        methods: {
            /**
             * 初始化轮播图数据
             * @private
             */
            _imgsInit() {
                let _imgs = Array.prototype.slice.call(this.innerList, this.currentImgIndex, this.currentImgIndex + 3);
                let _clsMap = {
                    0: 'prev',
                    1: 'current',
                    2: 'next'
                };

                let _newImgs = [];
                _imgs.map((item, index) => {
                    let _item = typeof item == 'object' ? item : {
                        url: item
                    };
                    _item.autoAni = false;
                    _item.scale = 1;
                    _item.lastScale = 1;
                    _item.transformOriginX = this.winWidth / 2;
                    _item.lastTransformOriginX = _item.transformOriginX;
                    _item.translateY = 0;
                    _item.lastTranslateY = 0;
                    _item.cls = _clsMap[index];
                    _item.ref = index == 1 ? 'target' : '';
                    _newImgs.push(_item);
                });

                this.imgs = _newImgs;
                this.imgsWrapTranslateX = 0;
                this.aniTarget = 1;
            },

            /**
             * @name 返回目标对象当前缩放之后的高度
             * @param 当前操作对象
             * @private
             */
            _getTargetHeight(target) {
                return this.winWidth / target.radio * target.lastScale;
            },

            /**
             * @name 移动开始响应事件
             * @param event
             * @param item
             * @param index
             */
            panStartHandle(event, item, index) {
                let _imgs = Array.prototype.slice.call(this.imgs);
                let target = _imgs[index];
                let targetHeight = this._getTargetHeight(target); // 缩放之后的高度

                if(target.lastScale > 1){
                    if((event.deltaX >= 0 && target.lastTransformOriginX == 0) || (event.deltaX < 0 && target.lastTransformOriginX == this.winWidth)){
                        this.aniTarget = 1;
                    }else{
                        this.aniTarget = 3;
                    }
                }else{
                    this.aniTarget = 1;
                }

                if(this.aniTarget == 3){
                    target.autoAni = false;
                    target.panAbleY = (targetHeight > this.winHeight) ? true : false;    //  纵轴方向移动的条件：垂直方向的尺寸大于容器尺寸
                    if(target.panAbleY) target.panYLimit = Math.abs((targetHeight - this.winHeight) / 2 / target.lastScale);
                    _imgs[index] = target;
                    this.imgs = _imgs;
                }else{
                    this.autoAni = false;
                }
            },

            /**
             * @name 移动中响应事件
             * @param event
             * @param item
             * @param index
             */
            panMoveHandle(event, item, index) {
                let _deltaX = event.deltaX;
                let _deltaY = event.deltaY;
                if(this.aniTarget == 3){
                    let _imgs = Array.prototype.slice.call(this.imgs);
                    let target = _imgs[index];
                    target.transformOriginX = target.lastTransformOriginX + (-_deltaX/target.lastScale);
                    if(target.panAbleY) target.translateY = target.lastTranslateY + _deltaY/target.lastScale;

                    _imgs[index] = target;
                    this.imgs = _imgs;
                }else{
                    this.imgsWrapTranslateX = _deltaX;
                }
            },

            /**
             * @name 移动结束响应事件
             * @param event
             * @param item
             * @param index
             */
            panEndHandle(event, item, index) {
                let _deltaX = event.deltaX;
                let _deltaY = event.deltaY;
                if(this.aniTarget == 3){
                    let _imgs = Array.prototype.slice.call(this.imgs);
                    let target = _imgs[index];

                    target.autoAni = true;
                    target.transformOriginX = target.lastTransformOriginX + (-_deltaX/target.lastScale);
                    if(target.panAbleY) target.translateY = target.lastTranslateY + _deltaY/target.lastScale;
                    if(_deltaX < 0){
                        // 往左拖
                        target.transformOriginX = Math.min(target.transformOriginX, this.winWidth);
                    }else{
                        // 往右拖
                        target.transformOriginX = Math.max(target.transformOriginX, 0);
                    }

                    if(_deltaY > 0){
                        // 向下拖
                        if(target.panAbleY) target.translateY = Math.min(target.panYLimit, target.translateY);
                    }else{
                        // 往上拖
                        if(target.panAbleY) target.translateY = Math.max(-target.panYLimit, target.translateY);
                    }
                    target.lastTransformOriginX = target.transformOriginX;
                    if(target.panAbleY) target.lastTranslateY = target.translateY;

                    _imgs[index] = target;
                    this.imgs = _imgs;
                }else{
                    this.autoAni = true;
                    if(
                        Math.abs(_deltaX) < this.winWidth/3 ||
                        (this.currentImgIndex + 2 > this.innerList.length - 1 &&  _deltaX <= 0) ||
                        (this.currentImgIndex < 1 &&  _deltaX > 0)
                    ){
                        this.imgsWrapTranslateX = 0;
                        return;
                    }

                    this.imgsWrapTranslateX = (_deltaX > 0 ? 1 : -1) * this.winWidth;

                    let _this = this;
                    setTimeout(function () {
                        _this.autoAni = false;
                        _this.currentImgIndex = _this.currentImgIndex + (_deltaX > 0 ? -1 : 1);
                        _this._imgsInit();
                    }, 150);
                }
            },

            /**
             * @name 缩放开始响应事件
             * @param event
             * @param item
             * @param index
             */
            pinchStartHandle(event, item, index) {
                let _imgs = Array.prototype.slice.call(this.imgs);
                let target = _imgs[index];
                target.autoAni = false;
                _imgs[index] = target;
                this.imgs = _imgs;
            },

            /**
             * @name 缩放中响应事件
             * @param event
             * @param item
             * @param index
             */
            pinchMoveHandle(event, item, index){
                let _scale = event.scale;
                let _imgs = Array.prototype.slice.call(this.imgs);
                let target = _imgs[index];
                target.scale = target.lastScale * _scale;

                _imgs[index] = target;
                this.imgs = _imgs;
            },

            /**
             * @name 缩放结束响应事件
             * @param event
             * @param item
             * @param index
             */
            pinchEndHandle(event, item, index) {
                let _imgs = Array.prototype.slice.call(this.imgs);
                let target = _imgs[index];
                let targetHeight = this._getTargetHeight(target);
                if(target.scale < 1){
                    target.autoAni = true;
                    target.scale = 1;
                    target.transformOriginX = this.winWidth / 2;
                    target.translateY = 0;
                    target.lastTranslateY = 0;
                }else{
                    if(targetHeight <= this.winHeight){
                        target.autoAni = true;
                        target.translateY = 0;
                        target.lastTranslateY = 0;
                    }
                }
                target.lastScale = target.scale;
                _imgs[index] = target;
                this.imgs = _imgs;
            },

            /**
             * @name 双击缩放响应事件
             * @desc 判断双击依据：两次点击事件时间间隔小于300ms
             * @param event
             * @param item
             * @param index
             */
            doubleTapHandle(event, item, index) {
                let _imgs = Array.prototype.slice.call(this.imgs);
                let target = _imgs[index];

                //图片的原始尺寸和宽高比
                let imgWidth = event.target.naturalWidth;
                let imgHeight = event.target.naturalHeight;
                let radio = imgWidth/imgHeight;

                target.transformOriginX = this.winWidth / 2;
                target.lastTransformOriginX = target.transformOriginX;
                target.radio = radio;

                let currentTime = new Date().getTime();
                if(currentTime - this.lastTime < 300){
                    target.autoAni = true;
                    target.scale = target.lastScale > 1 ? 1 : 3.5;
                    target.lastScale = target.scale;
                    _imgs[index] = target;
                    this.imgs = _imgs;
                }
                this.lastTime = currentTime;
            }
        }
    }
</script>