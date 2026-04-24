const {Telegraf,Input} = require("telegraf")
const { message } = require('telegraf/filters')
const quranFile = require("./assets/quran.json") 
const links = require("./assets/imgLinks.json")
const audios = require("./assets/audios.json")
const chat_id = require("./assets/chat_id.json")
require('dotenv').config()
const path = require("path")
const fs = require("fs")
const {quranSurahs} = require("./quran")
const { buffer } = require("stream/consumers")
const newBot  = new Telegraf(process.env.BOT_TOKEN)
const date = new Date(Date.now())
let Day= date.getDate()<10?`0${date.getDate()}`:date.getDate()
let month= date.getMonth()+1<10?`0${date.getMonth()+1}`:date.getMonth()+1
let year= date.getFullYear()
let fullgregorYear = `${Day}-${month}-${year}`
setInterval(() => {
Day= date.getDate()<10?`0${date.getDate()}`:date.getDate()
month= date.getMonth()+1<10?`0${date.getMonth()+1}`:date.getMonth()+1
year= date.getFullYear()
fullgregorYear = `${Day}-${month}-${year}`
}, 1000);
newBot.command("start",(ctx)=>{
ctx.reply(`
السلام عليكم و رحمة الله و بركاته
\n
بوت انا مسلم من اعداد ابو محمد sirbo-2009
\n
لاستعمال مواقيت الصلاة
<i> /pray cityName </i>
لاستعمال فهرس القران
\n
اية غير محددة
\n
<i>/aya</i>
اية محددة 
<i>/quran souraNumber ayaNumber</i>
\n
بطاقة دعوية
\n
<i>/dcarts</i>
\n
فهرس القران الكريم
\n
صوتيات مختارة من عندنا
<i>/sounds</i>
اختيار سورة
<i>/quranAudio soura_Name_in_arabic</i>
قائمة السور
<i>/souraList</i>
\n
الشرح الدائم ان شاء الله
<i>/help</i>
`,{ parse_mode: 'HTML' })
})
newBot.command("help",(ctx)=>{
ctx.reply(`
السلام عليكم و رحمة الله و بركاته
\n
بوت انا مسلم من اعداد ابو محمد sirbo-2009
\n
لاستعمال مواقيت الصلاة
<i> /pray cityName </i>
لاستعمال فهرس القران
\n
اية غير محددة
\n
<i>/aya</i>
اية محددة 
<i>/quran souraNumber ayaNumber</i>
\n
بطاقة دعوية
\n
<i>/dcarts</i>
\n
فهرس القران الكريم
\n
صوتيات مختارة من عندنا
<i>/sounds</i>
اختيار سورة
<i>/quranAudio soura_Name_in_arabic</i>
قائمة السور
<i>/souraList</i>
`,{ parse_mode: 'HTML' })
})
newBot.command("pray",(ctx)=>{
let name = ctx.from.first_name
let fullMesaage = ctx.message.text.split(" ")
fullMesaage.splice(0,1)


fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${fullMesaage.join(" ")}&count=1`).then((data)=>{

            let allData = data.json()
            return allData
        
}).then((e)=>{
if(!e.results){
    ctx.reply('لا توجد مدينة بهذا الاسم')
    ctx.react("👎")
}

else if(e.results[0]){
let resalut = e.results[0]
let lat = resalut.latitude
let log = resalut.longitude
console.log(lat,log)
let nameCity = resalut.name
let country = resalut.country_code === "IL"?"PS":resalut.country_code
let countryName = resalut.country === "Israel"?"Palestine ❤️☝️":(resalut.country||(resalut.country_code ==="PS"?"Palestine  ❤️☝️":" "))
const flag =country
  .toUpperCase()
  .split('')
  .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
  .join('')
fetch(`https://api.aladhan.com/v1/timings/${fullgregorYear}?latitude=${lat}&longitude=${log}&method=3&tune=0,0,0,0,0,${country === "DZ"?3:0},0,0,0`).then(
        (data)=>{
            let allData = data.json()
            return allData
        }
    ).then(
        (dataTime)=>{
        //Fadj time
        let fadjTime = dataTime.data.timings.Fajr
        //Dhur time
        let DhuhrTime = dataTime.data.timings.Dhuhr 
        //assr time
        let Asr = dataTime.data.timings.Asr
        //magreb
        let magreb = dataTime.data.timings.Maghrib
        //Isha
        let Isha = dataTime.data.timings.Isha
        let suNrise = dataTime.data.timings.Sunrise
        //
        let eventIslam = 'لا يوجد'
        //full date
        let hijriweekDay = dataTime.data.date.hijri.weekday.ar
        let hijriDay = dataTime.data.date.hijri.day
        let hijriMonth = dataTime.data.date.hijri.month.ar
        let hijriYear = dataTime.data.date.hijri.year
        let fullhijriDate = ` ${hijriweekDay} ${hijriDay} ${hijriMonth} ${hijriYear}`
        if(hijriMonth ==='رَمَضان'){eventIslam = 'رمضان مبارك'}
        if(hijriMonth ==='شَوّال' && hijriDay === '1'){eventIslam = 'عيد فطر  سعيد'}
        if(hijriMonth ==='ذوالحجة' && hijriDay === '10'){eventIslam = 'عيد اضحى  سعيد'}
        if(hijriMonth ==='مُحَرَّم' && hijriDay === '10'){eventIslam = 'عاشوراء'}
        //
        let hedjriDate 
        if(country === "DZ"){
                        const link = "https://marw.gov.dz/";
                        fetch(link).then(data => data.text()).then(page => {
                        let date = page.match(/<[^>]*id=["']ubiko-date-hijri["'][^>]*>(.*?)<\/[^>]+>/s);
                        sendMessage(date[1],``)
                        })
        }
        else if(country !== "DZ"){
            sendMessage(fullhijriDate,`\n الموافق ل${fullgregorYear} `)
        }
function sendMessage(date,gregoreText){
        ctx.reply(`
            السلام عليكم ${name}
            \n
            🕌 مواقيت الصلاة ل ${nameCity} - ${countryName} - ${flag}
            \n
            ليوم ${date} ${gregoreText}
            \n
            الفجر : ${fadjTime}
            \n
            الظهر : ${DhuhrTime}
            \n
            العصر : ${Asr}
            \n
            المغرب : ${magreb}
            \n
            العشاء : ${Isha}
            \n
            الشروق : ${suNrise}
            \n
            مناسبة : ${eventIslam}
            `)
}
        }
    )
ctx.react("❤️")
}
})
})
newBot.command("aya",(ctx)=>{
let e = quranFile
let rendom = parseInt(Math.random()*e.length)
let rendomAya = parseInt((e[rendom].verses.length)*Math.random())
ctx.reply(`
<b>📖 آية من القرآن الكريم</b>
    \n
<blockquote>﴿${e[rendom].verses[rendomAya].text.ar}﴾</blockquote>
\n
<i>سورة ${e[rendom].name.ar}  الاية ${e[rendom].verses[rendomAya].number}</i>
<pre>
نسخ الاية 
\n
📖 آية من القرآن الكريم
\n
﴿${e[rendom].verses[rendomAya].text.ar}﴾
\n
in english
\n
﴿${e[rendom].verses[rendomAya].text.en}﴾
\n
سورة ${e[rendom].name.ar}  الاية ${e[rendom].verses[rendomAya].number}
</pre>
    `,{ parse_mode: 'HTML' })
ctx.react("❤‍🔥")
})
newBot.command("quran",(ctx)=>{
let e = quranFile
let fullMesaage = ctx.message.text.split(" ")
fullMesaage.splice(0,1)

let rendom = parseInt(fullMesaage[0])-1

let rendomAya = parseInt(fullMesaage[1])-1
try{
ctx.reply(`
<b>📖 آية من القرآن الكريم</b>
    \n
<blockquote>﴿${e[rendom].verses[rendomAya].text.ar}﴾</blockquote>
\n
<i>سورة ${e[rendom].name.ar}  الاية ${e[rendom].verses[rendomAya].number}</i>
<pre>
نسخ الاية 
\n
📖 آية من القرآن الكريم
\n
﴿${e[rendom].verses[rendomAya].text.ar}﴾
\n
in english
\n
﴿${e[rendom].verses[rendomAya].text.en}﴾
\n
سورة ${e[rendom].name.ar}  الاية ${e[rendom].verses[rendomAya].number}
</pre>
    `,{ parse_mode: 'HTML' })
ctx.react("👌")
}
catch{
ctx.reply(' اعد التحقق من الرسالة المرسلة')
ctx.react("👎")
}
})

