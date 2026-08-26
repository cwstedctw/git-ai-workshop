/* workflow-data.en.js — English display layer for workflow-data.js.
   Load it AFTER workflow-data.js. It mutates window.WORKSHOP_FLOW in place, so the
   byId() and phaseSteps() closures inside the shared file stay valid. Only values are
   replaced: no key name is added or dropped, and id, phase and minutes are left alone.
   The step strings come from the reviewed English overlay in quest.en.html.
   If anything differs from the Chinese original, the Chinese original governs. */
(function(){
  var flow = window.WORKSHOP_FLOW;
  if(!flow) return;

  /* ── phases ── */
  var PHASES = {
    personal: {
      label: `Stage 1 | Your own research project`,
      promise: `Start from a plain folder and go through two edits, two saved versions and two uploads, then learn how to undo safely.`
    },
    collab: {
      label: `Stage 2 | Graduate student × advisor`,
      promise: `The two of you take turns proposing changes and reviewing them, going right through a PR, a request for changes, approval, merge and sync. On a shared main you never rewrite history with reset, rebase or force push.`
    }
  };

  /* ── the 15 steps ── */
  var STEPS = {
    P1: {
      title: `Open and confirm your working folder`,
      why: `Git manages one folder. Make sure the AI, the handbook and you are all looking at the same place, so the repo does not end up in the wrong spot later.`,
      concept: `Git does not manage your whole computer; its scope is the folder that is open right now. If the AI is standing in the wrong path, then even a perfectly correct operation can end up reading or changing a different project. So the first move is a read-only check of the full path, the files in the root folder and the Git state, which draws a safe boundary around everything that follows.`,
      terms: [
        { term: `working folder`, meaning: `The project folder you have open right now and are about to let the AI work in.` },
        { term: `full path`, meaning: `The folder's complete address on your computer, which rules out folders that share a name.` },
        { term: `root folder`, meaning: `The top level of this project — not the root of your whole hard drive.` },
        { term: `repository (repo)`, meaning: `The project folder plus the history of changes that Git keeps for it.` }
      ],
      prompt: `I have opened this practice folder. Please only look: tell me the full path you are working in, what files are inside, and whether this is a Git repo yet. Do not change anything for now.`,
      plan: [
        `Report the full path`,
        `List the files in the root folder`,
        `Check whether Git is already set up`,
        `Change no files`
      ],
      human: `Check the folder name the AI reports, and connect this quest page to the same folder.`,
      dashboard: `The folder name is right; Git shows "Not yet"; commits are 0.`,
      behind: `pwd / Get-Location
ls / Get-ChildItem
git status`,
      rescue: `If the path the AI reports is not the folder you just created, stop right there and reopen the correct folder in the AI tool you are using (the three clicks for changing folders are in the P1 figure in the handbook). If Git is not set up yet, "not a git repository" from git status is exactly what this step expects — do not rush to fix it.`,
      figure: {
        src: `img/ag-open-folder.png`,
        alt: `Illustration: the three steps for changing folder in Antigravity — click the folder name on the very top line, choose Open Folder, pick the new folder`,
        caption: `Illustration. Changing folder in Antigravity takes just these three clicks: <strong>click the folder name on the very top line → Open Folder → choose the folder you have just created</strong>.`
      }
    },

    P2: {
      title: `Add version control and connect to GitHub`,
      why: `Version control first builds a history ledger on your own machine, then links that same history to GitHub. Everything in class is fake data, so we use a public practice repo — that way the instructor can come and rescue you.`,
      concept: `Git and GitHub are two layers: Git builds the version history on your own machine, and GitHub keeps a remote copy you can connect to. This step first creates the local repository and then connects it to origin; .gitignore keeps out the files that should never enter the history in the first place. The class works with public fake data — for real research data or student data, use a private repo instead.`,
      terms: [
        { term: `Git / GitHub`, meaning: `Git is the version tool on your own machine; GitHub is the web service that hosts remote repositories and collaboration.` },
        { term: `main`, meaning: `The official main line of versions this course works on.` },
        { term: `remote / origin`, meaning: `A remote is a repository kept somewhere else; origin is the usual name your machine gives to the main remote address.` },
        { term: `.gitignore`, meaning: `Names which untracked files should stay out of version control. It does not protect anything already committed, and it is not a secrecy tool.` }
      ],
      prompt: `I want to put this folder under Git version control: create a suitable .gitignore (please exclude WORKSHOP-RECEIPT*.txt), then create a .gitattributes holding just one line, * text=auto eol=lf (this keeps line endings consistent and cuts down the line-ending warnings later), and create a public practice repo on my GitHub called research-practice-project. First list your plan, what you expect to create or change, and the data-safety check you will run before anything goes public; wait for me to agree before you run it.`,
      plan: [
        `Confirm the working path once more`,
        `Check for sensitive data`,
        `Set up Git, a .gitignore (excluding the class receipt) and a .gitattributes (to keep line endings consistent)`,
        `Create a public GitHub repo`,
        `Set up origin`,
        `Report the repo URL`
      ],
      human: `Confirm the path, confirm it is going public, and confirm all the data is fake — then say clearly, "go ahead".`,
      dashboard: `Git is set up; the branch is main; the remote is connected; the history can still be 0.`,
      behind: `git init
git branch -M main
# create .gitattributes holding one line: * text=auto eol=lf
gh repo create research-practice-project --public --source=.
git remote -v`,
      rescue: `If the GitHub login fails, ask the AI to run gh auth status first; do not switch to force anything, and never hand your password to the AI. If creating the repo reports that the name is taken (Name already exists), you already have a repo with that name — very common when a self-learner runs through this a second time: use a new name such as research-practice-project-2, or make sure you really do not need the old one before you touch it. Do not rush to delete anything.`
    },

    P3: {
      title: `Create your first research note`,
      why: `Start with a small, readable plain-text file, so you can see clearly what a "new file" looks like to Git.`,
      concept: `notes.md is a plain-text file, so Git can compare it line by line. You do not commit it straight away, because that lets you watch the untracked state: the file exists and Git can see it, but it has not been taken into any version yet. Learning to read status first is what lets you decide which content is worth saving as a version.`,
      terms: [
        { term: `Markdown (.md)`, meaning: `An easy-to-read plain-text format that Git can compare line by line.` },
        { term: `untracked`, meaning: `The file exists, but it has never been taken into any commit.` },
        { term: `working area`, meaning: `The state of the files you can actually see and are editing right now.` },
        { term: `status`, meaning: `Git's report on where things stand; looking at it changes nothing and saves nothing.` }
      ],
      prompt: `Please create notes.md with three lines of made-up research notes, one of which says "The coefficient in Table 2 is currently 0.98". Do not commit yet; when you are done, just tell me in plain words which new files or changes Git can see now.`,
      plan: [
        `Create notes.md and nothing else`,
        `Use no real data`,
        `Do not commit`,
        `Report the Git state`
      ],
      human: `Open notes.md and check that it is simple, with no personal data and no real research data.`,
      dashboard: `notes.md appears in the file list; the project shows content that has not been committed.`,
      behind: `git status --short`,
      rescue: `If status does not show notes.md, first check that the file has been saved, and that you are not in the wrong folder.`
    },

    P4: {
      title: `Look at your first version carefully, then save it as a commit`,
      why: `Before you commit, look at what this version is actually going to take in. This is your first gate for supervising the AI.`,
      concept: `Saving a version in Git happens in three layers: the working area is the files as they are now, the staging area is the content lined up for the next version, and the commit is the official save point. git add only puts content into the staging area — that is neither a commit nor an upload. The staged diff is your last line-by-line check before the commit.`,
      terms: [
        { term: `git add`, meaning: `Puts the content you name into the staging area; no version has been created yet, and nothing has been uploaded.` },
        { term: `staging area (index)`, meaning: `The snapshot of the project lined up for the next commit.` },
        { term: `staged diff`, meaning: `A line-by-line look at what the staging area is about to take into the commit.` },
        { term: `commit`, meaning: `A snapshot of the project on your own machine, with a time and an explanation attached.` }
      ],
      prompt: `Please list the files and the content differences that would go into the first commit, and do not commit yet. After I confirm, save it as the first version with the message "Create first version of research notes". Finally, record P4 done in WORKSHOP-RECEIPT.txt.`,
      plan: [
        `List the files that will be taken in`,
        `Show the staged diff`,
        `Wait for confirmation`,
        `Make the first commit`,
        `Write the receipt`
      ],
      human: `Check the files one by one; if you see a file that does not belong, call a stop.`,
      dashboard: `The commit count becomes 1; the working folder is clean.`,
      behind: `git add .gitattributes .gitignore notes.md
git diff --cached
git commit -m "Create first version of research notes"`,
      rescue: `If the AI adds the whole folder, ask it to list the files first, take out anything that does not belong, and show the staged diff again.`
    },

    P5: {
      title: `Push to GitHub for the first time`,
      why: `A commit only exists on this computer; push is what sends the version to GitHub.`,
      concept: `A commit only keeps the snapshot on your own machine; push is what sends commits to GitHub. A successful push does not mean everything in front of you is backed up — changes that have not been committed are not uploaded. The two sides are in sync only when your local main and origin/main point at the same latest commit.`,
      terms: [
        { term: `push`, meaning: `Sends the commits your machine already has to the remote; it does not upload changes that have not been committed.` },
        { term: `origin/main`, meaning: `The state of the remote main as your machine last recorded it.` },
        { term: `in sync`, meaning: `Your local main and the main on GitHub point at the same latest commit.` }
      ],
      prompt: `Push the current main to GitHub, and when it is done give me the repo link and the link to the latest commit — I want to open them myself and check. Finally, record P5 done in WORKSHOP-RECEIPT.txt.`,
      plan: [
        `Confirm the remote and the branch`,
        `Push main`,
        `Report the URL`,
        `Do not rewrite the remote history`
      ],
      human: `Open GitHub yourself and check that both notes.md and the first commit are there.`,
      dashboard: `Your machine is in sync with origin/main; the cloud status turns green.`,
      behind: `git push -u origin main`,
      rescue: `If the push is rejected, ask the AI to fetch first and explain the difference between your machine and the remote. Never force push.`
    },

    P6: {
      title: `Let the AI make a small edit, then read the diff`,
      why: `The AI can make the edit for you, but you still read its plan first, and then use the diff to confirm that what it actually changed matches that plan.`,
      concept: `The AI saying it is done is only a report; the diff is the actual evidence. A red minus sign means old content was removed and a green plus sign means new content was added — neither of them says the content is right or wrong. What you check is whether the files touched, the removed lines and the added lines all match the plan you agreed to.`,
      terms: [
        { term: `diff`, meaning: `Compares two states line by line and lists what was added, removed and changed.` },
        { term: `red minus sign (-)`, meaning: `This line was there before the edit and has now been removed; that does not mean the content was wrong.` },
        { term: `green plus sign (+)`, meaning: `This line appears after the edit; that does not mean the content is right.` },
        { term: `uncommitted`, meaning: `The change is still in the working area or the staging area and has not become a commit.` }
      ],
      prompt: `First explain how you plan to change notes.md. After I agree, change the sample number 0.98 to 0.96 and add one more line of made-up research note. Then list the diff line by line and explain the red minus signs and the green plus signs in plain words; do not commit yet. Finally, record P6 done in WORKSHOP-RECEIPT.txt.`,
      plan: [
        `Explain which parts of notes.md will change, and nothing else`,
        `Wait for me to agree`,
        `Make the small edit`,
        `Show the diff line by line and explain it`,
        `Do not commit`,
        `Write the receipt`
      ],
      human: `Before the edit, check that the plan only touches notes.md; after the edit, check that the old number was removed, the new number and the new note were added, and nothing else changed.`,
      dashboard: `Changes that have not been committed are showing; the commit count is still 1.`,
      behind: `git diff -- notes.md`,
      rescue: `If the diff is empty, first check whether the AI really made the change and saved it. If you see other files, stop right there and make sure your AI tool and this quest page are using the same folder.`
    },

    P7: {
      title: `A second commit and push`,
      why: `Going round the full cycle a second time is what turns version control into a habit: edit, look, save, push.`,
      concept: `The everyday version cycle is edit, read the diff, put it in the staging area, commit, push. A commit message should say why you changed it, not just repeat the file name. The receipt in this course only records quest progress; .gitignore keeps it on your own machine, and it should never get mixed into a research version or pushed to GitHub.`,
      terms: [
        { term: `commit message`, meaning: `The explanation attached to a save point; it should let the future you see what changed and why.` },
        { term: `local history`, meaning: `The commits that so far exist only in the repository on this computer.` },
        { term: `remote history`, meaning: `The commits that a push has sent to GitHub.` },
        { term: `WORKSHOP-RECEIPT`, meaning: `Your local record of quest progress; .gitignore excludes it, and it is never added to a commit.` }
      ],
      prompt: `That diff was correct. Please save only this change to notes.md as the second version, with the commit message "Correct the coefficient and add a research note", then push main to GitHub. Only after you have confirmed that local main and origin/main are in sync, record P7 done in WORKSHOP-RECEIPT.txt; do not include the receipt in the commit.`,
      plan: [
        `List every staged file — the result must be notes.md and nothing else`,
        `Show the staged diff for notes.md and check the commit message`,
        `Make the second commit`,
        `Push main and verify that the remote is in sync`,
        `Write the P7 receipt once that is done; the receipt is not added to the commit`
      ],
      human: `Check that the commit message explains why the change was made, and open GitHub again to see the latest version.`,
      dashboard: `At least 2 commits; your machine is in sync with GitHub; a second node appears in the history.`,
      behind: `git add notes.md
git diff --cached --name-only
git diff --cached -- notes.md
git commit -m "Correct the coefficient and add a research note"
git push origin main
git status --short --branch`,
      rescue: `If you cannot see the second version on GitHub, work out first whether it has not been committed yet, or whether it has been committed but not pushed.`
    },

    P8: {
      title: `Read the history and compare two versions`,
      why: `The value of Git is not only that it stores things — it can answer which version, who changed it, and what they changed.`,
      concept: `log answers which save points exist, when they were made and why they changed; the diff between two commits answers which lines actually changed. Every commit carries a hash you can identify it by. Reading the history moves neither HEAD nor notes.md; writing the receipt is a separate action, allowed only once the read-only check is finished.`,
      terms: [
        { term: `log`, meaning: `Lists the commit history in time order.` },
        { term: `hash`, meaning: `The identifier Git gives each commit; the screen usually shows only the first few characters.` },
        { term: `HEAD`, meaning: `Points at the commit you are on right now; it does not include changes that have not been committed.` },
        { term: `HEAD~1`, meaning: `The first parent of HEAD; in the straight-line history of this course, simply the previous commit.` }
      ],
      prompt: `Please list the two most recent commits that changed notes.md and summarise each version in plain words; then compare notes.md between those two commits. While comparing, only look at the Git history and notes.md — do not switch branches, and do not change notes.md or the Git state. Show me the evidence that we are still on main and that the working tree has not changed. Once that read-only check is done, the only thing you may write to is WORKSHOP-RECEIPT.txt: record P8 done there; do not stage the receipt and do not commit it.`,
      plan: [
        `Record the branch, HEAD and working-area state you start from`,
        `List the two most recent commits for notes.md with their hashes`,
        `Compare the older commit with the newer one`,
        `Show again that the branch, HEAD and working area have not changed`,
        `Write the P8 receipt once the read-only check is done; the receipt is not added to Git`
      ],
      human: `Check that the AI did not switch versions or change notes.md; after the read-only check, the only thing added is the local receipt, which is ignored by Git.`,
      dashboard: `The history still has two or more nodes; the current branch is still main; nothing new has changed in the project.`,
      behind: `git status --short --branch
git rev-parse HEAD
git log --format="%H %s" -2 -- notes.md
# replace the placeholders on the next line with the two real hashes listed above
git diff <older-commit> <newer-commit> -- notes.md
git rev-parse HEAD
git status --short --branch`,
      rescue: `If the history has fewer than two entries, go back to P7 and check whether the second commit really succeeded.`
    },

    P9: {
      title: `Three things that look like "going back": just look, restore, revert`,
      why: `"Going back" is not one action. Sometimes you only need to look at the old content; a mistake that has not been committed can be thrown away; a mistake that is already published needs an undo that stays in the record. Telling these states apart is how you stop the AI from using the wrong method.`,
      concept: `These three actions deal with different states: show only reads an old commit and changes nothing about where you are; restore puts a working file that has not been committed back, and anything unsaved in it disappears; revert adds an undo commit for a mistake that is already published, and the original record stays. reset can point the branch somewhere else, and --hard also overwrites the staging area and your working files; this step does not use reset at all.`,
      terms: [
        { term: `show | read an old version only`, meaning: `git show <commit>:notes.md reads the file straight out of that commit. It does not switch versions, and it changes neither HEAD, nor the staging area, nor your working files.` },
        { term: `restore | throw away changes that have not been committed`, meaning: `git restore -- notes.md overwrites the working file with the content of the staging area by default. This step starts from a clean state, so the staging area matches HEAD, and the practice typo that was never committed disappears.` },
        { term: `revert | undo a version that is already published`, meaning: `Running revert on an ordinary commit adds a new commit that makes the opposite change; the original mistaken commit stays in the history. If the content overlaps, you can hit a conflict.` },
        { term: `reset | point the branch at another version`, meaning: `In its commit form, reset moves the current branch to the target commit you name; leave the target out and it still points at the current HEAD. --hard also lines the staging area and your working files up with it. This step does not need reset, and does not allow it.` }
      ],
      situations: [
        { state: `You only want to read the first version`, goal: `Show the old content`, method: `show`, history: `Unchanged` },
        { state: `The practice typo has not been committed`, goal: `Throw that change away`, method: `restore`, history: `No new commit` },
        { state: `The mistake is already committed and pushed`, goal: `Add a record that reverses it`, method: `revert`, history: `One new commit` },
        { state: `The AI proposes a reset`, goal: `Stop first and understand the effect`, method: `safety red line`, history: `Can change your local branch history` }
      ],
      prompt: `Please carry out three safe exercises yourself. I will not type any Git commands; I will only look at the evidence and reply "start", "continue" or "stop".

Safety rules:
- The three Git exercises may only change notes.md; only when all of them are finished may you also update WORKSHOP-RECEIPT.txt, which .gitignore already excludes.
- No reset, rebase or force push at any point; do not switch branches.
- If you see changes that were already there, an unexpected diff, things out of sync, a conflict or a rejected push, stop immediately — do not clean up or repair anything on your own.

Before you start:
1. Report the full repo path and the full origin URL; confirm the branch is main, and that origin is the practice repo under my account that I created in P2 (called research-practice-project by default, or whatever I actually named it). If the owner is not me, or it is not today's practice repo, stop.
2. After fetching origin, show that the working tree is clean and that HEAD matches origin/main; if they differ, stop.
3. List the plan for all three parts and wait for me to reply "start".

Part 1 | Just look at an old version
- Note the current branch and HEAD; find the first commit for notes.md and use git show to display only that version's content.
- Show that the branch, HEAD and working tree are all unchanged, then stop and wait for me to reply "continue".

Part 2 | restore a practice typo that has not been committed
- Add the line "[practice typo, not committed] The reuslts need to be confirmed again." at the end of notes.md; do not stage it and do not commit it.
- Show the diff for notes.md, confirm there are no staged changes, explain that restore will only throw away this one line, and stop.
- Only after I reply "continue", restore notes.md. Show that the diff is gone and the working tree is clean, then stop and wait for me to reply "continue".

Part 3 | revert a mistake that has already been pushed
- Add the line "[practice mistake] This study proves that correlation equals causation." at the end of notes.md, show the diff, and stop for me to confirm.
- After I reply "continue", stage only notes.md, show the staged diff, then make a commit called "Practice: add a wrong conclusion" and push it. Report the commit hash and the link.
- Explain that revert adds a new undo commit and that the original mistaken commit stays in the history, then stop.
- Only after I reply "continue" again, revert that mistaken commit and push. If there is a conflict, stop immediately — do not choose content, commit or push on your own. Once it succeeds, fetch origin and show the last four history entries, a clean working tree, and HEAD matching origin/main.

Only when all three parts have succeeded, record P9 done in WORKSHOP-RECEIPT.txt.`,
      plan: [
        `Confirm the correct path, that origin is the practice repo you created in P2, that the branch is main, and that after a fetch the working area is clean and HEAD matches origin/main`,
        `Show the first version of notes.md read-only, and prove that the branch, HEAD and working area have not changed`,
        `Add an uncommitted practice typo; restore it only after you have checked that it is the only diff`,
        `Add a practice mistake; commit and push only after you have checked it`,
        `Explain revert; once you give the go-ahead, add the undo commit, push, and verify that both sides are in sync`
      ],
      human: `You do not type any commands. At each stopping point, just check: the path, origin URL and branch are right; nothing changed in Part 1; restore removed only the practice typo line; the mistaken commit is still there; the revert is a separate new commit. If the evidence does not match, reply "stop".`,
      dashboard: `Nothing changes in Part 1; the working tree is clean after restore; at the end the history keeps both the mistaken commit and the revert commit in order, main and origin/main are in sync, and the receipt shows P9 done.`,
      behind: `git rev-parse --show-toplevel
git remote get-url origin
git branch --show-current
git fetch origin
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
git log --reverse --format=%H -- notes.md
git show <first-version-commit>:notes.md
git rev-parse HEAD
git status --short --branch
git diff -- notes.md
git diff --cached -- notes.md
git restore -- notes.md
git diff -- notes.md
git status --short --branch
git diff -- notes.md
git add -- notes.md
git diff --cached -- notes.md
git commit -m "Practice: add a wrong conclusion"
git push origin main
git rev-parse HEAD
git revert --no-edit <mistaken-commit>
git push origin main
git fetch origin
git log --oneline -4
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main`,
      rescue: `Stop at once if things are not clean or not in sync before you start, if the diff holds more than the practice lines, if the branch changes, if the revert conflicts, or if the push is rejected. Report only the repo, branch, status, log and diff; do not restore anything unexpected, and do not reset, rebase or force push. If the mistaken commit is already on the remote, say clearly where things stand and do not mark P9 done; if the revert conflicts, do not push — wait for you to decide whether to abort.`
    },

    C1: {
      title: `The two of you create and connect to the paired repo`,
      why: `In the solo stage you built your own project from nothing; you build the shared repo yourselves too — the advisor owns the thesis repo and the graduate student is invited in as a collaborator, the same power structure as in real research.`,
      concept: `The skeleton of a shared repo is three things: a remote repo under one person's account, a collaborator invitation sent to the other person, and a local working copy on each of your machines. Whoever creates the repo (the advisor role this round) already has one on their machine — only the other person needs to clone. A clone brings the files, the commit history and the remote link down together; after that, pull is what keeps you in sync. A public repo can be cloned without write permission, but pushing a change means the invitation has to be accepted first, which is why permission is what this step really checks.`,
      terms: [
        { term: `clone`, meaning: `The first copy: it brings the remote repo, all of its commit history and the remote settings onto your computer.` },
        { term: `collaborator`, meaning: `Someone the repo owner has invited who can push changes; the invitation only counts once that person accepts it themselves.` },
        { term: `origin`, meaning: `The default name Git usually gives the original GitHub repo address after a clone.` },
        { term: `write permission`, meaning: `Being able to clone does not mean you can push; a public repo is readable, but pushing a change still needs collaborator permission.` }
      ],
      prompt: `Please do this on two computers, in order. Before you start, exchange GitHub usernames with your partner and agree on a group number.

The advisor's computer (this round's advisor owns the thesis repo):
- ⚠️ The new repo has to stand on its own; it must not sit inside the Stage 1 project. First tell me the full path of my Documents folder, then create a brand-new empty folder there called thesis-pair-NN (put your own group number in place of NN, for example thesis-pair-03). If Documents has been taken over by cloud sync such as OneDrive (the path contains OneDrive, or the folder icon has a cloud on it), create it somewhere that is not synced instead (for example C:\\git-practice) and report the real path — cloud sync and git are two mechanisms that fight each other. If you find that we are currently inside the Stage 1 practice project folder (research-practice-project by default), stop and tell me at once.
- Inside that new folder create two files: paper.md, with two headings, "Method" and "Literature review", each holding one made-up sentence; and a .gitignore that excludes WORKSHOP-RECEIPT*.txt. Then add a .gitattributes holding one line, * text=auto eol=lf. Make the first commit (branch name main), create a public GitHub repo with the same name and push it there, then add my partner as a collaborator with push access — use the username my partner has just given me. When you are done, report the full repo URL.

The graduate student's side:
- Open the notifications at the top right of github.com (or the invitation email) and press Accept invitation yourself, then report that you can open the repo.

Then both of you put the owner/thesis-pair-NN that the advisor reported into the "Paired repo" field at the top of the quest page, and each get a local working copy ready — the two roles do different things here:

- Advisor: the thesis-pair-NN folder you just created is your working copy; do not clone it again (you will hit "folder already exists"). Just use it, and point the quest page at this folder.
- Graduate student: ask the AI to clone the paired repo {pairRepo} into your Documents folder (if Documents has been taken over by OneDrive sync, clone it somewhere that is not synced, for example C:\\git-practice), report the full path after cloning, then open it in your AI tool and point the quest page at this freshly cloned folder (not the Stage 1 one).

Finally, each of you looks — only looks — at the current branch, at origin, and at your own write permission on GitHub, and reports the group number and the repo URL to the instructor.`,
      plan: [
        `Swap GitHub usernames and agree on a group number`,
        `Advisor's side: leave the Stage 1 folder first, then create a separate new folder under Documents`,
        `Advisor's side: have the AI create the repo, put paper.md and .gitignore in it, and send the collaborator invitation`,
        `Graduate student's side: accept the invitation yourself`,
        `Both of you put owner/repo into the quest page`,
        `The advisor keeps the folder just created (no second clone); the graduate student clones into their Documents folder and reports the full path`,
        `Check main, origin and write permission`,
        `Point the quest page at the new folder, and report the group number and the URL to the instructor`
      ],
      human: `The advisor checks that the repo name and the invited username are not mistyped; the graduate student presses Accept invitation themselves; both of you confirm your permission is WRITE or higher, or the push in the next step will not work.`,
      dashboard: `The folder switch worked; HEAD is main; main is in sync with origin/main; the pairing details shown are correct.`,
      behind: `# Advisor side: ⚠️ you have to leave the Stage 1 research-practice-project and create a separate folder under Documents
# (if Documents or Desktop has been taken over by OneDrive sync, use somewhere that is not synced, e.g. C:\\git-practice — double sync fights itself)
cd ~/Documents          # Windows PowerShell: cd $HOME\\Documents
mkdir thesis-pair-NN
cd thesis-pair-NN
# create paper.md (with the two headings "Method" and "Literature review"), .gitignore (excluding WORKSHOP-RECEIPT*.txt) and .gitattributes (* text=auto eol=lf)
git init -b main
git add paper.md .gitattributes .gitignore
git commit -m "Create the paired practice paper skeleton"
gh repo create thesis-pair-NN --public --source=. --push
gh api repos/{pairRepo}/collaborators/<partner-username> -X PUT -f permission=push

# Graduate student side: go to the github.com notifications or your email and press Accept invitation yourself (this step happens on the web, there is no command)

# Advisor side: the folder you just created is your working copy; you do not need to clone again and must not (you will hit destination path already exists)

# Graduate student side (and any pair borrowing the demo repo):
git clone https://github.com/{pairRepo}.git <target path in your Documents folder>
git -C <full path after cloning> status --short --branch
git -C <full path after cloning> remote -v
gh repo view {pairRepo} --json viewerPermission,url,defaultBranchRef`,
      rescue: `⚠️ If you find the AI created the new folder inside research-practice-project (a second, nested .git appears), stop at once and do not commit or push again. Ask it to list what is inside that new folder first — check that it holds only the paper.md and .gitignore this step just created and nothing of your own, delete it only once you agree, then rebuild it under Documents. If the repo name is taken, use a different group number or add a suffix; do not delete anybody else's repo. A public repo can be cloned even before the invitation is accepted, but the push will be rejected — check first that the invitation has been accepted and that you are signed in as yourself; if you cannot find the invitation email, opening the repo URL directly also offers the accept option. If clone fails, check the URL and your network first; if the target folder already exists, do not delete or overwrite it — report what is inside and decide afterwards. If your pair is stuck for more than five minutes, raise your hand: the instructor will add you both as collaborators on the demo repo (you still have to accept the invitation yourself and confirm your permission is WRITE), and you clone that one to carry on with C2 — without WRITE permission the push in C2 will always fail. Build your own repo after class.`,
      figure: {
        src: `img/gh-invite-hint.png`,
        alt: `Illustration: the GitHub collaboration invitation page — a blue dot on the notification bell, and a green Accept invitation button in the middle of the page`,
        caption: `Illustration (a mock-up of the GitHub page). This is what the invitation looks like to the graduate student — you will find it either at the notification bell or in your email; <strong>you have to press the green Accept invitation button yourself</strong>. If you cannot find the notification, just open the repo URL the advisor reported.`
      }
    },

    C2: {
      title: `The graduate student opens a branch and proposes a change`,
      why: `The graduate student works on their own branch, so the official main is never overwritten by half-finished work.`,
      concept: `A branch is like pulling a separate drafting table out from the latest main. You pull first so that your draft starts from the newest version of the shared project; the edit, the commit and the push all stay on your own branch and never change the official version directly. A PR is only a proposal asking the other person to review it and merge it — opening one does not mean the content is in main.`,
      terms: [
        { term: `branch`, meaning: `A separate line of work forked from a commit, so that half-finished material stays away from main.` },
        { term: `pull --ff-only`, meaning: `Accepts only a straight-line sync; if your machine and the remote have already diverged it stops instead of merging on its own.` },
        { term: `push -u`, meaning: `Pushes a new branch for the first time and remembers which remote branch it should sync with afterwards.` },
        { term: `Pull Request (PR)`, meaning: `The formal proposal asking another person to read the diff, comment on it and decide whether to merge.` }
      ],
      prompt: `This round I am the graduate student. Before any work, self-check three things for me: ① the folder open right now is the paired repo (not the Stage 1 one) ② gh auth status shows I am signed in as myself ③ we are on main and the working tree is clean. If any of them is wrong, stop, explain how to fix it and wait for me to agree. Only when all three pass, start: pull the latest main fast-forward only (--ff-only), then create the branch {branch}. Only change paper.md: add "This exercise demonstrates version control with public simulated data." at the end of the "Method" section. If you cannot find the "Method" section, stop — do not change anything else on your own. Show the diff first and stop; after I confirm, stage paper.md and show the staged diff. Only after I confirm again, commit, push and open a PR that explains what changed and why, and ask the advisor to check in particular whether the wording of the new sentence is precise. Once you have confirmed that the PR link opens, record C2 done in {receipt}.`,
      plan: [
        `Self-check: the folder, the account, and a clean main`,
        `Sync main with --ff-only`,
        `Create your own branch`,
        `Add the given practice sentence to the "Method" section of paper.md`,
        `Show the diff and wait for confirmation`,
        `Stage paper.md only, and show the staged diff`,
        `Wait once more, then commit, push and open the PR`,
        `Report the PR number and the link`
      ],
      human: `Check that you are not on main; read the diff line by line; check that the staged diff holds only paper.md; you are done only once you have read the PR description yourself.`,
      dashboard: `HEAD is {branch}; the branch has a commit and has been pushed to origin; the PR is open and waiting for the other person to review it.`,
      behind: `git rev-parse --show-toplevel
gh auth status
git switch main
git status --short
git pull --ff-only origin main
git switch -c {branch}
git diff -- paper.md
git add paper.md
git diff --cached -- paper.md
git commit -m "<a clear explanation of why you changed it>"
git push -u origin {branch}
gh pr create --base main --head {branch} --title "<PR title>" --body "<what changed, why, and what you want reviewed>"`,
      rescue: `If main is not clean, or pull --ff-only fails, stop right there and only look at status and log; do not reset, rebase or force push. If the push says you have no permission, check which account you are signed in as, and check the invitation to the paired repo.`
    },

    C3: {
      title: `The advisor reviews line by line and requests changes`,
      why: `A PR is the formal "look before you accept" gate. The advisor judges the content, not just the AI's word that it is done.`,
      concept: `Reviewing a PR is not reading the summary or taking the AI's word for it — it is you checking every line under Files changed. An ordinary comment only offers an opinion; Request changes puts "this needs revising" on the record, and if the repo has review rules it will block the merge. Even where there is no technical block, this course does not let you merge first. Point at the file, the line and the reason, so the request is clear and can be followed up.`,
      terms: [
        { term: `review`, meaning: `Another person reads the actual differences and judges whether the content belongs in the official version.` },
        { term: `Files changed`, meaning: `The GitHub page that gathers every line-by-line difference in that PR.` },
        { term: `inline comment`, meaning: `A comment attached directly beside one particular line, so the author knows what to change and why.` },
        { term: `Request changes`, meaning: `Puts on the record that this round needs revising; different from leaving a comment without making a review decision.` }
      ],
      prompt: `This round I am the advisor. Please find the right PR from my partner {partner}, report the PR number and the link, and summarise which files and sections it changes. Do not leave comments, Request changes, approve or merge on my behalf. I will open Files changed myself and review it line by line: on the new sentence "This exercise demonstrates version control with public simulated data." I will leave an inline comment asking to change "demonstrates version control" to the more precise "demonstrates a reproducible research workflow", and then choose Request changes.`,
      plan: [
        `Check the repo, the author, the source branch and the PR number`,
        `Summarise what actually changed`,
        `Open the PR URL you were given`,
        `The advisor leaves the specified inline comment themselves and chooses Request changes`
      ],
      human: `Check the differences yourself in Files changed on GitHub; leave an inline comment on that new sentence asking for "demonstrates a reproducible research workflow", then choose Request changes.`,
      dashboard: `That PR shows Changes requested; the graduate student goes back to the same PR to revise it.`,
      behind: `gh pr list --repo {pairRepo} --state open
gh pr view <PR-number> --repo {pairRepo} --web
gh pr diff <PR-number> --repo {pairRepo}`,
      rescue: `If you cannot find the PR, check the repo, the author, the source branch and the PR number. When you leave an inline comment in Files changed, pressing "Start a review" leaves your comment pending and your partner cannot see it — you have to press "Submit review" at the end for it to reach them. The author of a PR must not approve their own content in this class; if you are signed in as the author, stop and hand it to this round's advisor.`,
      figure: {
        src: `img/gh-review-hint.png`,
        alt: `Illustration: the four steps of a line-by-line review on GitHub — open Files changed, click the blue plus sign beside the line number, type your comment, then under Review changes choose Request changes and press Submit review`,
        caption: `Illustration (a mock-up of the GitHub page). These four steps are the only thing this step asks you to do by hand on the web: <strong>① Files changed → ② the blue plus sign beside the line number → ③ type your comment → ④ under Review changes choose Request changes and press Submit review</strong> — without Submit review, your partner cannot see your comment.`
      }
    },

    C4: {
      title: `The graduate student revises; the advisor approves and merges`,
      why: `The same PR can keep being updated. The advisor looks at the latest round of the diff, and the graduate student does not have to open a new PR.`,
      concept: `A PR is tied to the branch it came from, so once the graduate student pushes the revision commit to that same branch, the original PR updates by itself and nobody has to open a new one. The advisor reads the latest diff again and then uses Approve to say the content passes; merge is what actually puts the work into main. Approval and merge are two separate decisions, and the two of you make them — the AI only carries them out once you give the go-ahead.`,
      terms: [
        { term: `Changes requested`, meaning: `The reviewer has formally asked for a revision; the original PR stays open and waits for the update.` },
        { term: `the original branch`, meaning: `The source branch the PR was opened from; push a new commit here and the original PR updates by itself.` },
        { term: `Approve`, meaning: `The reviewer says the latest content is acceptable; approval on its own has not put anything into main yet.` },
        { term: `merge`, meaning: `Actually merges the reviewed work in the PR into main.` }
      ],
      prompt: `Please do this on two computers, in order; do not mix the two roles in one account.

The graduate student's computer:
- Confirm the right PR number, read the inline comments and propose a plan for the revision; only after I agree, change "demonstrates version control" to "demonstrates a reproducible research workflow".
- Show the new diff and wait for me to confirm; then stage only paper.md, show the staged diff, commit and push to the same branch, so the same PR updates.
- Report the PR number and the link, then stop and hand those two things to the advisor.

The advisor's computer and GitHub account:
- Check that it is the same PR number, repo, author and source branch, and read the latest Files changed again.
- Only once the advisor gives a clear go-ahead, Approve that PR; then stop.
- Explain what the merge will put into main, and only once the advisor gives the go-ahead again, merge that same PR.

Only after the merge succeeds do the graduate student and the advisor each record C4 done in the receipt on their own computer; your receipt file is called {receipt}.`,
      plan: [
        `Lock on to the right PR number and gather the review comments`,
        `Propose the plan for the revision and wait`,
        `Make the change and show the new diff`,
        `Stage paper.md only, and show the staged diff`,
        `Commit and push to the original branch`,
        `Wait for the advisor to read the latest diff again`,
        `Approve that PR once the advisor gives the go-ahead`,
        `Merge that PR once the go-ahead is given again`
      ],
      human: `The graduate student checks the revision and the staged diff; the advisor checks they are signed in as themselves, reads the latest diff again, and makes a separate decision for Approve and for merge.`,
      dashboard: `The same PR first picks up the new commit, then moves from Changes requested to Approved, and finally shows Merged.`,
      behind: `# Graduate student: revise on the original branch
git switch {branch}
git diff -- paper.md
git add paper.md
git diff --cached -- paper.md
git commit -m "<what you changed in response to the review>"
git push origin {branch}

# Advisor: on that specific PR
gh pr diff <PR-number> --repo {pairRepo}
gh pr review <PR-number> --repo {pairRepo} --approve
gh pr merge <PR-number> --repo {pairRepo} --merge`,
      rescue: `If the PR does not update after the push, check first that you pushed to the original source branch and to the right repo. If the repo's rules dismiss an old approval once a new commit arrives, ask the advisor to read the latest diff again before approving; do not skip the review, and never let the author approve their own PR.`
    },

    C5: {
      title: `Both of you go back to main and sync`,
      why: `A merge finishing on GitHub does not mean the two computers are up to date; both of you have to pull before you can see the official version.`,
      concept: `Merging the PR on GitHub only changed the remote main; the main on your computer does not update by itself. First make sure there are no changes waiting to be committed, then switch back to main and pull. Only when you and your partner have each done this are you both looking at the same official version — otherwise one machine is up to date and the other is still sitting on the old history.`,
      terms: [
        { term: `local main`, meaning: `The main as it is kept on this computer of yours.` },
        { term: `origin/main`, meaning: `The remote-tracking branch your machine uses to record where the GitHub main last was.` },
        { term: `pull --ff-only`, meaning: `Syncs only when it can fast-forward straight ahead; if the histories have diverged it stops instead of merging automatically.` },
        { term: `clean working tree`, meaning: `No changes waiting to be committed, so it is safe to switch branches and to sync.` }
      ],
      prompt: `First just look at whether the working tree is clean; if there are changes that have not been committed, stop. Once it is clean, go back to main, pull the paired repo's latest main fast-forward only (--ff-only), then tell me what content has just come in from the PR. Do not delete any branch unless you ask me first. Once you and your partner have each done this on your own computer, each record C5 done in your own receipt; your receipt file is called {receipt}.`,
      plan: [
        `Confirm the working area is clean`,
        `Switch back to main`,
        `Sync origin/main with --ff-only`,
        `Summarise what has just been merged in`,
        `Both of you check the file yourselves`,
        `Delete no branch on your own`
      ],
      human: `You and your partner both open paper.md, check that you see the same merged content, and check that main and origin/main point at the same latest commit.`,
      dashboard: `HEAD is back on main; your local main is in sync with origin/main; the history shows the merge you just did.`,
      behind: `git status --short
git switch main
git pull --ff-only origin main
git log --oneline -4`,
      rescue: `If there are changes that have not been committed before the pull, stop at once and do not let the AI throw them away. If --ff-only fails, look at status, branch and log first and ask the instructor for help; do not reset, rebase or force push.`
    },

    C6: {
      title: `Swap roles and run the short cycle once more`,
      why: `You and your partner both need to experience proposing a change and safeguarding the merge — that is how you learn to guide your own students later.`,
      concept: `Swapping roles is not pressing the same buttons again — it is what lets you feel both the author's and the reviewer's responsibility. The new graduate student still opens a branch from the latest main, reads the diff and opens the PR; the new advisor still reviews line by line before Approve and merge. Even for a small change you may not approve your own work or skip the other person's judgment, and at the end you both pull.`,
      terms: [
        { term: `author`, meaning: `The person who opens the branch, changes the content and puts the PR forward.` },
        { term: `reviewer`, meaning: `The person who reads the diff independently, comments on it and decides whether to approve.` },
        { term: `self-approval`, meaning: `The author approving their own PR; this course does not allow it, because nobody else has stood guard.` },
        { term: `the full cycle`, meaning: `Sync main, branch and edit, PR and review, merge, and then both people sync the official version.` }
      ],
      prompt: `Now swap roles; first confirm who the new graduate student and the new advisor are.

The new graduate student:
- On the new graduate student's own computer, create the branch revise-literature-{tag} from a clean, up-to-date main.
- Only change paper.md: add "[Round 2 practice] The related literature will be completed in the full study." at the end of the "Literature review" section. If you cannot find that section, stop. Show the diff; stop before committing and wait for me to confirm.
- Only after I confirm, commit, push and open a second PR. Report the PR number and the link, then stop.

The new advisor:
- On your own computer and GitHub account, open that PR number and check the repo, the author and the source branch.
- Read the latest Files changed yourself, and only Approve that number once you are satisfied.
- Have the AI explain what the merge will put into main, and only once the advisor gives the go-ahead again, merge that same PR number.

Finally, you and your partner both go back to main, pull fast-forward only (--ff-only) and check the content. Stop at every human decision; when everything is finished, each record C6 done in your own receipt; your receipt file is called {receipt}.`,
      plan: [
        `Confirm who is who after the swap`,
        `Both of you sync the latest main`,
        `The new graduate student opens a short branch and adds the given practice sentence`,
        `Show the diff and wait for confirmation`,
        `Commit, push and open the second PR`,
        `Report the PR number and the link, then stop`,
        `The new advisor checks the repo, the author and the source branch of that same PR`,
        `Review line by line and approve that PR`,
        `Merge that PR once the go-ahead is given again`,
        `Both of you pull with --ff-only and check`
      ],
      human: `Check that the two of you really did swap roles; in round 2 you still read the diff, hand over a specific PR number, have the other person review it, and make separate decisions for Approve and for merge on that number.`,
      dashboard: `Both of you have played the graduate student and the advisor; the second PR shows Merged; on both machines main is in sync with origin/main.`,
      behind: `Outline of the flow (not a command you can type in directly):
Graduate student: sync main → new branch → small edit → diff → commit → push → open PR → report the PR number and link → stop
Advisor: check the same PR number, repo, author, source branch → Files changed → review → Approve that PR → merge that PR
Both: switch back to main → pull --ff-only → check the latest content`,
      rescue: `If time is short, let round 2 change just one short sentence — but do not skip the other person reading the diff, or the two decisions before approval and merge. At any step where the account, repo, branch or PR number looks wrong, stop and look first; do not reset and do not force push.`
    }
  };

  flow.phases.forEach(function(phase){
    var t = PHASES[phase.id];
    if(t) Object.assign(phase, t);
  });
  Object.keys(STEPS).forEach(function(id){
    var step = flow.byId(id);
    if(step) Object.assign(step, STEPS[id]);
  });

  /* ── the reset deep dive shown under P9 ── */
  flow.resetGuide = {
    title: `Safety extra | how to read a reset the AI proposes (this course never runs one)`,
    intro: `What P9 actually uses is show, restore and revert. reset touches the current branch, the staging area and the working area, so this course only learns to recognise its effects and never runs one. When you see the AI propose a reset, do not give it the go-ahead.`,
    syntax: `git reset [--soft | --mixed | --hard] [<commit>]`,
    syntaxNote: `This is a simplified syntax that takes apart only the three common modes aimed at a commit; it is not the full syntax of git reset. Git also has forms that name files, and --patch, --merge, --keep and others.`,
    symbols: [
      { term: `git`, meaning: `Use the Git tool.` },
      { term: `reset`, meaning: `In this simplified form, it points the current branch or HEAD at the target commit, and the mode then decides whether the staging area and the working area follow.` },
      { term: `--`, meaning: `Two hyphens. In front of soft, mixed or hard they are part of a long option; standing on their own, as in git restore -- notes.md, they separate the options from the file path.` },
      { term: `[ ]`, meaning: `The documentation's way of saying this part can be left out; do not type the square brackets.` },
      { term: `|`, meaning: `Pick one of the three modes; do not type the vertical bar.` },
      { term: `< >`, meaning: `Replace what is inside with the real thing; do not type the angle brackets.` },
      { term: `<commit>`, meaning: `The target commit; you can use a commit ID, a tag, a branch name or HEAD~1. Leave it out and it defaults to HEAD.` }
    ],
    layers: [
      { term: `HEAD`, meaning: `The commit you are on right now; usually the latest commit on the current branch, and it does not include changes that have not been committed.` },
      { term: `HEAD~1`, meaning: `The first parent of HEAD; in a linear history you can read it as the previous version, but where a merge is involved it is not simply the one before it in time.` },
      { term: `commit ID / hash`, meaning: `The identifier of one particular commit; the screen usually shows a short form that is still unambiguous.` },
      { term: `index / staging area`, meaning: `The snapshot of what the next commit is expected to save; the same file can hold different content in the staging area and in the working area.` },
      { term: `working tree / working area`, meaning: `The files you can actually see and are editing right now, also often called the working directory.` },
      { term: `untracked`, meaning: `A path in the working area that is not in the staging area (the index), so Git is not tracking it at the moment; git diff does not list it by default.` }
    ],
    modes: [
      { mode: `--soft`, head: `Moves to the target commit`, index: `Stays as it is`, work: `Stays as it is`, risk: `No file disappears straight away, but naming an older commit still moves where your local history sits.` },
      { mode: `--mixed (default)`, head: `Moves to the target commit`, index: `Becomes the target content`, work: `Stays as it is`, risk: `Differences that were staged usually go back to being unstaged; the staging area is not emptied.` },
      { mode: `--hard`, head: `Moves to the target commit`, index: `Becomes the target content`, work: `Tracked files become the target content`, risk: `Tracked changes that have not been committed, staged or not, are overwritten; tracked paths that the target commit does not have are removed from the working area.` }
    ],
    notes: [
      `Leave <commit> out and the target is the current HEAD, so the branch keeps pointing where it did; leave the mode out and it defaults to --mixed.`,
      `reset --hard does not reliably delete every untracked file; but an untracked path that stands in the way of Git writing the target version can still be removed, so never treat untracked files as a safe backup.`,
      `soft and mixed also move your local history when you name an older commit; what hard adds on top is that it overwrites the staging area and your tracked working files at once.`
    ],
    examples: [
      { command: `git reset --hard`, meaning: `No target is written, so the target is HEAD. The branch moves neither forwards nor backwards, but the staging area and the tracked working files are lined up with HEAD; any related change that has not been committed is lost.` },
      { command: `git reset --hard HEAD~1`, meaning: `The current branch moves to the first parent of HEAD, and the staging area and the tracked working files are lined up with it too. The commit that used to be the latest is no longer the one the current branch points at.` }
    ],
    warning: `reset by itself does not change GitHub; but move the branch back to an older commit and then force push, and you rewrite the shared remote history. Stop at any proposal to reset to an older commit, to rebase, or to force push.`,
    questions: [
      `What is the full command?`,
      `Which commit is the target?`,
      `Which mode is it?`,
      `Which staged or uncommitted changes would change or disappear?`,
      `Has this piece of history already been pushed or shared with anybody?`,
      `Could show, restore or revert do the job instead?`
    ]
  };

  /* ── SOS table ── */
  flow.troubleshooting = [
    [
      `The AI is working in the wrong folder`,
      `First just ask for the full path and git status; do not fix anything. Then reopen the correct folder in the AI tool you are using.`
    ],
    [
      `The quest dashboard cannot read the folder`,
      `On Chrome or Edge, select the outermost project folder again; on Safari or Firefox, use the "Manual check (backup)" sentence under each step instead.`
    ],
    [
      `The diff is empty after an edit`,
      `Save the file first, then make sure the AI tool and the quest page point at the same folder.`
    ],
    [
      `The commit succeeded but GitHub does not show it`,
      `A commit stays on your own machine; check whether you really pushed, and whether the remote URL is right.`
    ],
    [
      `The push was rejected`,
      `Ask the AI to fetch and explain the difference; usually you have to pull first. No force push.`
    ],
    [
      `You cannot find the paired repo, or you have no permission`,
      `Open GitHub invitations and accept the invitation, then check the pair number and which account you are signed in as.`
    ],
    [
      `The PR will not merge`,
      `Look at whether Request changes is still standing, whether the latest push has to be approved again, and whether any conversation is still unresolved.`
    ],
    [
      `You edited main by accident`,
      `Keep things as they are and only look at status and diff; ask the AI to explain a plan for moving the work safely onto a new branch. No reset, no rebase, no force push.`
    ],
    [
      `You cannot tell restore and revert apart`,
      `restore is only for changes that have not been committed; revert is for a mistake that is already committed. When you are not sure, just look first.`
    ],
    [
      `You suspect sensitive data was uploaded`,
      `Stop pushing at once; check whether it has entered a commit or the remote. If it is already public, replace the password or the access token first, and ask the instructor to handle it.`
    ]
  ];

  /* ── plain-language lookup ── */
  flow.reference = [
    [
      `Start managing a folder`,
      `Put this folder under version control for me. Explain the plan first, and wait for me to agree before you do it.`
    ],
    [
      `See where things stand`,
      `Is this project clean right now? Which changes have not been saved as a version yet?`
    ],
    [
      `See the changes`,
      `List the changes that have not been committed line by line, and explain them in plain words.`
    ],
    [
      `Save a version`,
      `List the files that will be taken in first; commit only after I confirm, with the message …`
    ],
    [
      `Put it on GitHub`,
      `Check the remote and the branch, then push, and give me the URL when it is done.`
    ],
    [
      `Sync somebody else's changes`,
      `Look at the state of my machine and of the remote first, then pull safely; if there is a conflict, stop and report it.`
    ],
    [
      `Look at the history`,
      `List the recent versions, and summarise who changed what, when and why.`
    ],
    [
      `Compare two versions`,
      `Compare these two versions and go file by file through what was added, removed and changed.`
    ],
    [
      `Just look at an old version`,
      `Only show me the old content; do not switch branches and do not change the files I have now.`
    ],
    [
      `Throw away changes that have not been committed`,
      `Tell me first what would be lost for good, and restore only after I confirm.`
    ],
    [
      `Undo a version that is already pushed`,
      `Use revert so the history is kept; no reset and no force push.`
    ],
    [
      `Open a PR`,
      `Push the branch and open a PR, saying what changed, why it changed, and where you want the other person to look.`
    ]
  ];

  /* ── the 12 everyday sentences ── */
  flow.phrases = [
    [
      `Take charge of this folder for me, so that every change from now on is on the record`,
      `Creates the repository, writes a .gitignore, and makes the first commit`,
      `repository, .gitignore, commit`
    ],
    [
      `Save what I edited today, and note that I revised the literature review`,
      `Packages today's changes into one commit, with the explanation you gave`,
      `commit`
    ],
    [
      `What did I actually touch today? Show me the list`,
      `Lists the changes that have not been saved yet, line by line`,
      `diff`
    ],
    [
      `What did we change in section three last month?`,
      `Goes through the history, picks out the commits that touched section three, and summarises them for you`,
      `log, diff`
    ],
    [
      `Do not touch anything. I have broken something; first check whether these changes are committed or pushed, show me the differences, and then tell me the safe way out`,
      `Only looks first: restore is on the table only if nothing was committed; once it is committed or pushed, revert is the option; it does not go straight to reset`,
      `show, restore, revert (work out the state first)`
    ],
    [
      `Put the latest version on GitHub`,
      `Pulls whatever is new on the remote first, then pushes your commits up`,
      `pull, push (remote)`
    ],
    [
      `A colleague sent me a URL; fetch it so I can have a look`,
      `Clones it onto your computer, and reports back on how the project is laid out`,
      `clone`
    ],
    [
      `I want to try switching to a panel data specification, but the version I have now must not be touched`,
      `Opens a branch, and makes the change on the branch`,
      `branch`
    ],
    [
      `That trial version came out well; let us merge it back into the official one`,
      `Runs the merge; if there is a conflict it lists it and asks you which side to keep`,
      `merge (conflict)`
    ],
    [
      `Have my co-author look at my changes before they go in`,
      `Pushes to GitHub, opens a Pull Request, and attaches a summary of the changes`,
      `push, Pull Request`
    ],
    [
      `Do not upload these data files yet; check whether they are already tracked or committed, then tell me the safe way to handle them`,
      `Only checks the state first; .gitignore is for files that are still untracked. If something is already in the history or holds sensitive data, it stops at once and handles it separately`,
      `.gitignore (not a secrecy tool)`
    ],
    [
      `Wait, stop there. Tell me what you have just done, and what state the project is in now`,
      `Stops immediately, reports its recent actions and the state of the files and the branch, and waits for your next instruction`,
      `The rescue sentence — the portable version of the three rules of supervision, and you can call it at any time`
    ]
  ];
})();
