export const parseStoryLaneCSV=(c)=>{const l=c.split('
');const r=[];for(let i=1;i<l.length;i++){const v=l[i].split(',');if(v.length>=8){let country=v[7];for(let j=8;j<v.length;j++)country+=','+v[j];r.push({demo:v[0],link:v[1],lastView:v[2],totalTime:v[3],stepsCompleted:parseInt(v[4])||0,percentComplete:parseFloat(v[5])||0,openedCTA:v[6],country})}}return r};
