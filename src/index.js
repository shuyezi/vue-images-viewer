/**
 * 图片查看器
 *
 * 支持缩放、移动查看图片，支持双击放大图片，支持多图轮播和单图缩放同时使用
 *
 * @param    {Array<Object> | Array<String>}   list        图片路径列表（绝对路径）
 * @returns  void
 *
 * @date    2017-06-05 00:59:00
 * @author  Jimmy<673950957@qq.com>
 *
 * @usage
 *      import ImagesViewer from '~components/ImagesViewer';
 *      export default {
 *          data() {
 *            return {
 *                imgs: [
 *                  {
 *                      url: 'http://i2.hdslb.com/bfs/archive/37e40edcbb017a7bf9375c9cdc10c36c0e3e86ca.jpg',
 *                      alt: '测试1'
 *                  },
 *                  ...
 *                ]
 *                // 只传递图片链接的话也支持下面这种格式
 *                // imgs: [
 *                //   'http://i2.hdslb.com/bfs/archive/37e40edcbb017a7bf9375c9cdc10c36c0e3e86ca.jpg',
 *                //   ...
 *                // ]
 *            }
 *          },
 *          components: {
 *              ImagesViewer
 *          }
 *      }
 *
 *      <ImagesViewer :list="imgs" />
 *
 */

/**
 * As the entry of this component
 */

export { default } from './components/main.vue';