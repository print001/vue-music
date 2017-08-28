// 原始数据是什么，最底层的数据
import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1, // 当前的播放歌曲的索引
  disc: {},
  topList: {}
}
export default state
