---
title: Publications
permalink: /publications/
---

{% assign pubs = site.publications | sort: "year" | reverse %}
{% for pub in pubs %}
{% include publication-card.html publication=pub %}
{% endfor %}
