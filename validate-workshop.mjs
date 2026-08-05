import fs from 'node:fs';
import vm from 'node:vm';

const fail=message=>{throw new Error(message)};
const read=name=>fs.readFileSync(new URL(name,import.meta.url),'utf8');

const sandbox={window:{}};
vm.runInNewContext(read('./workflow-data.js'),sandbox,{filename:'workflow-data.js'});
const flow=sandbox.window.WORKSHOP_FLOW;
if(!flow)fail('WORKSHOP_FLOW 未載入');
if(flow.steps.length!==15)fail(`步驟數應為 15，目前是 ${flow.steps.length}`);
if(flow.phaseSteps('personal').length!==9)fail('個人階段應為 9 步');
if(flow.phaseSteps('collab').length!==6)fail('協作階段應為 6 步');

const ids=flow.steps.map(step=>step.id);
if(new Set(ids).size!==ids.length)fail('步驟 ID 重複');
if(ids.join(',')!=='P1,P2,P3,P4,P5,P6,P7,P8,P9,C1,C2,C3,C4,C5,C6')fail('步驟順序不正確');
for(const phase of flow.phases){
  const total=flow.phaseSteps(phase.id).reduce((sum,step)=>sum+step.minutes,0);
  if(total!==phase.minutes)fail(`${phase.label} 宣告 ${phase.minutes} 分鐘，但逐步合計是 ${total} 分鐘`);
}
const fields=['id','phase','minutes','title','why','concept','terms','prompt','plan','human','dashboard','behind','rescue'];
for(const step of flow.steps){
  for(const field of fields)if(step[field]===undefined||step[field]===null||step[field]==='')fail(`${step.id} 缺少 ${field}`);
  if(!Array.isArray(step.plan)||step.plan.length<2)fail(`${step.id} 的計畫太短`);
  if(!Array.isArray(step.terms)||step.terms.length<2||step.terms.length>4)fail(`${step.id} 的名詞應為 2–4 個`);
  for(const item of step.terms){
    if(!item||typeof item.term!=='string'||!item.term.trim()||typeof item.meaning!=='string'||!item.meaning.trim())fail(`${step.id} 的名詞格式不完整`);
  }
  if(typeof step.concept!=='string'||step.concept.trim().length<45)fail(`${step.id} 的觀念說明太短`);
}
const p9=flow.steps.find(step=>step.id==='P9');
if(p9.title!=='三種看似「回去」：只看、restore、revert'||p9.why.includes('學生'))fail('P9 標題或讀者稱呼不正確');
for(const phrase of ['我不輸入 Git 指令','只查看證據並回覆「開始」、「繼續」或「停」','看到原有變更、非預期 diff、同步不一致、衝突或 push 被拒絕，立刻停下','第一段｜只查看舊版','第二段｜restore 未 commit 的假錯字','第三段｜revert 已 push 的假錯誤','全程禁止 reset、rebase、force push','若發生衝突，立刻停止','全部完成後，才另更新已被 .gitignore 排除的 WORKSHOP-RECEIPT.txt']){
  if(!p9.prompt.includes(phrase))fail(`P9 缺少清楚的 AI 代操作指示：${phrase}`);
}
for(const phrase of ['origin 完整網址','我帳號下的 research-practice-project']){
  if(!p9.prompt.includes(phrase))fail(`P9 缺少推送目的地核對：${phrase}`);
}
if(p9.prompt.includes('我新增一行錯字'))fail('P9 不應要求學生自己修改檔案');
if(p9.plan.some(item=>item.includes('學生')))fail('P9 計畫應直接使用第二人稱「你」');
if(!Array.isArray(p9.situations)||p9.situations.length!==4)fail('P9 缺少 show／restore／revert／reset 判斷表');

