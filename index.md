---
layout: home
title: Home
---

I am a student / researcher at **Xiamen University**. My research interests include
**Vision Language Navigation**.

I received my degree from **Your Previous University**. I am broadly interested
in building reliable intelligent systems and publishing reproducible research.


## News

- **[Sep 2026]** I am going to the Xiamen University.

## Selected Publications

{% assign selected_pubs = site.publications | where: "selected", true | sort: "year" | reverse %}
{% for pub in selected_pubs %}
{% include publication-card.html publication=pub %}
{% endfor %}

Please visit my [Google Scholar profile](https://scholar.google.com/) for the
full publication list.

## Academic Services

**Conference Reviewer:** CVPR, ICCV, ECCV, NeurIPS, ICLR, AAAI, ACM MM.

**Journal Reviewer:** IEEE Transactions on Pattern Analysis and Machine
Intelligence, International Journal of Computer Vision.

## Hobby

Basketball, reading, cycling, hiking.
