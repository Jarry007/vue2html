<template>
  <div class="app-container">
    <div class="lc" ref="sideBoard">
      <button class="add-btn">添加文字元素</button>

      <dragItem
        class="item"
        v-for="(item, index) in list"
        :id="item.id"
        :key="'drag' + index"
        :isImg="item.isImg"
        :imgSrc="item.imgSrc"
        :text="item.text"
      >
      </dragItem>
    </div>
    <div class="mc" ref="controlBoard"></div>
    <div class="rc"></div>
  </div>
</template>



<script>
import { Img2Base } from "@/utils/util";
import dragItem from "../components/dragItem";
export default {
  components: {
    dragItem,
  },
  data() {
    return {
      boardList: [],
      list: [],
      main: {
        w: 595,
        h: 842,
      },
    };
  },
  created() {
    this.initList();
  },
  mounted() {
    this.$nextTick(() => {
      this.initBoard();
    });
  },
  methods: {
    initBoard() {
      const board_ = this.$refs["controlBoard"];
      board_.ondragover = (e) => {
        e.preventDefault();
      };

      board_.ondrop = (e) => {
        const target_ = e.dataTransfer.getData("Dom");
        this.listRemove.call(null, target_);
      };
    },
    async listRemove(e) {
      const index = this.list.findIndex((item) => item.id === e);
      if (index < 0) return;
      const item = this.list.find(({ id }) => id === e);
      this.list.splice(index, 1);
      if (item.imgSrc && item.imgSrc.length < 300) {
        //为了判断是不是base64
        try {
          const res_ = await new Img2Base(item.imgSrc).creatBase(); //转化为base64
          item.imgSrc = res_.dataUrl;
          item.scale = res_.scale;
        } catch (error) {
            console.log(error)
        }

        item.top = 0;
        item.left = 0;
        item.width = 100;
        item.height = 100;

        this.boardList.push(item);
      }
    },
    initList() {
      for (let i = 0; i < 3; i++) {
        const data_ = {
          id: new Date().valueOf().toString(),
          imgSrc: `https://blogai.cn/static/swiper${i}.jpg`,
          isImg: true,
          text: `图片${i + 1}`,
          fontSize: 16,
        };
        this.list.push(data_);
      }
    },
  },
};
</script>


<style scoped>
.lc {
  width: 260px;
  padding: 0 16px;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
}

.lc .item {
  width: 100%;
  object-fit: cover;
  height: 20%;
  overflow: hidden;
  margin-bottom: 20px;
  background: #f3f6fb;
}
.lc::-webkit-scrollbar {
  width: 4px;
  height: 8px;
  background-color: #fefefe;
}

.mc{
  width: calc(100% - 540px - 40px);
  margin: 0 10px;
  background: #ccc;
  height: 100%;
  overflow: scroll;
}

.mc::-webkit-scrollbar {
  width: 4px;
  height: 8px;
  background-color: #fefefe;
}

.rc{
  width: 260px;
  padding: 0 16px;
  height: 100%;
  background: cornflowerblue;
}



.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
  /* background: #f4f4f4; */
}
.add-btn {
  width: 90%;
  margin: 10px 5%;
  height: 60px;
  background: cornflowerblue;
  color: #fff;
  line-height: 60px;
}
</style>