const p7=flow.byId('P7');
if(p7.plan.some(item=>item.includes('提交 notes.md 與收據'))||!p7.prompt.includes('收據不要加入 commit')||!p7.behind.includes('git diff --cached --name-only')||!p7.behind.includes('git diff --cached -- notes.md')||/git (?:add|commit).*RECEIPT/i.test(p7.behind))fail('P7 沒有證明只提交 notes.md 或沒有分開本機收據');
const p8=flow.byId('P8');
if(!p8.prompt.includes('比較期間只查看')||!p8.prompt.includes('唯一可以寫入的是 WORKSHOP-RECEIPT.txt')||!p8.behind.includes('<較舊commit> <較新commit>')||(p8.behind.match(/git rev-parse HEAD/g)||[]).length!==2||/git (?:switch|checkout|add|commit|restore|reset)\b/.test(p8.behind))fail('P8 沒有完整證明只讀驗收、HEAD 不變與收據例外');

const reset=flow.resetGuide;
if(!reset||reset.syntax!=='git reset [--soft | --mixed | --hard] [<commit>]')fail('缺少 reset 簡化語法教材');
for(const phrase of ['不是 git reset 的完整語法','--patch','--merge','--keep']){
  if(!reset.syntaxNote.includes(phrase))fail(`reset 語法註解缺少：${phrase}`);
}
for(const term of ['git','reset','--','[ ]','|','< >','<commit>']){
  if(!reset.symbols.some(item=>item.term===term))fail(`reset 缺少符號／參數：${term}`);
}
for(const term of ['HEAD','HEAD~1','commit ID／hash','index／暫存區','working tree／工作區','untracked／未追蹤']){
  if(!reset.layers.some(item=>item.term===term))fail(`reset 缺少名詞：${term}`);
}
for(const mode of ['--soft','--mixed（預設）','--hard']){
  if(!reset.modes.some(item=>item.mode===mode))fail(`reset 缺少模式：${mode}`);
}
const soft=reset.modes.find(item=>item.mode==='--soft'),mixed=reset.modes.find(item=>item.mode==='--mixed（預設）'),hard=reset.modes.find(item=>item.mode==='--hard');
if(soft.index!=='保持原樣'||soft.work!=='保持原樣')fail('reset --soft 三層效果錯誤');
if(!mixed.index.includes('目標內容')||mixed.work!=='保持原樣')fail('reset --mixed 三層效果錯誤');
if(!hard.index.includes('目標內容')||!hard.work.includes('目標內容')||!hard.risk.includes('工作區移除'))fail('reset --hard 三層效果或路徑移除風險錯誤');
if(!reset.examples.some(item=>item.command==='git reset --hard')||!reset.examples.some(item=>item.command==='git reset --hard HEAD~1'))fail('reset 缺少兩個對照例子');
if(!reset.warning.includes('force push')||!reset.notes.some(note=>note.includes('未追蹤')))fail('reset 缺少遠端或未追蹤檔風險');
for(const phrase of ['git remote get-url origin','git show <第一版commit>:notes.md','git diff --cached -- notes.md','git restore -- notes.md','git revert --no-edit <錯誤commit>','git fetch origin','git rev-parse origin/main']){
  if(!p9.behind.includes(phrase))fail(`P9 幕後流程缺少：${phrase}`);
}
if((p9.behind.match(/git push origin main/g)||[]).length!==2)fail('P9 應有錯誤 commit 與 revert commit 兩次 push');

