# vue-images-viewer

[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](#license)
[![npm:](https://img.shields.io/badge/npm-v4.0.5-green.svg?style=flat-square)](#npm)

vue-images-viewer is a component for vue that can display any images, supporting moving as well as scaling every image.

`key words: swipe images / scale images / move images / vue component`

## installation

The component requires vue >= 2.0 and vue-touch@next

## npm
    npm install --save vue-images-viewer
    
## usage
You can do like this

    <script>
        import ImagesViewer from 'vue-images-viewer';
        export default {
            name: 'ImgsViewer',
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
            },
            methods: {
                closeViewerHandle() {
                    //do some close action here
                }
            }
        }
    </script>
    
    <template>
        <div id="container">
            <ImagesViewer :list="imgs" :close="closeViewerHandle" />
        </div>
    </template>
    
    
    
