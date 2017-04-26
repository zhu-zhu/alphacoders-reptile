/**
 * Created by dyj on 2017/4/15.
 */
const request = require('request');
const fs = require('fs');
const progress = require('request-progress')



/*
* 获取每一页的图片数量并下载
* @param    msg   int   页数
* @param    Keywords   String   搜索关键词
* */

const getimg = async (msg,Keywords) => {
    try{
        const Paging = 'https://wall.alphacoders.com/search.php?search='+Keywords+'&page=';
        const getsome = await merge(msg,Paging);
        const orimg = await reqimg(getsome);
        downloadmap(orimg);
    }catch (e){
        throw e;
    }
};

/**
 *  程序开始
 * @param    getmag   String   搜索关键词
 */

const start = async (getmag) =>{
    try{
        console.log('关键词 '+getmag);
        const url = 'https://wall.alphacoders.com/search.php?search='+getmag;
        console.log('爬取的url --> '+url);

        const str = await getpage(url);
        var d = new RegExp(`search\\.php\\?search=${getmag.replace(/ /g, "\\+").toLowerCase()}&amp;page=\\d{0,}`,"g");
        const n = str.match(d).join('').match(/\d+/g);

        console.log('一共有 '+n.max()+' 页');
        console.log('开始获取图片数量');

        getimg(n.max(),getmag)
    }catch (e){
        throw e
    }
};

/*
* 获得页面的内容
* @param msg string 页面url
* @return string 内容
* */

getpage = (msg) =>{
    return new Promise((s, j) => {
        request.get(msg, (err, res, body) => {
            if(err)
                j(err);
            else {
                if(res.statusCode == 200){
                    s(body)
                }else {
                    j(new Error(`url -> ${url}  statusCode = ${res.statusCode}`))
                }
            }
        })
    })
};

merge = (page,Paging) =>{
    try {
        const arr = [];
        Array.from({ length: page }).map((i,j)=>{
            arr.push( Paging + (j+1) );
        });
        return arr;
    }catch(e){
        throw e;
    }
};

/*
* 返回图片数量
*
* @param msg object  页码
* @return 所有大图
* */

const reqimg = async (msg) =>{
    try {
        const imgarr = [];
        var c = '';
        for(var i = 0 ; i < msg.length; i ++){
            var getp = await getpage(msg[i]);
            var date = getp.match(/https:\/\/images(\d{0,}|)\.alphacoders\.com\/\d{0,}\/thumb-\d{0,}-\d{0,}\.(png|jpg)/g);
            var di = await Integimg (date);
            Array.prototype.push.apply(imgarr, di);
            console.log('第 '+(i+1)+' 页有 '+date.length+' 张');
        }
        return imgarr;
    }catch(e){
        throw e;
    }
};


/*
* 将压缩图整合为原图
* @param msg object 小图url
* @return 大图
* */

const Integimg = async (msg) =>{
    const d = msg.join('-');
    const str = d.replace(new RegExp(/thumb-350-/g), "");
    return str.split('-')
};

/*
 * 循环图片数组
 * @param mobj object 所有图片
 *
 * */

downloadmap =async (mobj) =>{
    mobj.map(async (i,j)=>{
        var firlname = i.replace(/https:\/\/images(\d{0,})\.alphacoders\.com\/\d{0,}\/(\d{0,}\.(png|jpg))/, "$2")
        console.log('正在爬去第 '+j+' 张');
        var fg = await downloadimg(i,firlname);
    })
    console.log('下载完成');
};

/*
 * 下载图片
 * @param imageUrl string 图片url
 * @param outDir string 图片名称
 * */

var downloadimg = function(imageUrl, firlname){
    try{
        request(imageUrl).pipe(fs.createWriteStream('download/'+ firlname));
    }catch (e){

    }
};

Array.prototype.max = function(){
    return Math.max.apply({},this)
};

start('Eromanga-sensei');
