<template>
  <div id="home">
    <div class="wr-notice" :close="closeMenu">
      <div class="notice">
        在地图上点击你<b>所在的城市</b>，就可以查看<b>书香中国文化基金</b>在该城市公益捐赠用户的可读书单。
        <br />
        全部书籍可以<b>免费阅读</b>哦!
      </div>
      <i />
      <span />
      <div class="clickable" @click="closeMenu = !closeMenu"></div>
    </div>

    <!-- <div>
      <div>{{ d }}</div>
      <div>{{ x }}</div>
      <div>{{ y }}</div>
    </div> -->

    <div class="wr-logo">
      <img height="24" src="~@/assets/wechat-reading.png" />
      <hr />
      <img height="52" src="~@/assets/logo.png" />
    </div>

    <img class="wr-title" src="~@/assets/title.svg" />

    <div
      class="wr-map"
      ref="map"
      @touchmove="ontouchmove"
      @touchend="ontouchend"
    >
      <img
        src="~@/assets/map.svg"
        :style="{
          transform: `scale(${scale}) translate3d(${x / 10}%,${y / 10}%,0)`,
        }"
      />
    </div>

    <div class="wr-menu">
      <div class="city-list" @click="closeCities = false">
        <img width="16" src="~@/assets/list.svg" />
        <span>城市列表</span>
      </div>
    </div>

    <div class="wr-city" :close="closeCities">
      <div class="label">
        <p>已开通地区</p>
        <span @click="closeCities = true">收起</span>
      </div>

      <ul>
        <li v-for="(city, i) in cities" :key="i">
          <router-link to="/about" class="city">
            {{ city }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      closeMenu: false,
      closeCities: true,

      cities: ["吉首", "泸溪", "凤凰", "花垣", "保靖", "古丈", "永顺", "龙山"],

      raf: 0,
      x: 0,
      y: 0,
      d: 0,
      touch: null,
      innerScale: 1,
      scale: 1,
    };
  },
  mounted() {
    this.raf = requestAnimationFrame(this.update);
  },
  beforeDestroy() {
    cancelAnimationFrame(this.raf);
  },
  methods: {
    update() {
      this.scale += (this.innerScale - this.scale) * 0.2;
      this.raf = requestAnimationFrame(this.update);
    },
    ontouchmove(e) {
      e.preventDefault();

      if (this.touch) {
        this.x += e.touches[0].pageX - this.touch.x;
        this.y += e.touches[0].pageY - this.touch.y;
      }

      if (e.touches.length >= 2) {
        const d = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );

        if (this.d > 0) {
          const zoom = d / this.d;
          const scale = this.innerScale * zoom;
          this.innerScale = Math.max(0.8, Math.min(5, scale));
        }

        this.d = d;
      }

      this.touch = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
      };
    },
    ontouchend() {
      this.d = 0;
      this.touch = null;
    },
  },
};
</script>

<style lang="stylus">
#home
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

  height 100vh

  // display flex
  // flex-direction column
  // justify-content center

.wr-notice
  position relative
  padding-bottom 4px
  transition transform .3s
  overflow hidden
  box-sizing border-box
  .notice
    padding 24px 24px 36px
    background-image linear-gradient(to right, #7295e3, #6ec1ff)
    color #ffffff
  &:before, &:after
    content ''
    width 50%
    height 28px
    position absolute
    bottom -12px
    background-color #f5f6f8
  &:before
    left 0
    border-top-right-radius 100px 32px
  &:after
    right 0
    border-top-left-radius 100px 32px
  > i
    position absolute
    left 50%
    bottom 0
    transform translateX(-50%)
    background-color #70acf1
    width 46px
    height 16px
    z-index 1
    border-radius 0 0 50% 50% / 0 0 100% 100%
  > span
    position absolute
    bottom 4px
    left calc(50% - 5px)
    width 0
    height 0
    border-left 5px solid transparent
    border-right 5px solid transparent
    border-top 5px solid #ffffff
    z-index 2
    transition transform .3s
  .clickable
    position absolute
    bottom -4px
    left calc(50% - 32px)
    width 64px
    height 16px
    z-index 3
.wr-notice[close]
  transform translateY(calc(-100% + 12px))
  > span
    transform rotate(180deg)

.wr-logo
  margin 32px auto 32px
  width fit-content
  display flex
  align-items center
  gap 20px
  position relative
  z-index 1
  > hr
    margin 0
    height 52px
    width 1px
    border none
    background-color rgba(#000000, 0.1)

.wr-title
  margin 0 auto
  width 70%
  display block
  position relative
  z-index 1

.wr-map
  margin 18px 0 36px
  height 80vw
  > img
    display block
    margin auto
    width 96%
    will-change transform

.wr-menu
  position fixed
  left 0
  bottom 0
  padding 24px
  width 100%
  box-sizing border-box
  .city-list
    width 156px
    height 40px
    border-radius 20px
    background-color #ffffff
    display flex
    justify-content center
    align-items center
    gap 10px
    color #38a9ff
    font-weight 600
    cursor pointer

.wr-city
  position fixed
  z-index 10
  left 0
  bottom 0
  width 100%
  background-color #ffffff
  transition transform .3s
  .label
    height 60px
    padding 0 24px
    display flex
    justify-content center
    align-items center
    position relative
    > p
      margin 0
      font-size 18px
      font-weight 600
    > span
      color #38a9ff
      position absolute
      right 16px
  ul
    margin 0
    padding 28px 24px 48px
    list-style none
    background-color #f5f6f8
    display grid
    grid-template-columns repeat(4, 1fr)
    gap 12px
  li
    display flex
    justify-content center
  .city
    padding 0 16px
    height 36px
    line-height 36px
    color #464b59
    text-decoration none
    border-radius 18px
    &:active
      background-color #38a9ff
      color #ffffff
.wr-city[close]
  transform translateY(102%)
</style>
