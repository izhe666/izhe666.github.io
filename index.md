---
layout: home
title: Home
---

I am a student / researcher at **Your University**. My research interests include
**computer vision**, **machine learning**, and **multimodal AI**.

I received my degree from **Your Previous University**. I am broadly interested
in building reliable intelligent systems and publishing reproducible research.

## Recruiting

I am recruiting self-motivated students. Please email me your CV, transcript,
and a short description of your research interests. Undergraduate interns and
visiting students are also welcome.

## News

- **[Aug 2026]** This homepage template was created for GitHub Pages.
- **[Jul 2026]** One paper was accepted by Conference / Journal Name.
- **[May 2026]** I joined Your Lab as a researcher.
- **[Mar 2026]** I gave a talk on trustworthy AI systems.
- **[Jan 2026]** A collaborative project was released on GitHub.
- **[Nov 2025]** One paper was selected for an oral presentation.
- **[Sep 2025]** I started a new research project on multimodal learning.
- **[Jun 2025]** I served as a reviewer for Conference Name.
- **[Apr 2025]** Our benchmark and code were released.
- **[Feb 2025]** I received a scholarship / award.

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
