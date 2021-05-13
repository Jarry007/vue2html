<template>
  <div class="drag-relative">
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
  },
  data(){
      return {timer:null}
  },
  methods:{
      
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