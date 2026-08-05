(function(){
  'use strict';

  const phases=[
    {
      id:'personal',
      label:'第一階段｜自己的研究專案',
      minutes:51,
      promise:'從普通資料夾開始，走完兩次修改、兩次存版、兩次上傳，再學會安全回復。'
    },
    {
      id:'collab',
      label:'第二階段｜研究生 × 指導教授',
      minutes:44,
      promise:'兩人輪流提出修改與把關，完整走過 PR、退回補改、核准、合併與同步。共享的 main 不用 reset、rebase 或 force push 改寫歷史。'
    }
  ];

  const steps=[
    {
      id:'P1',phase:'personal',minutes:6,title:'開啟並確認工作資料夾',
      why:'Git 管理的是一個資料夾。先確認 AI、教材與你本人看的是同一個地方，後面才不會把版本庫建錯位置。',
      concept:'Git 不是管理整台電腦，而是以目前開啟的資料夾為範圍。AI 若站錯路徑，即使操作本身正確，也可能查看或修改別的專案。因此先只讀核對完整路徑、根目錄檔案與 Git 狀態，替後續操作畫出安全邊界。',
      terms:[
        {term:'工作資料夾',meaning:'你目前開啟、準備讓 AI 操作的專案資料夾。'},
        {term:'完整路徑',meaning:'資料夾在電腦裡的完整地址，可以排除同名資料夾。'},
        {term:'根目錄',meaning:'這個專案最上層的資料夾，不是整顆硬碟的根目錄。'},
        {term:'版本庫（repository／repo）',meaning:'專案資料夾加上 Git 保存的修改歷史。'}
      ],
      prompt:'我已經開啟這個練習資料夾。請只查看，告訴我目前工作的完整路徑、裡面有哪些檔案，以及這裡現在是不是 Git 版本庫；先不要修改任何東西。',
      plan:['回報完整路徑','列出根目錄檔案','檢查是否已有 Git','不修改檔案'],
      human:'核對 AI 回報的資料夾名稱，並把闖關頁連接到同一個資料夾。',
      dashboard:'資料夾名稱正確；Git 顯示「尚未建立」；commit 為 0。',
      behind:'pwd / Get-Location\nls / Get-ChildItem\ngit status',
      rescue:'如果 AI 回報的路徑不是剛建立的資料夾，立刻停下，重新用目前使用的 AI 工具開啟正確資料夾。若尚未建立 Git，git status 顯示「not a git repository」是這一步的預期結果，不要急著修。'
    },
    {
      id:'P2',phase:'personal',minutes:8,title:'加入版本控制並連到 GitHub',
      why:'版本控制先在本機建立歷史帳本，再把同一份歷史連到 GitHub。課堂全部是假資料，所以使用公開練習 repo，講師才能救援。',
      concept:'Git 與 GitHub 是兩層：Git 在本機建立版本歷史，GitHub 保存可連線的遠端副本。這一步先建立本機版本庫，再連上 origin；.gitignore 先排除不該進歷史的檔案。課堂使用公開假資料，真實研究或學生資料應改用私人 repo。',
      terms:[
        {term:'Git／GitHub',meaning:'Git 是本機版本工具；GitHub 是保存遠端版本庫與協作的網站服務。'},
        {term:'main',meaning:'本課使用的正式版本主線。'},
        {term:'remote／origin',meaning:'remote 是遠端版本庫；origin 是本機替主要遠端網址取的慣用名稱。'},
        {term:'.gitignore',meaning:'指定哪些未追蹤檔案不要納入版本；它不會保護已提交內容，也不是保密工具。'}
      ],
      prompt:'我想替目前資料夾加上 Git 版本控制，建立合適的 .gitignore（請排除 WORKSHOP-RECEIPT*.txt），並在我的 GitHub 建一個公開練習 repo，名稱叫 research-practice-project。先列出計畫、預計建立或修改的東西，以及公開前的資料安全檢查；等我同意再執行。',
      plan:['再次確認工作路徑','檢查敏感資料','建立 Git 與 .gitignore，排除課堂收據','建立公開 GitHub repo','設定 origin','回報 repo 網址'],
      human:'確認路徑、公開範圍與資料都是假的，再明確說「同意執行」。',
      dashboard:'Git 已建立；分支為 main；remote 已連接；歷史仍可為 0。',
      behind:'git init\ngit branch -M main\ngh repo create research-practice-project --public --source=.\ngit remote -v',
      rescue:'若 GitHub 登入失敗，先請 AI 執行 gh auth status；不要改用 force 或把密碼交給 AI。'
    },
    {
      id:'P3',phase:'personal',minutes:5,title:'建立第一份研究筆記',
      why:'先建立一個小而看得懂的純文字檔，才能清楚觀察「新檔案」在 Git 裡的狀態。',
      concept:'notes.md 是純文字檔，Git 能逐行比較內容。建立後先不 commit，是為了觀察「未追蹤」狀態：檔案已存在，Git 也看得見，但尚未收進任何版本。先學會讀 status，才能決定哪些內容值得存版。',
      terms:[
        {term:'Markdown（.md）',meaning:'容易閱讀的純文字格式，Git 能清楚比較每一行。'},
        {term:'未追蹤（untracked）',meaning:'檔案已存在，但從未被收進任何 commit。'},
        {term:'工作區',meaning:'你目前實際看見並正在編輯的檔案狀態。'},
        {term:'status',meaning:'Git 的現況報告；查看它不會修改或儲存檔案。'}
      ],
      prompt:'請建立 notes.md，放入三行假的研究筆記，其中一行寫「表 2 的係數目前是 0.98」。先不要 commit；完成後只用白話告訴我 Git 現在看到哪些新檔或修改。',
      plan:['只建立 notes.md','不使用真資料','不提交','回報 Git 狀態'],
      human:'打開 notes.md，確認內容簡單、沒有個資或真研究資料。',
      dashboard:'檔案清單出現 notes.md；專案顯示有尚未提交的內容。',
      behind:'git status --short',
      rescue:'如果 status 沒看到 notes.md，先確認檔案已存檔，而且目前資料夾沒有選錯。'
    },
    {
      id:'P4',phase:'personal',minutes:6,title:'看清楚第一版，再存成 commit',
      why:'commit 前先看「這一版到底會收進什麼」。這是監督 AI 的第一道門。',
      concept:'Git 存版分成三層：工作區是目前檔案，暫存區是下一版準備採用的內容，commit 才是正式存檔點。git add 只把內容放進暫存區，不等於提交或上傳；staged diff 是 commit 前最後一次逐行核對。',
      terms:[
        {term:'git add',meaning:'把指定內容放進暫存區；還沒有建立版本，也沒有上傳。'},
        {term:'暫存區（index／staging area）',meaning:'下一個 commit 準備採用的專案快照。'},
        {term:'staged diff',meaning:'逐行查看暫存區即將收進 commit 的內容。'},
        {term:'commit',meaning:'附有時間與說明的本機專案快照。'}
      ],
      prompt:'請把第一版準備收進去的檔案與內容差異列給我看，先不要 commit。等我確認後，再存成第一個版本，說明寫「建立研究筆記第一版」。最後在 WORKSHOP-RECEIPT.txt 記錄 P4 done。',
      plan:['列出將納入的檔案','顯示 staged diff','等待確認','建立第一個 commit','寫收據'],
      human:'逐檔確認；看到不相關檔案就喊停。',
      dashboard:'commit 數量成為 1；工作資料夾乾淨。',
      behind:'git add .gitignore notes.md\ngit diff --cached\ngit commit -m "建立研究筆記第一版"',
      rescue:'若 AI 把整個資料夾都加入，要求它先列檔案、移除不相關項目，再重新顯示 staged diff。'
    },
    {
      id:'P5',phase:'personal',minutes:3,title:'第一次推上 GitHub',
      why:'commit 只存在這台電腦；push 才會把版本送到 GitHub。',
      concept:'commit 只把快照留在本機；push 才把 commit 傳到 GitHub。推送成功不代表所有手邊內容都已備份，尚未 commit 的修改不會上傳。本機 main 與 origin/main 指向同一筆最新 commit，才算兩邊同步。',
      terms:[
        {term:'push',meaning:'把本機已有的 commit 傳送到遠端，不會上傳尚未 commit 的修改。'},
        {term:'origin/main',meaning:'本機所記錄的遠端 main 狀態。'},
        {term:'同步',meaning:'本機 main 與 GitHub main 指向同一筆最新 commit。'}
      ],
      prompt:'把目前的 main 推上 GitHub，完成後給我 repo 網址和最新 commit 網址，我要自己打開確認。最後在 WORKSHOP-RECEIPT.txt 記錄 P5 done。',
      plan:['確認 remote 與分支','推送 main','回報網址','不改寫遠端歷史'],
      human:'親自打開 GitHub，確認 notes.md 與第一筆 commit 都看得到。',
      dashboard:'本機與 origin/main 同步；雲端狀態亮綠燈。',
      behind:'git push -u origin main',
      rescue:'push 被拒時，請 AI 先 fetch 並解釋本機與遠端差異；絕對不要 force push。'
    },
    {
      id:'P6',phase:'personal',minutes:5,title:'讓 AI 做小修改，再看 diff',
      why:'AI 可以代做修改，但人仍要先看修改計畫，再用 diff 確認它實際改的內容與計畫一致。',
      concept:'AI 說做完只是回報，diff 才是實際證據。紅色減號表示舊內容被移除，綠色加號表示新內容被加入，並不代表內容錯誤或正確。你要核對檔案範圍、刪除行與新增行是否都符合先前同意的計畫。',
      terms:[
        {term:'diff',meaning:'把兩個狀態逐行比較，列出新增、刪除與修改。'},
        {term:'紅色減號（-）',meaning:'這一行存在於修改前，目前已被移除；不等於內容一定錯。'},
        {term:'綠色加號（+）',meaning:'這一行出現在修改後；不等於內容一定正確。'},
        {term:'尚未提交（uncommitted）',meaning:'修改仍在工作區或暫存區，還沒有成為 commit。'}
      ],
      prompt:'請先說明你打算怎麼修改 notes.md，等我同意後，再把其中的示範數字 0.98 改成 0.96，並加一行假的研究筆記。完成後逐行列出 diff，用白話解釋紅色減號與綠色加號；先不要 commit。最後在 WORKSHOP-RECEIPT.txt 記錄 P6 done。',
      plan:['說明只會修改 notes.md 的哪些內容','等待我同意','執行小修改','逐行顯示並解釋 diff','不提交','寫收據'],
      human:'修改前確認計畫只動 notes.md；修改後確認舊數字是刪除、新數字與新筆記是新增，沒有其他變更。',
      dashboard:'顯示尚未提交的修改；commit 仍為 1。',
      behind:'git diff -- notes.md',
      rescue:'diff 空白時先確認 AI 是否真的完成並儲存修改；若看到別的檔案，立刻停下，確認 AI 工具與闖關頁使用同一個資料夾。'
    },
    {
      id:'P7',phase:'personal',minutes:5,title:'第二次 commit 與 push',
      why:'重複一次完整循環，才會把版本控制變成日常：改、看、存、推。',
      concept:'日常版本循環是修改、看 diff、放入暫存區、commit、push。commit 訊息應說明為什麼改，而不只寫檔名。本關的收據只記錄闖關進度，依 .gitignore 留在本機，不應混進研究版本或推上 GitHub。',
      terms:[
        {term:'commit 訊息',meaning:'存檔點的說明，應讓未來的你看懂改了什麼以及為什麼改。'},
        {term:'本機歷史',meaning:'目前只存在這台電腦版本庫裡的 commit。'},
        {term:'遠端歷史',meaning:'已透過 push 傳到 GitHub 的 commit。'},
        {term:'WORKSHOP-RECEIPT',meaning:'本機闖關紀錄；由 .gitignore 排除，不加入 commit。'}
      ],
      prompt:'剛剛的 diff 正確。請只把 notes.md 的這次修改存成第二個版本，commit 訊息寫「訂正係數並補研究筆記」，再推送 main 到 GitHub。確認本機 main 與 origin/main 同步後，才在 WORKSHOP-RECEIPT.txt 記錄 P7 done；收據不要加入 commit。',
      plan:['列出全部已暫存檔案，結果必須只有 notes.md','顯示 notes.md 的 staged diff 並核對 commit 訊息','建立第二個 commit','推送 main 並驗證遠端同步','完成後寫 P7 收據；收據不加入 commit'],
      human:'確認 commit 訊息能說明「為什麼改」，並再次打開 GitHub 看最新版本。',
      dashboard:'commit 至少 2；本機與 GitHub 同步；歷史圖出現第二個節點。',
      behind:'git add notes.md\ngit diff --cached --name-only\ngit diff --cached -- notes.md\ngit commit -m "訂正係數並補研究筆記"\ngit push origin main\ngit status --short --branch',
      rescue:'若 GitHub 看不到第二版，先分辨是尚未 commit，還是 commit 完但尚未 push。'
    },
    {
      id:'P8',phase:'personal',minutes:4,title:'查歷史並比較兩個版本',
      why:'Git 的價值不只在保存，而是能回答「哪一版、誰改的、改了什麼」。',
      concept:'log 回答有哪些存檔點、何時建立與為什麼改；兩個 commit 之間的 diff 回答實際改了哪些行。每筆 commit 都有可辨識的雜湊值。查看歷史不會移動 HEAD 或修改 notes.md；寫收據是驗收完成後另外允許的動作。',
      terms:[
        {term:'log',meaning:'依時間列出 commit 的歷史清單。'},
        {term:'雜湊值（hash）',meaning:'Git 給每筆 commit 的識別碼，畫面通常顯示前幾個字元。'},
        {term:'HEAD',meaning:'指向你目前所在的 commit，不包含尚未 commit 的修改。'},
        {term:'HEAD~1',meaning:'HEAD 的第一個父 commit；在本課的直線歷史中就是上一筆 commit。'}
      ],
      prompt:'請列出最近兩個曾修改 notes.md 的 commit，用白話摘要每一版；再比較這兩個 commit 的 notes.md。比較期間只查看 Git 歷史與 notes.md，不要切換分支，也不要修改 notes.md 或 Git 狀態。顯示目前仍在 main、工作區狀態沒有改變的證據。完成以上只讀驗收後，唯一可以寫入的是 WORKSHOP-RECEIPT.txt，請記錄 P8 done；收據不要加入暫存區或 commit。',
      plan:['記錄開始時的分支、HEAD 與工作區狀態','列出 notes.md 最近兩筆 commit 與雜湊值','比較較舊與較新的 commit','再次證明分支、HEAD 與工作區狀態未改變','只讀驗收完成後寫 P8 收據；收據不加入 Git'],
      human:'確認 AI 沒有切換版本或改動 notes.md；只讀驗收完成後，唯一新增的是被忽略的本機收據內容。',
      dashboard:'歷史圖維持兩個以上節點；目前分支仍是 main；專案內容沒有新增修改。',
      behind:'git status --short --branch\ngit rev-parse HEAD\ngit log --format="%H %s" -2 -- notes.md\n# 把下一行的替代文字換成上一行列出的兩個實際 hash\ngit diff <較舊commit> <較新commit> -- notes.md\ngit rev-parse HEAD\ngit status --short --branch',
      rescue:'若歷史少於兩筆，先回 P7 確認第二次 commit 是否真的成功。'
    },
    {
      id:'P9',phase:'personal',minutes:9,title:'三種看似「回去」：只看、restore、revert',
      why:'「回去」不是一個動作：舊內容可能只需查看，未提交錯誤才丟棄，已發布錯誤則要留下撤銷紀錄。分清狀態，才能阻止 AI 用錯方法。',
      concept:'這三種操作處理不同狀態：show 只讀舊 commit，不改目前狀態；restore 把尚未 commit 的工作檔還原，未保存內容會消失；revert 對已發布的錯誤新增撤銷 commit，原紀錄仍保留。reset 可以重新指定分支位置，hard 還會覆蓋暫存區與工作檔；本關完全不用 reset。',
      terms:[
        {term:'show｜只讀舊版',meaning:'git show <commit>:notes.md 直接讀取該 commit 裡的檔案，不切換版本，也不改 HEAD、暫存區或工作檔。'},
        {term:'restore｜丟棄未提交修改',meaning:'git restore -- notes.md 預設用暫存區內容覆蓋工作檔。本關起點乾淨，所以暫存區與 HEAD 相同；尚未 commit 的假錯字會消失。'},
        {term:'revert｜撤銷已發布版本',meaning:'對普通 commit 執行 revert，會新增一筆反向修改的 commit；原錯誤 commit 仍留在歷史。若內容重疊，可能發生衝突。'},
        {term:'reset｜重新指定版本位置',meaning:'commit 模式的 reset 會把目前分支指向指定的目標 commit；若省略目標，仍指向目前 HEAD。--hard 還會同步暫存區與工作檔。本關不需要，也禁止使用。'}
      ],
      situations:[
        {state:'只想讀第一版',goal:'顯示舊內容',method:'show',history:'不變'},
        {state:'假錯字尚未 commit',goal:'丟棄該修改',method:'restore',history:'不新增 commit'},
        {state:'錯誤已 commit、push',goal:'新增反向紀錄',method:'revert',history:'新增一筆 commit'},
        {state:'AI 提議 reset',goal:'先停下理解影響',method:'安全紅線',history:'可能改變本機分支歷史'}
      ],
      prompt:`請由你操作完成三個安全練習。我不輸入 Git 指令，只查看證據並回覆「開始」、「繼續」或「停」。

安全規則：
- 三段 Git 練習只能修改 notes.md；全部完成後，才另更新已被 .gitignore 排除的 WORKSHOP-RECEIPT.txt。
- 全程禁止 reset、rebase、force push；不得切換分支。
- 看到原有變更、非預期 diff、同步不一致、衝突或 push 被拒絕，立刻停下，不得自行清理或修復。

開始前：
1. 回報 repo 完整路徑與 origin 完整網址，確認分支是 main，而且 origin 是我帳號下的 research-practice-project；若名稱或擁有者不符就停下。
2. fetch origin 後，證明工作區乾淨，而且 HEAD 與 origin/main 相同；若不相同就停下。
3. 列出三段計畫，等我回覆「開始」。

第一段｜只查看舊版
- 記下目前分支與 HEAD；找出 notes.md 的第一個 commit，用 git show 只顯示該版內容。
- 證明分支、HEAD 與工作區都沒改變，停下等我回覆「繼續」。

第二段｜restore 未 commit 的假錯字
- 在 notes.md 最後加入「【練習錯字，尚未 commit】研就結果需再確認。」，不要 stage 或 commit。
- 顯示 notes.md 的 diff，確認沒有 staged 修改；說明 restore 只會丟掉這一行，停下。
- 我回覆「繼續」後才 restore notes.md。證明 diff 已消失、工作區乾淨，再停下等我回覆「繼續」。

第三段｜revert 已 push 的假錯誤
- 在 notes.md 最後加入「【練習錯誤結論】本研究證明相關等於因果。」，顯示 diff，停下等我確認。
- 我回覆「繼續」後，只 stage notes.md，顯示 staged diff，再建立「練習：加入錯誤結論」commit 並 push。回報 commit hash 與網址。
- 解釋 revert 會新增撤銷 commit，原錯誤 commit 仍留在歷史，然後停下。
- 我再次回覆「繼續」後，才 revert 該錯誤 commit 並 push。若發生衝突，立刻停止，不得自行選擇內容、commit 或 push。成功後 fetch origin，顯示最近四筆歷史、工作區乾淨、HEAD 與 origin/main 相同。

三段全部成功後，才在 WORKSHOP-RECEIPT.txt 記錄 P9 done。`,
      plan:['確認正確路徑、origin 是自己的 research-practice-project、分支是 main，以及 fetch 後工作區乾淨且 HEAD 與 origin/main 相同','只讀顯示 notes.md 第一版，證明分支、HEAD 與工作區未變','加入未提交假錯字；你核對唯一 diff 後才 restore','加入假錯誤；你核對後才 commit 並 push','解釋 revert；你放行後新增撤銷 commit、push 並驗證同步'],
      human:'你不用輸入指令。每個停點只核對：路徑、origin 網址與分支正確；第一段狀態沒變；restore 只移除指定假錯字；錯誤 commit 已保留；revert 是另一筆新 commit。證據不符就回覆「停」。',
      dashboard:'第一段狀態不變；restore 後工作區乾淨；最後歷史依序保留錯誤 commit 與 revert commit，main 和 origin/main 同步，收據顯示 P9 done。',
      behind:'git rev-parse --show-toplevel\ngit remote get-url origin\ngit branch --show-current\ngit fetch origin\ngit status --short --branch\ngit rev-parse HEAD\ngit rev-parse origin/main\ngit log --reverse --format=%H -- notes.md\ngit show <第一版commit>:notes.md\ngit rev-parse HEAD\ngit status --short --branch\ngit diff -- notes.md\ngit diff --cached -- notes.md\ngit restore -- notes.md\ngit diff -- notes.md\ngit status --short --branch\ngit diff -- notes.md\ngit add -- notes.md\ngit diff --cached -- notes.md\ngit commit -m "練習：加入錯誤結論"\ngit push origin main\ngit rev-parse HEAD\ngit revert --no-edit <錯誤commit>\ngit push origin main\ngit fetch origin\ngit log --oneline -4\ngit status --short --branch\ngit rev-parse HEAD\ngit rev-parse origin/main',
      rescue:'若開始前不乾淨或未同步、diff 不只包含指定假內容、分支改變、revert 衝突或 push 被拒絕，立即停止。只回報 repo、branch、status、log 與 diff；不得 restore 非預期內容、reset、rebase 或 force push。若錯誤 commit 已在遠端，明確提醒目前狀態且不要標記 P9 done；若 revert 衝突，不得 push，等你決定是否 abort。'
    },
    {
      id:'C1',phase:'collab',minutes:10,title:'兩人建立並連上配對 repo',
      why:'個人階段從零建立自己的專案；協作的共同 repo 也由你們自己建——教授擁有論文 repo、研究生受邀協作，權力結構跟真實研究一樣。',
      concept:'協作 repo 的骨架是三件事：放在其中一人帳號下的遠端 repo、對另一人發出的協作者邀請、以及各自 clone 回本機的完整副本。clone 會把檔案、commit 歷史與遠端連結一起帶下來，日後同步才用 pull。公開 repo 沒有寫入權限也能 clone，但要 push 修改必須先接受邀請，所以這一關的驗收重點是權限。',
      terms:[
        {term:'clone',meaning:'第一次把遠端 repo、全部 commit 歷史及遠端設定完整複製到電腦。'},
        {term:'協作者（collaborator）',meaning:'被 repo 擁有者邀請、可推送修改的成員；邀請要對方親自接受才生效。'},
        {term:'origin',meaning:'clone 後，Git 通常替原 GitHub repo 網址設定的預設名稱。'},
        {term:'寫入權限',meaning:'能 clone 不代表能 push；公開 repo 可讀，但推送修改仍須協作者權限。'}
      ],
      prompt:`請分成兩台電腦依序完成。開始前先跟夥伴互報 GitHub 帳號、講好組號。

指導教授的電腦（這一輪的教授擁有論文 repo）：
- 幫我建立一個公開 GitHub repo，名稱 thesis-pair-組號（把「組號」換成你們的，例如 thesis-pair-03）。裡面建兩個檔案：paper.md 要有「方法」與「文獻回顧」兩個標題、各放一句假內容；.gitignore 要排除 WORKSHOP-RECEIPT*.txt。commit 並 push 後，把我的夥伴加為可推送（push）的協作者——帳號用夥伴剛報給我的那個。完成後回報 repo 完整網址。

研究生這邊：
- 打開 github.com 右上角的通知（或信箱裡的邀請信），親自按 Accept invitation 接受邀請，回報你打開得了這個 repo。

然後兩人各自：
- 把教授回報的 owner/thesis-pair-組號 填進闖關頁上方的「配對 repo」欄位。
- 請 AI 把配對 repo {pairRepo} clone 到「文件」資料夾，回報 clone 後完整路徑；只查看目前分支、origin 與自己的 GitHub 寫入權限。
- 用目前使用的 AI 工具開啟這個新資料夾，讓闖關頁改連接這個剛 clone 的資料夾（不是第一階段那個），最後把組號與 repo 網址回報講師。`,
      plan:['互報 GitHub 帳號並決定組號','教授端：AI 建 repo、放 paper.md 與 .gitignore、發協作者邀請','研究生端：親自接受邀請','兩人把 owner/repo 填進闖關頁','各自 clone 到文件資料夾並回報完整路徑','核對 main、origin 與寫入權限','闖關頁改連新資料夾、組號與網址回報講師'],
      human:'教授確認 repo 名稱與邀請的帳號沒打錯；研究生親自按 Accept invitation；兩人都確認自己的權限是 WRITE 或更高，下一關才推得上去。',
      dashboard:'資料夾切換成功；HEAD 是 main；main 與 origin/main 同步；顯示正確配對資訊。',
      behind:'# 教授端：先在本機備好內容，再連同檔案一起建遠端 repo\nmkdir thesis-pair-組號\ncd thesis-pair-組號\n# 建立 paper.md（含「方法」「文獻回顧」兩個標題）與 .gitignore（排除 WORKSHOP-RECEIPT*.txt）\ngit init -b main\ngit add paper.md .gitignore\ngit commit -m "建立配對練習論文骨架"\ngh repo create thesis-pair-組號 --public --source=. --push\ngh api repos/{pairRepo}/collaborators/夥伴帳號 -X PUT -f permission=push\n\n# 研究生端：到 github.com 通知或信箱親自按 Accept invitation（這一步網頁做，沒有指令）\n\n# 兩人各自：\ngit clone https://github.com/{pairRepo}.git <文件資料夾中的目標路徑>\ngit -C <clone後完整路徑> status --short --branch\ngit -C <clone後完整路徑> remote -v\ngh repo view {pairRepo} --json viewerPermission,url,defaultBranchRef',
      rescue:'公開 repo 即使尚未接受邀請也能 clone，但 push 會被拒——先確認邀請已接受、登入的是自己的帳號；邀請信找不到時，直接打開 repo 網址也會出現接受邀請的提示。clone 失敗先核對網址與網路；若目標資料夾已存在，不要刪除或覆蓋，先回報內容再決定。整組卡超過五分鐘就舉手：講師會把你們兩人都加為示範 repo 的協作者（你們仍要親自接受邀請、確認權限是 WRITE），再 clone 那一個繼續走 C2——沒有 WRITE 權限，C2 的 push 一定會失敗。課後再補建自己的。'
    },
    {
      id:'C2',phase:'collab',minutes:8,title:'研究生開分支並提出修改',
      why:'研究生在自己的分支工作，正式版 main 不會被半成品直接蓋掉。',
      concept:'分支像從最新 main 拉出一張獨立草稿桌。你先 pull，是為了讓草稿從共同專案最新版開始；修改、commit 與 push 都留在個人分支，不會直接改正式版。PR 只是請對方審查與合併的提案，建立 PR 不代表內容已進入 main。',
      terms:[
        {term:'branch（分支）',meaning:'從某個 commit 分出的獨立工作線，讓半成品先不碰 main。'},
        {term:'pull --ff-only',meaning:'只接受直線式同步；如果本機與遠端已分岔就停下，不自行合併。'},
        {term:'push -u',meaning:'第一次推送新分支，並記住之後要與哪個遠端分支同步。'},
        {term:'Pull Request（PR）',meaning:'請另一人閱讀 diff、提出意見並決定是否合併的正式提案。'}
      ],
      prompt:'這一輪我是研究生。動工前先替我自我檢查三件事：①目前開啟的是配對 repo 的資料夾（不是第一階段那個）②gh auth status 登入的是我的帳號 ③目前在 main 而且工作區乾淨。哪一項不對就停下，說明怎麼修、等我同意再修。三項都過了才開始：以只允許快轉（--ff-only）的方式 pull 最新 main，接著開分支 {branch}。只修改 paper.md：在「方法」段落最後新增「本練習以公開模擬資料示範版本控制。」如果找不到「方法」段落就停下，不要自行改別處。先顯示 diff 並停下；我確認後，才把 paper.md 加入暫存區，再顯示 staged diff。等我再次確認後，才 commit、push 並建立 PR，說明改了什麼、為什麼改，並請指導教授特別確認新增句子的研究表述是否精確。確認 PR 網址可開啟後，在 {receipt} 記錄 C2 done。',
      plan:['自我檢查：資料夾、帳號、main 乾淨','以 --ff-only 同步 main','建立個人分支','在 paper.md 的「方法」段落新增指定練習句','顯示 diff 並等待確認','只暫存 paper.md 並顯示 staged diff','再次等待後 commit、push 並建立 PR','回報 PR 編號與網址'],
      human:'確認目前不在 main；逐行看完 diff；確認 staged diff 只有 paper.md；自己閱讀 PR 說明後才算完成。',
      dashboard:'HEAD 是 {branch}；分支已有 commit 並推到 origin；PR 已建立並等待另一人審查。',
      behind:'git rev-parse --show-toplevel\ngh auth status\ngit switch main\ngit status --short\ngit pull --ff-only origin main\ngit switch -c {branch}\ngit diff -- paper.md\ngit add paper.md\ngit diff --cached -- paper.md\ngit commit -m "<清楚說明為什麼修改>"\ngit push -u origin {branch}\ngh pr create --base main --head {branch} --title "<PR標題>" --body "<修改內容、原因、希望審查處>"',
      rescue:'若 main 不乾淨或 pull --ff-only 失敗，立刻停下，只查看 status 與 log；不要 reset、rebase 或 force push。若 push 顯示沒有權限，核對登入帳號與配對 repo 邀請。'
    },
    {
      id:'C3',phase:'collab',minutes:6,title:'指導教授逐行審查並要求修改',
      why:'PR 是「先看再收」的正式入口。教授要判斷內容，不是只看 AI 說完成。',
      concept:'PR 審查不是只看摘要或相信 AI，而是由你在 Files changed 核對每一行。一般留言只是提供意見；Request changes 會正式記錄「需要補改」，若 repo 有審查規則便會擋下合併；即使沒有技術門檻，本課也不得先 merge。你應指出檔案、行數與原因，讓要求清楚、可追蹤。',
      terms:[
        {term:'review（審查）',meaning:'由另一人閱讀實際差異，判斷內容是否適合進入正式版。'},
        {term:'Files changed',meaning:'GitHub 集中顯示該 PR 所有逐行差異的頁面。'},
        {term:'inline comment',meaning:'直接附在特定一行旁的意見，讓作者知道要改哪裡與原因。'},
        {term:'Request changes',meaning:'正式記錄這一輪需要補改；不同於只有留言、不做審查判定。'}
      ],
      prompt:'這一輪我是指導教授。請找到夥伴 {partner} 的正確 PR，回報 PR 編號與網址，並摘要它修改了哪些檔案與段落；不要替我留言、Request changes、核准或合併。我要自己打開 Files changed 逐行審查，針對新增句「本練習以公開模擬資料示範版本控制。」留下行內意見，要求把「示範版本控制」改成較精確的「示範可重現研究流程」，再選 Request changes。',
      plan:['核對 repo、作者、來源分支與 PR 編號','摘要實際變更','打開指定 PR 網址','由指導教授親自留下指定行內意見並選 Request changes'],
      human:'在 GitHub Files changed 親自核對差異；對指定新增句留下「改成示範可重現研究流程」的行內意見，再選 Request changes。',
      dashboard:'指定 PR 顯示 Changes requested；研究生要回到同一個 PR 補改。',
      behind:'gh pr list --repo {pairRepo} --state open\ngh pr view <PR-number> --repo {pairRepo} --web\ngh pr diff <PR-number> --repo {pairRepo}',
      rescue:'找不到 PR 時核對 repo、作者、來源分支與 PR 編號。PR 作者不得替自己的內容完成本課核准；若登入的是作者帳號，請停下並交給本輪指導教授。'
    },
    {
      id:'C4',phase:'collab',minutes:7,title:'研究生補改，教授核准並合併',
      why:'同一個 PR 可以持續更新。教授看的是最新一輪 diff，研究生不必重開 PR。',
      concept:'PR 連著原本的分支，所以研究生把補改 commit 推到同一分支後，原 PR 會自動更新，不必重開。教授要重新看最新 diff，再以 Approve 表示內容通過；merge 才是真正把成果放進 main。核准與合併是兩個不同決定，必須由你與夥伴拍板；AI 只能在放行後代操作。',
      terms:[
        {term:'Changes requested',meaning:'審查者已正式要求補改，原 PR 仍保留並等待更新。'},
        {term:'原分支',meaning:'建立 PR 時使用的來源分支；新 commit 推到這裡，原 PR 就會自動更新。'},
        {term:'Approve',meaning:'審查者表示最新內容可以接受；核准本身還沒有把內容放進 main。'},
        {term:'merge',meaning:'把已審查的 PR 成果真正合併進 main。'}
      ],
      prompt:`請分成兩台電腦依序完成，不要把兩個角色混在同一個帳號操作。

研究生的電腦：
- 確認正確 PR 編號，讀取行內意見並提出補改計畫；我同意後，才把「示範版本控制」改成「示範可重現研究流程」。
- 顯示新 diff，等我確認；再只暫存 paper.md、顯示 staged diff、commit 並 push 到原分支，讓同一個 PR 更新。
- 回報 PR 編號與網址後停下，把這兩項交給指導教授。

指導教授的電腦與 GitHub 帳號：
- 核對同一個 PR 編號、repo、作者與來源分支，重新閱讀最新 Files changed。
- 教授明確放行後，才對這個 PR 執行 Approve；核准後先停下。
- 說明 merge 會把什麼放進 main，等教授再次放行後，才合併同一個 PR。

成功合併後，研究生與指導教授才各自在自己電腦的收據記錄 C4 done；你的收據檔名是 {receipt}。`,
      plan:['鎖定正確 PR 編號並整理審查意見','提出補改計畫等待','修改並顯示新 diff','只暫存 paper.md 並顯示 staged diff','commit、push 到原分支','等待教授重新審查最新 diff','教授放行後核准指定 PR','再次放行後合併指定 PR'],
      human:'研究生確認補改內容與 staged diff；指導教授確認登入的是自己的帳號，重新閱讀最新 diff，分別對 Approve 與 merge 拍板。',
      dashboard:'同一個 PR 先更新新 commit，再由 Changes requested 轉為 Approved，最後顯示 Merged。',
      behind:'# 研究生：在原分支補改\ngit switch {branch}\ngit diff -- paper.md\ngit add paper.md\ngit diff --cached -- paper.md\ngit commit -m "<回應審查意見的補改說明>"\ngit push origin {branch}\n\n# 指導教授：針對指定 PR\ngh pr diff <PR-number> --repo {pairRepo}\ngh pr review <PR-number> --repo {pairRepo} --approve\ngh pr merge <PR-number> --repo {pairRepo} --merge',
      rescue:'若推送後 PR 沒更新，先核對是否推到原來源分支與正確 repo。若 repo 規則讓舊核准在新 commit 後失效，請教授重新閱讀最新 diff 再核准；不要跳過審查，也不要讓作者核准自己的 PR。'
    },
    {
      id:'C5',phase:'collab',minutes:4,title:'雙方回到 main 並同步',
      why:'GitHub 合併完成不代表兩台電腦已更新；雙方都要 pull 才看得到正式版。',
      concept:'GitHub 上的 PR 合併後，只改了遠端 main；你電腦裡的 main 不會自動更新。你要先確認沒有未提交修改，再切回 main 並 pull。你與夥伴都各自完成這一步，才算看到同一個正式版本；否則一台已更新，另一台仍停在舊歷史。',
      terms:[
        {term:'本機 main（local main）',meaning:'目前保存在你這台電腦上的 main。'},
        {term:'origin/main',meaning:'本機用來記錄 GitHub main 最新位置的遠端追蹤分支。'},
        {term:'pull --ff-only',meaning:'只有能直接快轉時才同步；若歷史分岔就停下，不自動合併。'},
        {term:'乾淨工作區（clean working tree）',meaning:'沒有尚未 commit 的修改，可以安全切換分支與同步。'}
      ],
      prompt:'先只查看工作區是否乾淨；若有未提交修改就停下。確認乾淨後，回到 main，以只允許快轉（--ff-only）的方式 pull 配對 repo 的最新 main，再告訴我剛才從 PR 合進來的是哪些內容。不要刪除任何分支，除非先問我。你與夥伴都各自在自己的電腦完成後，各自在自己的收據記錄 C5 done；你的收據檔名是 {receipt}。',
      plan:['確認工作區乾淨','切回 main','以 --ff-only 同步 origin/main','摘要剛合併的內容','兩人各自核對檔案','不自行刪除分支'],
      human:'你與夥伴都打開 paper.md，確認看到相同的合併後內容，並確認 main 與 origin/main 指向同一筆最新 commit。',
      dashboard:'HEAD 回到 main；本機 main 與 origin/main 同步；歷史顯示剛才的合併成果。',
      behind:'git status --short\ngit switch main\ngit pull --ff-only origin main\ngit log --oneline -4',
      rescue:'pull 前若有未提交修改，立刻停下，不要讓 AI 丟棄。若 --ff-only 失敗，先查看 status、branch 與 log 並請講師協助；不要 reset、rebase 或 force push。'
    },
    {
      id:'C6',phase:'collab',minutes:9,title:'交換角色，再走一次短流程',
      why:'你與夥伴都要體驗「提出修改」與「把關合併」兩邊，才知道日後如何帶研究生。',
      concept:'交換角色不是重複按按鈕，而是讓你同時體會作者與審查者的責任。新的研究生仍要從最新 main 開分支、看 diff、開 PR；新的教授仍要逐行審查後才能 Approve 與 merge。即使只是小改動，也不能自我核准或跳過另一人的判斷，最後雙方都要 pull。',
      terms:[
        {term:'author（作者）',meaning:'建立分支、修改內容並提出 PR 的人。'},
        {term:'reviewer（審查者）',meaning:'獨立閱讀 diff、提出意見並決定是否核准的人。'},
        {term:'self-approval（自我核准）',meaning:'作者核准自己的 PR；本課禁止，因為沒有形成另一人的把關。'},
        {term:'完整循環',meaning:'同步 main、分支修改、PR 審查、合併，再由雙方同步正式版。'}
      ],
      prompt:`現在交換角色，先確認新的研究生與新的指導教授是誰。

新研究生：
- 在新研究生自己的電腦，從乾淨且最新的 main 開分支 revise-literature-{tag}。
- 只修改 paper.md：在「文獻回顧」段落最後新增「【第二輪練習】相關文獻將於正式研究中補齊。」如果找不到該段落就停下。顯示 diff；commit 前停下等我確認。
- 確認後才 commit、push 並建立第二個 PR。回報 PR 編號與網址，然後停下。

新指導教授：
- 在自己的電腦與 GitHub 帳號開啟該 PR 編號，核對 repo、作者與來源分支。
- 親自看最新 Files changed，確認後才針對該編號 Approve。
- AI 說明 merge 會把什麼放進 main，再次等教授放行後，才合併同一個 PR 編號。

最後你與夥伴都回到 main，以只允許快轉（--ff-only）的方式 pull 並核對內容。每一個人為決定都要停下；全部完成後，各自在自己的收據記錄 C6 done；你的收據檔名是 {receipt}。`,
      plan:['確認交換後的角色','雙方同步最新 main','新研究生開短分支並新增指定練習句','顯示 diff 等待確認','commit、push 並開第二個 PR','回報 PR 編號與網址後停下','新教授核對同一個 PR 的 repo、作者與來源分支','逐行審查並核准指定 PR','再次放行後合併指定 PR','雙方以 --ff-only pull 並核對'],
      human:'確認兩人真的交換角色；第二輪仍要看 diff、交接明確 PR 編號、由另一人審查，並分別對該編號的 Approve 與 merge 拍板。',
      dashboard:'你與夥伴都完成過研究生與指導教授角色；第二個 PR 顯示 Merged；雙方 main 與 origin/main 同步。',
      behind:'流程示意（不是一條可以直接輸入的指令）：\n研究生：main 同步 → 開新分支 → 小修改 → diff → commit → push → 開 PR → 回報 PR 編號與網址 → 停下\n指導教授：核對同一個 PR 編號、repo、作者、來源分支 → Files changed → review → Approve 指定 PR → merge 指定 PR\n雙方：切回 main → pull --ff-only → 核對最新內容',
      rescue:'時間不足時讓第二輪只改一小句，但不能省略另一人閱讀 diff、核准與合併前的兩次決定。任何一步發現帳號、repo、分支或 PR 編號不對，都先停下查看，不要 reset 或 force push。'
    }
  ];

  const resetGuide={
    title:'安全補充｜看懂 AI 提出的 reset（本課不執行）',
    intro:'P9 實際使用的是 show、restore 與 revert。reset 會牽動目前分支、暫存區與工作區，因此本課只學會辨識影響，不實際執行。看到 AI 提出 reset，先不要放行。',
    syntax:'git reset [--soft | --mixed | --hard] [<commit>]',
    syntaxNote:'這是本課只拆解三種常見「以 commit 為目標」模式的簡化語法，不是 git reset 的完整語法。Git 還有指定檔案、--patch、--merge、--keep 等其他形式。',
    symbols:[
      {term:'git',meaning:'使用 Git 工具。'},
      {term:'reset',meaning:'在這個簡化用法中，把目前分支或 HEAD 指向目標 commit，再依模式決定是否同步暫存區與工作區。'},
      {term:'--',meaning:'兩個連字號。接在 soft、mixed、hard 前面時是長選項的一部分；單獨出現在 git restore -- notes.md 時，則用來分隔選項與檔案路徑。'},
      {term:'[ ]',meaning:'說明文件表示這一段可以省略；方括號不要輸入。'},
      {term:'|',meaning:'三種模式擇一；直線不要輸入。'},
      {term:'< >',meaning:'裡面要換成實際內容；尖括號不要輸入。'},
      {term:'<commit>',meaning:'目標 commit，可用 commit ID、tag、分支名稱或 HEAD~1；省略時預設為 HEAD。'}
    ],
    layers:[
      {term:'HEAD',meaning:'你目前所在的 commit；通常是目前分支的最新 commit，不包含尚未 commit 的修改。'},
      {term:'HEAD~1',meaning:'HEAD 的第一個父 commit；在線性歷史可先理解成上一版，遇到 merge 時不是按時間排序的上一筆。'},
      {term:'commit ID／hash',meaning:'某筆 commit 的識別碼；hash 的台灣用語是「雜湊值」，畫面常顯示不會混淆的短寫。'},
      {term:'index／暫存區',meaning:'下一次 commit 預計保存的內容快照；同一檔案在暫存區與工作區的內容可能不同。'},
      {term:'working tree／工作區',meaning:'你目前實際看得到、正在編輯的檔案，也常稱 working directory。'},
      {term:'untracked／未追蹤',meaning:'目前不在暫存區（index），所以 Git 現在沒有追蹤的工作區路徑；預設 git diff 不會列出它。'}
    ],
    modes:[
      {mode:'--soft',head:'移到目標 commit',index:'保持原樣',work:'保持原樣',risk:'檔案不會立刻消失，但指定舊 commit 時仍會移動本機歷史位置。'},
      {mode:'--mixed（預設）',head:'移到目標 commit',index:'改成目標內容',work:'保持原樣',risk:'原本 staged 的差異通常會變回 unstaged，不是把暫存區清空。'},
      {mode:'--hard',head:'移到目標 commit',index:'改成目標內容',work:'已追蹤檔案改成目標內容',risk:'已暫存與未暫存但尚未 commit 的已追蹤修改會被覆蓋；目標 commit 沒有的已追蹤路徑會從工作區移除。'}
    ],
    notes:[
      '若省略 <commit>，目標就是目前 HEAD，所以分支指向值不變；若省略模式，預設是 --mixed。',
      'reset --hard 不會固定刪除所有未追蹤檔案；但未追蹤路徑若阻擋 Git 寫入目標版本，仍可能被移除，不能把未追蹤檔當成安全備份。',
      'soft 與 mixed 指定舊 commit 時也會移動本機歷史；hard 的額外風險，是立即覆蓋暫存區與已追蹤工作檔。'
    ],
    examples:[
      {command:'git reset --hard',meaning:'沒有寫目標，所以目標是 HEAD。分支不會往前或往後移動，但暫存區與已追蹤工作檔會對齊 HEAD；尚未 commit 的相關修改會失去。'},
      {command:'git reset --hard HEAD~1',meaning:'目前分支移到 HEAD 的第一個父 commit，暫存區與已追蹤工作檔也一起對齊。原本最新 commit 不再由目前分支指向。'}
    ],
    warning:'reset 本身不會直接修改 GitHub；但把分支移回舊 commit 後再 force push，會改寫共享的遠端歷史。看到任何 reset 舊 commit、rebase 或 force push 提案，都先停下。',
    questions:['完整指令是什麼？','目標 commit 是哪一筆？','模式是哪一種？','哪些 staged 或未提交修改會改變或消失？','這段歷史是否已 push 或與別人共享？','能否改用 show、restore 或 revert？']
  };

  const troubleshooting=[
    ['AI 在錯的資料夾工作','先只問完整路徑與 git status；不要修。重新用目前使用的 AI 工具開啟正確資料夾。'],
    ['Dashboard 讀不到資料夾','Chrome／Edge 重新選取最外層專案資料夾；Safari／Firefox 改用每關的 AI 驗收句。'],
    ['修改後 diff 是空的','先存檔，再確認 AI 工具與闖關頁指向同一資料夾。'],
    ['commit 成功但 GitHub 看不到','commit 只在本機；確認是否真的 push，以及 remote URL 是否正確。'],
    ['push 被拒絕','請 AI fetch 並解釋差異；通常要先 pull。禁止 force push。'],
    ['找不到配對 repo 或無權限','打開 GitHub invitations 接受邀請，並核對 pair 編號與登入帳號。'],
    ['PR 無法合併','查看是否仍有 Request changes、是否需要重新核准最新 push、是否有未解決對話。'],
    ['不小心在 main 修改','先保留現況、只看 status/diff；請 AI 說明安全搬到新分支的計畫，禁止 reset、rebase 或 force push。'],
    ['restore／revert 分不清楚','未 commit 的修改才用 restore；已 commit 的錯誤用 revert；不確定時先只查看。'],
    ['懷疑上傳了敏感資料','立刻停止 push；確認是否已進 commit／遠端。若已公開，先撤換密碼或存取物並請講師處理。']
  ];

  const reference=[
    ['開始管理資料夾','幫我替這個資料夾加上版本控制，先說明計畫，等我同意再做。'],
    ['看目前狀態','這個專案現在乾不乾淨？有哪些修改還沒存成版本？'],
    ['看修改','把還沒提交的修改逐行列出來，用白話解釋。'],
    ['存成版本','先列出會收進去的檔案；我確認後再 commit，說明寫……'],
    ['放上 GitHub','確認 remote 與分支後 push，完成後給我網址。'],
    ['同步別人的修改','先查看本機與遠端狀態，再安全 pull；遇到衝突先停下回報。'],
    ['查看歷史','列出最近的版本，摘要誰在何時為什麼改。'],
    ['比較兩版','比較這兩個版本，逐檔說明增加、刪除與修改。'],
    ['只看舊版','只顯示舊版內容，不切換分支、不改現在檔案。'],
    ['丟棄未提交修改','先告訴我會永久失去什麼，等我確認再 restore。'],
    ['撤銷已推送版本','用 revert 保留歷史，不准 reset 或 force push。'],
    ['建立 PR','把分支 push 後開 PR，說明改了什麼、為什麼改、請對方看哪裡。']
  ];

  // 教材〈陸〉的 12 句日常用語（情境式；任務式速查在上面的 reference，兩張互補）
  const phrases=[
    ["幫我把這個資料夾管起來，以後改了都有紀錄","建立版本庫、寫好 .gitignore、做第一次提交","repository、.gitignore、commit"],
    ["今天改的先存起來，註明是改了文獻回顧","把今天的修改打包成一個提交，寫上你給的說明","commit"],
    ["我今天到底動了哪些地方？列給我看","把還沒存檔的修改逐行列出來","diff"],
    ["上個月我們第三節改了什麼？","翻歷史，挑出動到第三節的提交，摘要給你","log、diff"],
    ["先不要動。我改壞了；請先查這些修改是否已 commit 或 push，顯示差異，再告訴我安全做法","先只查看：未 commit 才考慮 restore；已 commit／push 則考慮 revert；不會直接 reset","show、restore、revert（先判斷狀態）"],
    ["把最新的放上 GitHub","先拉取遠端的新東西，再把你的提交推上去","pull、push（remote）"],
    ["我同事給我一個網址，幫我抓下來看看","clone 到你電腦，順便瀏覽專案結構報給你","clone"],
    ["我想試著改成 panel data 的設定，但現在這版不准動","開一條分支，在分支上改","branch"],
    ["試的那版不錯，併回正式版吧","執行合併；有衝突就列出來，請你決定留哪邊","merge（conflict）"],
    ["請共同作者看過我的修改再合進去","推上 GitHub、開一個 Pull Request、附修改摘要","push、Pull Request"],
    ["先不要上傳這幾個資料檔；請查它們是否已被追蹤或 commit，再告訴我安全處理方式","先只查狀態；未追蹤檔才用 .gitignore 排除。若已進歷史或含敏感資料，立即停下另行處理",".gitignore（不是保密工具）"],
    ["等等，先停下來。告訴我你剛剛做了什麼、現在專案是什麼狀態","立刻停手，報告最近的動作、目前檔案與分支狀態，等你下一步指示","救援句——監督三原則的隨身版，任何時候都能喊"]
  ];

  window.WORKSHOP_FLOW={
    version:'2026-08-05-v5.5',
    phases,steps,resetGuide,troubleshooting,reference,phrases,
    byId:id=>steps.find(s=>s.id===id),
    phaseSteps:id=>steps.filter(s=>s.phase===id)
  };
})();
