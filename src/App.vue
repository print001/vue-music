<template>
  <div id="app">
     <m-header></m-header>
     <tab></tab>
    <keep-alive>
      <router-view class="routerView"></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header.vue'
  import Tab from 'components/tab/tab.vue'
  import Player from 'components/player/player.vue'
  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
 @import "common/stylus/variable.styl"

   #app
     color:$color-theme
     .routerView
       color $color-text
</style>
