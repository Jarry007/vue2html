<template>
 <!-- <div @dragstart="dragStart"  draggable="true" :canHandler='canHandler'> -->
  <div class="drag-relative" @dragstart="dragStart"  draggable="true" :canHandler='canHandler'>
    <img v-if="isImg" class="item-img" :src="imgSrc" />

    <p
      :style="`font-size:${fontSize}px;padding: 0;width: 100%;margin: 0;`"
      v-else
    >
      {{ text }}
    </p>

    <p class="slot-text">
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: "Darg",
  props: {
    id: {
      type: String,
    },
    isImg: {
      type: Boolean,
      default: true,
    },
    imgSrc: {
      type: String,
    },
    fontSize: {
      type: Number,
      default: 16,
    },
    text: {
      type: String,
    },
       canHandler:{
       type:Boolean,
       default:false
    }
  },
  data(){
      return {timer:null}
  },
  methods:{
      dragStart(e) {
      // console.log('开始',e)
      e.dataTransfer.setData("Dom", this.id);
    },
  }
};
</script>

<style scoped>
.item-img{
    width: 100%;
    object-fit: cover;
    height: 100%;
    cursor: move;
}
</style>