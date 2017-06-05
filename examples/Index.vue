<template>
    <div id="container">
        <images-viewer :list="imgs" />
    </div>
</template>

<script>
    import ImagesViewer from '../src/index';

    export default {
        name: 'test',
        data() {
            return {
                imgs: [
                    'http://i2.hdslb.com/bfs/archive/37e40edcbb017a7bf9375c9cdc10c36c0e3e86ca.jpg',
                    'http://img.zcool.cn/community/01bf1655e514b16ac7251df840273f.jpg',
                    'http://www.bz55.com/uploads/allimg/140328/1-14032Q35627.jpg',
                    'http://img.kutoo8.com/upload/image/42369237/001%20(3)_960x540.jpg',
                    'http://file01.up71.com/File/CorpProductImages/2014/04/20/0_yiniujcdd_2514_20140420212740.jpg'
                ]
            }
        },
        components: {
            ImagesViewer
        }
    }
</script>