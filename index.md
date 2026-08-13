---
layout: home
title: Home
footprint_map: true
---

🤡 I received my bachelor's degree in **Computer Science and Technology** from the
School of Computer, Electronics and Information at **Guangxi University**. I am
currently pursuing a master's degree in **Computer Technology** at the School of
Informatics, **Xiamen University**. My research interests include **Artificial
Intelligence** and **Embodied Intelligent Navigation**.


## ✍News

- **[Sep 2026]** I am going to the Xiamen University.

## :books: Selected Publications

{% assign selected_pubs = site.publications | where: "selected", true | sort: "year" | reverse %}
{% for pub in selected_pubs %}
{% include publication-card.html publication=pub %}
{% endfor %}

Please visit my [Google Scholar profile](https://scholar.google.com/) for the
full publication list.

## ✨Hobby

:basketball: Basketball,  :video_game: LOL,   :beers:mixology, :bike: cycling， :guitar: guitar(weak), :headphones:music，:swimmer:swimming 


{% include footprint-map.html %}
