# gomoku AI
**Demo Website**: [網址](https://ligoon.github.io/Gomoku-AI/)

![](https://i.imgur.com/7PeuHUm.jpg)


**說明**：改良網頁程式設計期末作業，使用 minimax、alpha-beta pruning 實現 AI agent。


| 更新日期   | 說明                                                 |
| ---------- |:---------------------------------------------------- |
| 2019/05/03 | 完成 human v.s. human 跟 human v.s. AI (舊版)        |
| 2021/08/30 | 實現 minimax、alpha-beta pruning、heuristic function |
| 2021/10/18 | 修復canvas渲染問題                                   |

**問題**：目前深度只能開到 3，深度如果到 4，搜索時間就會接近 30 秒。由於已經實現了 heuristic function 理論上不應該搜索時間如此爆炸，推測也許有甚麼 bug 之類的，或是 heuristic 設計的不太好。另外目前對於棋盤的評分方式也很粗糙，也許之後會再優化，碼風也是巨醜。

史萊姆的第一個家都有持續再更新，希望我也能持續更新。
如果覺得五子棋太無聊，可以參考我大哥寫的黑白棋，很屌。[Othello_Tkinter_GUI](https://github.com/1am9trash/Othello_Tkinter_GUI)
