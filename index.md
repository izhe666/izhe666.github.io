---
layout: home
title: Home
footprint_map: true
---

<div class="language-copy" data-language-copy="en" markdown="1">
I received my bachelor's degree in **Computer Science and Technology** from the
School of Computer, Electronics and Information at **Guangxi University**. I am
currently pursuing a master's degree in **Computer Technology** at the School of
Informatics, **Xiamen University**. My research interests include **Artificial
Intelligence** and **Embodied Intelligent Navigation**.
</div>

<div class="language-copy" data-language-copy="zh" hidden markdown="1">
我本科毕业于**广西大学计算机与电子信息学院计算机科学与技术专业**，目前在
**厦门大学信息学院**攻读**计算机技术**硕士学位。我的研究兴趣包括
**人工智能**和**具身智能导航**。
</div>


## ✍<span data-en="News" data-zh="动态">News</span>

- **[Sep 2026]** <span data-en="I am going to Xiamen University." data-zh="我将前往厦门大学攻读硕士学位。">I am going to Xiamen University.</span>

## :books: <span data-en="Selected Publications" data-zh="代表论文">Selected Publications</span>

{% assign selected_pubs = site.publications | where: "selected", true | sort: "year" | reverse %}
{% for pub in selected_pubs %}
{% include publication-card.html publication=pub %}
{% endfor %}

<span data-en="Please visit my Google Scholar profile for the full publication list." data-zh="完整论文列表请访问我的 Google Scholar 主页。">Please visit my Google Scholar profile for the full publication list.</span>

## ✨<span data-en="Hobby" data-zh="爱好">Hobby</span>

<span data-en="🏀 Basketball · 🎮 LOL · 🍸 Mixology · 🚴 Cycling · 🎸 Guitar · 🎧 Music · 🏊 Swimming · 💪 Fitness" data-zh="🏀 篮球 · 🎮 英雄联盟 · 🍸 调酒 · 🚴 骑行 · 🎸 吉他 · 🎧 音乐 · 🏊 游泳 · 💪 健身">🏀 Basketball · 🎮 LOL · 🍸 Mixology · 🚴 Cycling · 🎸 Guitar · 🎧 Music · 🏊 Swimming · 💪 Fitness</span>


{% include footprint-map.html %}
