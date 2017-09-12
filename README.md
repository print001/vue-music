# vue-music

> vue-music

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
VUE --
watch 数据：
  watch:{
  name(){
     }
  }
   name 是要watch的对象，name()是回调函数 当name有改变时调用回调函数name(newval,oldval)中可以传入新旧参数
    在实例化时会调用watch
    computed属性只要关联的数据发生改变就会更新，watch属性只能观察一个数据的变化

