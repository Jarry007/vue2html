export class Img2Base{
    constructor(img){
        this.img  = img
    }

    createBase(){
        let img_ = new Image()
        img_.crossOrigin = ''

        img_.src = this.img
        return new Promise((resolve,reject)=>{
            img_.onload = ()=>{
                resolve(this.getImgData(img_))
            }

            img_.onerror = reject
        })
    }

    getImgData(img){
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.width = img.height
        const ctx = canvas.getContext('2d')
        const scale = canvas.width / canvas.height

        ctx.drawImage(img,0,0,canvas.width,canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg')
        return {dataUrl,scale}
    }
}