const c1=flow.byId('C1'),c2=flow.byId('C2'),c4=flow.byId('C4'),c5=flow.byId('C5');
if(!c1.behind.includes('<文件資料夾中的目標路徑>')||!c1.rescue.includes('公開 repo 即使尚未接受邀請也能 clone'))fail('C1 clone 位置或權限說明不完整');
for(const phrase of ['互報 GitHub 帳號','「方法」與「文獻回顧」兩個標題','WORKSHOP-RECEIPT*.txt','Accept invitation','回報 repo 完整網址']){
  if(!c1.prompt.includes(phrase))fail(`C1 自建配對 repo 提示缺少：${phrase}`);
}
if(!c1.behind.includes('gh repo create thesis-pair-')||!c1.behind.includes('collaborators'))fail('C1 幕後流程缺少建 repo 或邀請協作者指令');
for(const phrase of ['git pull --ff-only origin main','git add paper.md','git diff --cached -- paper.md']){
  if(!c2.behind.includes(phrase))fail(`C2 幕後流程缺少：${phrase}`);
}
if(!c4.behind.includes('gh pr review <PR-number>')||!c4.behind.includes('gh pr merge <PR-number>'))fail('C4 必須指定 PR 編號');
if(!c5.behind.includes('git pull --ff-only origin main'))fail('C5 應使用 --ff-only 同步');
if(!c2.prompt.includes('本練習以公開模擬資料示範版本控制')||!flow.byId('C3').prompt.includes('示範可重現研究流程')||!c4.prompt.includes('研究生的電腦')||!c4.prompt.includes('指導教授的電腦與 GitHub 帳號'))fail('協作第一輪缺少明確修改句或兩台電腦交接');
const c6=flow.steps.find(step=>step.id==='C6');
if(!c6.why.includes('你與夥伴')||!c6.dashboard.includes('你與夥伴'))fail('C6 應直接對你與夥伴說明');
if(!c6.behind.startsWith('流程示意（不是一條可以直接輸入的指令）'))fail('C6 箭頭流程必須明標不是指令');
for(const phrase of ['回報 PR 編號與網址','核對 repo、作者與來源分支','針對該編號 Approve','合併同一個 PR 編號']){
  if(!c6.prompt.includes(phrase))fail(`C6 缺少明確 PR 交接：${phrase}`);
}
if(!c6.prompt.includes('相關文獻將於正式研究中補齊'))fail('C6 缺少第二輪明確修改任務');

