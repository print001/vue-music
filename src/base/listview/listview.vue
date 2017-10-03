<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll"
          :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img :src="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :data-index="index"
            :class="{current:currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18
  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
      this.listHeight = []
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    watch: {
      data() { // data指的是props的data,当data改变，重新计算listHeight
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) { // 当scrollY改变时，更新diff 和currentindex
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0 // index表示字母排序
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY // 和下一个list-group的距离
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) { // 检测到diff 改变时，更新fixed的位置
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0 // fixedtop 表示listfixed需要上移的距离
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)` // 负数
      }
    },
    components: {
      Scroll,
      Loading
    },
    computed: { // compute属性 关联data
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substring(0, 1)
        })
      },
      fixedTitle() { // 关联scrollY
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '' // fixed中要显示的index
      }
    },
    methods: {
      selectItem(item) { // 触发当前实例上的事件。附加参数都会传给监听器回调。 发送到父组件singer
        this.$emit('select', item) // item表示click选中的歌手的信息 触发父组件singer的select事件
      },
      onShortcutTouchStart(e) { // 实现点击index栏跳转
        let anchorIndex = getData(e.target, 'index') // e.target 表示事件发生时的目标对象
        let firstTouch = e.touches[0] // es6的特性
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) { // 实现跟随滑动
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 移动了几个index 向下取整
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta // 基准
        this._scrollTo(anchorIndex)
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2  // 为什么-2 在如果-1的话就会转移到最末端
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // 0表示动画时间
      },
      scroll(pos) { // 绑定scroll事件 应该是BSCROLL中定义的事件
        this.scrollY = pos.y
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      _calculateHeight() { // 计算每个字母单元的高度存入listHeight
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight // clientHeight表示padding加上content
          this.listHeight.push(height)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable.styl'

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px //这里有问题
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
