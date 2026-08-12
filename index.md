---
layout: home
title: Home
---

I am a student / researcher at **Xiamen University**. My research interests include
**Vision Language Navigation**.

I received my degree from **Your Previous University**. I am broadly interested
in building reliable intelligent systems and publishing reproducible research.


## ✍News

- **[Sep 2026]** I am going to the Xiamen University.

## Selected Publications

{% assign selected_pubs = site.publications | where: "selected", true | sort: "year" | reverse %}
{% for pub in selected_pubs %}
{% include publication-card.html publication=pub %}
{% endfor %}

Please visit my [Google Scholar profile](https://scholar.google.com/) for the
full publication list.

## ✨Hobby

:basketball: Basketball,  :video_game: LOL,   cycling, hiking.

## :triangular_flag_on_post: 足迹
{% include footprint-map.html %}