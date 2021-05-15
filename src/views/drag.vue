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
    <div class="mc" ref="controlBoard">
      <div
        class="main"
        ref="mainContainer"
        :style="`width:${main.w}px;height:${main.h}px;overflow:hidden`"
      >
        <p v-if="!boardList.length" class="tips-text" style="display: none">
          拖动左侧元素到此区域进行布局调整
        </p>
        <VueDrag
          class="vivify popIn"
          :class="item.id === showSettingId ? 'cursor-move' : ''"
          style="position: absolute"
          v-for="item in boardList"
          :key="item.id"
          :w="main.w"
          :h="main.w / item.scale"
          :parentLimitation="true"
          :isActive="showSettingId === item.id"
          v-on:resizing="resizeDrag"
          v-on:dragging="resizeDrag"
          :preventActiveBehavior="true"
          ><dragItem
            :text="item.text"
            style="width: 100%; height: 100%"
            :isImg="item.isImg"
            :imgSrc="item.imgSrc"
            :fontSize="item.fontSize || 16"
            canHandler
            @click.native.stop="showSetting(item)"
          >
            <!-- <div
              v-if="item.id === showSettingId"
              class="drag-close"
              @click="removeDrag(index)"
            >
              <i class="el-icon-delete"></i>
            </div>  -->
            </dragItem
        ></VueDrag>
      </div>
    </div>
    <div class="rc">
      <div class="foot">
        <el-button
          size="small"
          type="danger"
          @click="printContainerList"
        >生成文档</el-button>
        <el-button size="small" type="danger" @click="pdfContainerList"
          >生成PDF</el-button
        >
        <el-button size="small" type="danger" @click="wordContainerList2"
          >生成word2</el-button
        >
      </div>

      <h3>操作区宽高</h3>
      <div style="text-align: center">
        宽<el-input-number
          v-model="main.w"
          controls-position="right"
          :min="596"
          :max="2000"
          size="mini"
          class="line"
        ></el-input-number
        >px
      </div>
      <div style="text-align: center; border-bottom: 1px solid #ddd">
        高<el-input-number
          v-model="main.h"
          controls-position="right"
          :min="100"
          :max="2000"
          size="mini"
          class="line"
        ></el-input-number
        >px
      </div>

      <template v-if="showSettingId">
        <h3><i class="el-icon-c-scale-to-original"></i> 元素调整</h3>
        <div style="text-align: center">
          字体大小<el-input-number
            v-model="editBlock.fontSize"
            controls-position="right"
            @change="handleChange"
            size="mini"
            class="line"
            :min="1"
            :max="60"
          ></el-input-number
          >px
        </div>
        <div style="text-align: center; margin-bottom: 20px">
          内容<el-input
            v-model="editBlock.text"
            style="width: 70%"
            size="mini"
            class="line"
          ></el-input>
        </div>

        <el-button type="primary" @click="removeDrag(editBlock, true)">
          移出
          <template #animate> <i class="el-icon-back"></i> </template
        ></el-button>
      </template>
    </div>
  </div>
</template>



<script>
import html2canvas from 'html2canvas'
import { saveAs } from "file-saver";
import { Img2Base } from "@/utils/util";
import dragItem from "../components/dragItem";
import VueDrag from "vue-drag-resize";
import jsPDF from 'jspdf'
export default {
  components: {
    dragItem,
    VueDrag,
  },
  data() {
    return {
      boardList: [],
      list: [],
      editBlock: {},
      showSettingId: "",
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
    printContainerList(){
      console.log('大苏打')
      const loading = this.$loading({
        lock:true,
        text:'文件生成中..'
      })
      const html_ = new Blob([this.renderHtml()], { type: "text/html;charset=utf-8" }) 
      saveAs(html_,'报告文档.html') 
      loading.close()
    },
    pdfContainerList(){
      const loading = this.$loading({
        lock:true,
        text:'文件生成中..'
      })

      const dom = this.$refs.mainContainer
      html2canvas(dom).then(res=>{
        const contenWidth = res.width
        const contentHeight = res.height
        
        let position = 0;
    
        const pageSizeW = 595.28
        const pageSizeH = 841.89

        const pageH = (pageSizeW / contenWidth) * contentHeight 

        let pageHeight = pageH
        const pageData = res.toDataURL('image/jpeg')

        loading.close()

        const PDF = new jsPDF('','pt','a4')

        if(pageH < pageSizeH) {
          PDF.addImage(pageData,'JPEG',0,0,pageSizeW,pageH)
        }else{
          while(pageHeight > 0 ){
            PDF.addImage(pageData,"JPEG",0,position,pageSizeW,pageH)

            pageHeight -= pageSizeH
            position -= pageSizeH

            if(pageHeight > 0){
              PDF.addPage()
            }
          }
        }


        PDF.save('报告.pdf')
      })

      // loading.close()
    },
    wordContainerList2(){

    },
    renderHtml(){
      const dom = this.$refs.mainContainer.innerHTML;
      const tempalte_ = `
      <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1.0">
                    <title>报告文档</title>
                </head>
                <body>
                    <div style="width:${this.main.w}px;height:${this.main.h}px;position: relative;background:#f3f6fb">
                    ${dom}
                    </div>
                </body>
                </html>
      `;
      return tempalte_
    },
    removeDrag(data_, id = false) {
      if (id) {
        const item = this.boardList.find((item) => item.id === data_.id);
        const index = this.boardList.findIndex(({ id }) => id === data_.id);
        this.boardList.splice(index, 1);
        this.list.push(item);
        this.clickContainer();
      } else {
        const item = this.boardList[data_];
        this.boardList.splice(data_, 1);
        this.list.push(item);
        this.clickContainer();
      }
    },
    // 取消图片的编辑状态
    clickContainer() {
      this.showSettingId = "";
    },
    showSetting(e) {
      this.showSettingId = e.id;
      this.editBlock = e;
    },
    initBoard() {
      const board_ = this.$refs["controlBoard"];
      board_.ondragover = (e) => {
        e.preventDefault();
      };

      board_.ondrop = (e) => {
        // console.log('e',e)
        const target_ = e.dataTransfer.getData("Dom");
        console.log(target_);
        this.listRemove.call(null, target_);
      };
    },
    async listRemove(e) {
      console.log("call", e);
      const index = this.list.findIndex((item) => item.id === e);
      if (index < 0) return;
      const item = this.list.find(({ id }) => id === e);
      this.list.splice(index, 1);
      if (item.imgSrc && item.imgSrc.length < 300) {
        //为了判断是不是base64
        try {
          const res_ = await new Img2Base(item.imgSrc).createBase(); //转化为base64
          item.imgSrc = res_.dataUrl;
          item.scale = res_.scale;
        } catch (error) {
          console.log(error);
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
          imgSrc: `https://blogai.cn/swiper${i}.jpg`,
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

.mc {
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

.rc {
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
.main {
  margin: 0 auto;
  background: #f4f4f4;
  position: relative;
}
.main .tips-text {
  display: block !important;
  position: absolute;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  left: 50%;
  font-size: 20px;
  font-weight: 600;
  color: #b5c4d8;
}

/* 
保留所有权利
拖拽编辑 

 */
</style>