const html={index:read('./index.html'),material:read('./material.html'),quest:read('./quest.html'),radar:read('./radar.html')};
const fileFor={index:'index.html',material:'material.html',quest:'quest.html',radar:'radar.html'};
const pageFor=Object.fromEntries(Object.entries(fileFor).map(([key,file])=>[file,key]));
const idsByPage={};
for(const [name,source] of Object.entries(html)){
  if((source.match(/<!DOCTYPE/gi)||[]).length!==1)fail(`${fileFor[name]} 的 DOCTYPE 應恰好一個`);
  const pageIds=[...source.matchAll(/[\s<]id="([^"]+)"/g)].map(match=>match[1]);
  if(new Set(pageIds).size!==pageIds.length)fail(`${fileFor[name]} 有重複 id`);
  idsByPage[name]=new Set(pageIds);
  const defined=new Set([...source.matchAll(/--([\w-]+)\s*:/g)].map(match=>match[1]));
  for(const used of [...source.matchAll(/var\(--([\w-]+)/g)].map(match=>match[1]))if(!defined.has(used))fail(`${fileFor[name]} 使用未定義 CSS 變數 --${used}`);
  for(const src of [...source.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map(match=>match[1])){
    if(!fs.existsSync(new URL(src,new URL(`./${fileFor[name]}`,import.meta.url))))fail(`${fileFor[name]} 圖片不存在：${src}`);
  }
}
for(const id of ids)idsByPage.material.add(`guide-${id}`),idsByPage.quest.add(`task-${id}`);
for(const [name,source] of Object.entries(html)){
  for(const href of [...source.matchAll(/\bhref="([^"]+)"/g)].map(match=>match[1])){
    if(href.includes('${'))continue;
    if(/^(?:https?:|mailto:|tel:)/i.test(href))continue;
    const [filePart,hashPart]=href.split('#'),targetFile=filePart||fileFor[name],targetName=pageFor[targetFile];
    if(!targetName)fail(`${fileFor[name]} 連到不存在的本機頁面：${href}`);
    if(hashPart&&!idsByPage[targetName].has(hashPart))fail(`${fileFor[name]} 連到不存在的錨點：${href}`);
  }
}
for(const name of ['material','quest']){
  if(!html[name].includes('<script src="workflow-data.js"></script>'))fail(`${name}.html 未載入共用流程`);
}
if(html.radar.includes('<script src="workflow-data.js"></script>'))fail('講師雷達不應載入未使用的共用流程');
for(const name of ['material','quest','radar']){
  const inline=[...html[name].matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
  for(const [i,code] of inline.entries()){
    try{new Function(code)}catch(error){fail(`${name}.html 第 ${i+1} 段 inline script 語法錯誤：${error.message}`)}
  }
}
if(!html.material.includes('id="flowGuide"')||!html.material.includes('id="troubleGrid"'))fail('教材缺少完整手冊或故障排除容器');
{
  const checkCount=(html.material.match(/class="check"/g)||[]).length;
  const labels=[...html.material.matchAll(/aria-label="完成第 (\d+) 項"/g)].map(m=>Number(m[1]));
  const progress=html.material.match(/id="checkProgress"[^>]*>0 \/ (\d+)</);
  if(!progress||Number(progress[1])!==checkCount)fail(`行前進度初始字串是 0 / ${progress?progress[1]:'?'}，但實際有 ${checkCount} 個項目`);
  if(labels.length!==checkCount||labels.some((n,i)=>n!==i+1))fail(`行前項目的 aria-label 編號應為 1–${checkCount} 連續，目前是 ${labels.join(',')}`);
  for(const [n] of [...html.material.matchAll(/第 (\d+) 項/g)].map(m=>[Number(m[1])])){
    if(n>checkCount)fail(`教材引用了不存在的行前項次：第 ${n} 項（目前只有 ${checkCount} 項）`);
  }
  for(const gone of ['viewform','id="projBtn"','.projector','回填檢核表','講師會把你加進','第 9 項回報','第 8 項回報','第 9 項要用','第 8 項註明']){
    if(html.material.includes(gone))fail(`教材殘留已移除的表單／投影／講師分配 repo 流程：${gone}`);
  }
  for(const [page,gone] of [['material','講師實際分配'],['material','講師分配'],['quest','講師分配'],['material','thesis-pair-01'],['quest','講師會分配']]){
    if(html[page].includes(gone))fail(`${fileFor[page]} 殘留「講師預先分配配對 repo」的舊流程：${gone}`);
  }
}
if(!Array.isArray(flow.phrases)||flow.phrases.length!==12)fail('共用資料缺少 12 句日常用語表（flow.phrases）');
if(html.material.includes('const PHRASES=')||!html.material.includes('FLOW.phrases'))fail('教材的 12 句表應改用共用資料 FLOW.phrases，不得另存一份');
for(const name of ['index','quest','radar']){
  if(!html[name].includes(':root[data-theme="dark"]')||!html[name].includes("localStorage.getItem('gw-theme')"))fail(`${fileFor[name]} 未支援教材頁的主題切換（data-theme／gw-theme）`);
}
for(const removed of ['十二幕','id="story"','#story','SCENES','SCENE_QUEST','drawGraph','function go(','onclick="go(','copyStarter','scenebox','sceneDots','stepnav']){
  if(html.material.includes(removed)||html.index.includes(removed))fail(`教材仍殘留已移除的十二幕劇本：${removed}`);
}
if(html.material.includes('template repo'))fail('教材仍殘留已取消的範本 repo 流程');
if(!html.material.includes('協作進階：衝突來了怎麼辦'))fail('教材缺少保留的協作衝突說明');
if(html.material.includes('本課的共用專案就是這檔')||html.material.includes('本課每組的配對 repo 使用這一檔')||!html.material.includes('檔位一＋課堂紀律'))fail('教材的 main 保護檔位與「課堂自建 repo」流程不一致');
for(const target of ['#guide-P1','#guide-P4','#guide-P6','#guide-P9','#guide-C1','#guide-C2','#guide-C3','#guide-C4','#conflict']){
  if(!html.material.includes(`href="${target}"`))fail(`術語表缺少實際步驟連結：${target}`);
}
if(!html.quest.includes('id="pairRepo"')||!html.quest.includes('第 15')){
  // 第 15 步由共用資料動態產生；只要確認程式確實走訪全部 steps。
  if(!html.quest.includes('for(const step of FLOW.phaseSteps'))fail('闖關頁沒有產生全部共用步驟');
}
if(/12 關/.test(html.quest))fail('闖關頁仍殘留舊版 12 關流程');
if(!html.quest.includes("localStorage.getItem('gq-settings-schema')!=='pair-required-v1'")||!html.quest.includes("savedPair.toLowerCase()==='cwstedctw/thesis-pair-01'"))fail('闖關頁沒有一次性清除舊版／示範配對 repo 設定');
if(html.quest.includes("cfg.pairRepo.value=localStorage.getItem('gq-pair')||'cwstedctw/thesis-pair-01'"))fail('闖關頁不應預填尚未分配的配對 repo');
const dashboardAt=html.quest.indexOf('id="dashboard"');
const personalStartAt=html.quest.indexOf('<section class="personal-only">');
if(dashboardAt<0||personalStartAt<0||dashboardAt>personalStartAt)fail('闖關儀表板必須放在主要內容最上方');
for(const needle of ['id="sProgress"','id="phaseProgressLabel"','id="phaseProgressFill"','id="dashRefresh"','id="clearQuest"','data-auto="${step.id}"','function autoCheckStep','function phaseCompletion','function showTaskResult','function scrollElementBelowDashboard','function showCopyFallback','id="copyFallback"','let autoNotices={}','✓ 這一步已完成','再檢查一次','人工驗收備援（自動檢查無法判斷時）','① 複製 AI 驗收提示','② AI 回覆通過，再標記完成','我已核對，標記完成']){
  if(!html.quest.includes(needle))fail(`闖關頁缺少就地驗收元件：${needle}`);
}
if(html.quest.includes("$('dashboard').style.display=handle?'block':'none'"))fail('未連接資料夾時不應隱藏闖關儀表板');
if(!html.quest.includes("phase==='personal'?'第一階段':'第二階段'"))fail('闖關儀表板缺少分階段完成數');
if(!html.quest.includes('@media(max-width:760px)')||!html.quest.includes('.dashboard{position:sticky;top:0;z-index:8;margin:8px 0 14px}'))fail('手機版缺少精簡 sticky 儀表板');
if(!html.quest.includes("finally{if(b.isConnected){b.disabled=false"))fail('取消資料夾選擇後，自動檢查按鈕不會恢復');
if(!html.quest.includes("document.execCommand('copy')")||!html.quest.includes('showCopyFallback(b.dataset.copy)'))fail('複製失敗時缺少可操作的手動備援');
if(!html.quest.includes('.dashboard #sFolder{font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}')||!html.quest.includes("$('sFolder').title=state.folder"))fail('長資料夾名稱沒有單行省略或完整名稱提示');
if(!html.quest.includes('class="guide-link"')||!html.quest.includes('target="_blank" rel="noopener"')||!html.quest.includes('這一步較長：開啟教材 P9 完整拆解'))fail('關卡缺少明顯的教材詳解連結');
if(!html.material.includes('function openLinkedGuide()')||!html.material.includes('if(!location.hash)return')||!html.material.includes("target.open=true")||!html.material.includes("window.addEventListener('hashchange',openLinkedGuide)"))fail('教材深連結不會安全地自動展開對應步驟');
for(const needle of ['闖關頁帶你做，這份教材幫你看懂','先懂這個','本關名詞小抄','你要判斷什麼','完成證據','實作參考｜完整 AI 提示、計畫與救援','resetGuideHTML','安全補充｜看懂 AI 提出的 reset']){
  if(!html.material.includes(needle)&&!read('./workflow-data.js').includes(needle))fail(`教材缺少觀念優先結構：${needle}`);
}
for(const oldText of ['存過檔的版本永遠救得回來','這是你手上最大的後悔藥','合併點就是一個「有兩個爸爸」','不上傳清單','檔案退回某個存檔點的樣子','reset --hard 毀掉的是']){
  if(html.material.includes(oldText))fail(`教材仍有過度簡化或錯誤舊說法：${oldText}`);
}
for(const required of ['用指定來源覆蓋工作區或暫存區的檔案','新增一筆反向 commit','不是保密工具','快轉到新位置','HEAD 的第一個父 commit']){
  if(!html.material.includes(required)&&!read('./workflow-data.js').includes(required))fail(`教材缺少修正後說明：${required}`);
}
for(const [page,oldText] of [['quest','<strong>人要做：</strong>'],['quest','由學員手動確認完成'],['material','人一定要確認'],['material','最低完成線：</strong>每人完成'],['index','學員不必開。']]){
  if(html[page].includes(oldText))fail(`${page}.html 仍有對讀者使用第三人稱的文字：${oldText}`);
}
if(html.quest.includes("if(map[id]){localStorage.setItem('gq-done-'"))fail('自動證據不得直接把整關標成完成');
for(const needle of ["if(map[id])return'evidence'",'自動證據已符合；完成仍由你判斷','gq-progress-schema','role="progressbar"','aria-label="待手動複製的 AI 提示"','.task pre{max-width:100%'])if(!html.quest.includes(needle))fail(`闖關頁缺少雙階段驗收或版面修正：${needle}`);
if(!html.material.includes('--teal-soft:#DCEFED')||!html.material.includes('background:var(--panel)')||!html.material.includes("['roadmap','why']")||!html.material.includes("['phrases','troubleshoot','quiz','refs']"))fail('教材缺少色彩 token 或精簡後導覽分組');
if(/git worktree|<strong>fork<\/strong>|worktree、branch/.test(html.material)||/git worktree/.test(read('./workflow-data.js')))fail('教材仍有未進入主流程的 worktree／fork 延伸內容');
for(const url of ['https://gitbook.tw/','https://swcarpentry.github.io/git-novice/','https://www.aeaweb.org/journals/data'])if(!html.material.includes(`href="${url}"`))fail(`參考資料不是可點連結：${url}`);
if(!html.radar.includes('配對 repo')||!html.radar.includes('/reviews?'))fail('雷達缺少配對 repo 或 PR review 檢查');
for(const needle of ["items=rows(personal?'personal':'pairs')","allowEmpty&&r.status===409",'API 剩餘 ','自動更新需要 token','personalSection','pairSection'])if(!html.radar.includes(needle))fail(`講師雷達缺少階段過濾、空 repo 或 API 額度處理：${needle}`);
if(!html.radar.includes("localStorage.getItem('gr-settings-schema')!=='real-repos-v1'"))fail('講師雷達沒有一次性清除舊示範設定');
if(html.radar.includes('id="demo"')||html.radar.includes('已有練習分支'))fail('講師雷達仍有無效示範設定或舊分支流程');
if(!html.index.includes('15 步'))fail('首頁沒有更新為 15 步');
if(flow.version!=='2026-08-05-v5.5'||!html.material.includes('v5.5')||!html.quest.includes('v5.5')||!html.radar.includes('v5.5')||!html.index.includes('v5.5'))fail('版本號未同步到 v5.5（四頁都要有）');

console.log(`PASS ${flow.version}: ${flow.steps.length} steps, 4 HTML files, shared flow, layout guards and inline JavaScript verified.`);
