const n=new Date(),h=n.getHours(),m=n.getMinutes(),t=h*60+m,b='dreamos2026';
let j=h.toString().padStart(2,'0'),r='02';
if(t<270){r='02';j='00'}else if(t<360){r='02';j='04'}else if(t<720){r='02';j='06'}else if(t<900){r='04';j='12'}else if(t<1080){r='04';j='15'}else if(t<1170){r='03';j='18'}else{r='04';j='19'}
console.log('🕐 Time:',n.toLocaleTimeString());
console.log('🔑 Key:',b+j+r);
console.log('💡 Format: dreamos2026{jam}{rakaat}');
