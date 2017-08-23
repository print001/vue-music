// 改变state的方法
import * as types from './mutation-types'
const mutations = {
  [types.SET_SINGER](state, singer) { // 改变需要共用的数据
    state.singer = singer
  }
}
export default mutations
