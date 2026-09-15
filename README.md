# 六级书房

个人向的 CET-6 刷题与学习记录网页。进度保存在浏览器本地，刷新不会丢。

## 能做什么

- **真题精做**：听力精听（逐句播放 / 听写 / 选择题）、阅读精做、段落匹配、翻译采分点对照、作文计时与范文
- **单词背诵**：100 个六级高频词，卡片、选择、拼写三种模式，带间隔复习
- **错题本**：客观题交卷自动收录，翻译和作文可手动收入，支持标为已掌握

题库是六级难度的原创样题，方便立刻开练；之后可以把你自己的真题按同样结构加进 `src/data/papers.ts`。

## 记录如何保存

打开网页会自动加载上次的记录。学习过程中持续自动保存，关掉页面也会再写回本机，不用手动点保存。

1. 浏览器 IndexedDB / localStorage
2. 本机数据库文件 `data/cet6.db`
3. `data/backups/` 按天备份，最近 14 天

首页可以「导出备份 / 导入备份」。请用 `npm run dev` 打开，本地数据库才会同步到项目文件夹。

## 每周 DeepSeek 学情邮件

每周日，或进入新的一周时打开首页，会自动用 DeepSeek 分析本周打卡 / 错题 / 做题情况，发到 `1434193887@qq.com`。

1. 复制环境变量：`cp .env.example .env`
2. 在 [DeepSeek 开放平台](https://platform.deepseek.com) 创建 API Key，填入 `DEEPSEEK_API_KEY`
3. QQ 邮箱网页版：设置 → 账户 → 开启 SMTP 服务，生成授权码，填入 `QQ_SMTP_PASS`（不是 QQ 密码）
4. 重启 `npm run dev`

首页也可以点「立即生成本周分析」手动发一封。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端里给出的本地地址即可。

网页版（GitHub Pages）：https://sylviaruting.github.io/cet6-study/