newBot.command("dcarts",(ctx)=>{
try{
let rendomId = links[rendomNumber(links)].id
ctx.replyWithPhoto(rendomId)

}
catch{
ctx.reply("something wrong")
}
})
newBot.command("addImg",(ctx)=>{
let fullMesaage = ctx.message.text.split(" ")
fullMesaage.splice(0,1)
let [pass] = fullMesaage

if(pass === "01021430"){
ctx.react("👍")
try{
class newImg{
    constructor(id){
        this.id = id
    }
}
newBot.on("photo",(ctx1)=>{
if(ctx1.message.photo.length === 1){
let img = ctx1.message.photo[ctx1.message.photo.length-1].file_id

links.push(new newImg(img))
fs.writeFileSync(path.join(__dirname,"/assets/imgLinks.json"),JSON.stringify(links))
ctx1.react("👍")
}
else if(ctx1.message.photo.length >1){
let img = ctx1.message.photo
img.forEach((e)=>{
links.push(new newImg(e.file_id))
})
fs.writeFileSync(path.join(__dirname,"/assets/imgLinks.json"),JSON.stringify(links))
ctx1.react("👍")
}
}
)
}
catch{
ctx.reply("something wrong")
}
}
else{
    ctx.reply("you dont have permession")
}
})
function rendomNumber(array){
return Math.floor((Math.random())*array.length)
}

newBot.command("sounds",(ctx)=>{
let soundSend = audios[rendomNumber(audios)]
ctx.sendAudio(soundSend.fileId)
ctx.react("❤")
})
newBot.command("quranAudio",(ctx)=>{
try{
let fullMesaage = ctx.message.text.split(" ")
fullMesaage.splice(0,1)
let indexOfsoura = quranSurahs.indexOf(fullMesaage.join(" "))
ctx.replyWithAudio(audios[indexOfsoura].fileId)
ctx.react("👍")
}
catch{
ctx.reply(`تاكد من اسم السورة , قائمة السور من /souraList`)
}
})
newBot.command("souraList",ctx=>{
    ctx.reply(quranSurahs.join("\n"))
})
newBot.launch()
