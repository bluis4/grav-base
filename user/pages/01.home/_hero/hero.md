---
title: Hero
block: hero
columns: '2'
content_alignment: left
vertical_alignment: center
background_style: solid
background_color: '#FFFFFF'
background_overlay: 35
columns_content:
    column_1:
        blocks:
            -
                component: base/text
                base/text:
                    name: Subtitle/Eyebrow
                    content: 'This is Subtitle'
                    tag: p
                    alignment: left
                    font_size: text-base
                    color: '#1AD279'
                    margin: ''
                    padding: ''
                    style: ''
            -
                component: base/text
                base/text:
                    name: 'Hero Title'
                    content: 'We make digital feel more human.'
                    tag: h1
                    alignment: left
                    font_size: text-4xl
                    color: ''
                    margin: ''
                    padding: ''
                    style: ''
            -
                component: base/text
                base/text:
                    name: ''
                    content: 'Strategy, design, and technology for ambitious brands ready to make their next move.'
                    tag: p
                    alignment: left
                    font_size: text-base
                    color: ''
                    margin: ''
                    padding: ''
                    style: ''
            -
                component: actions/button
                actions/button:
                    button_text: 'Explore our work <div class="badge badge-primary">badge</div>'
                    button_style: btn-primary
                    button_use_icon: true
                    button_icon: bi-arrow-up
                    button_link_source: page
                    button_url_behavior: new_tab
                    page:
                        button_page: /blog
                    custom:
                        button_custom_url: /blog
                    button_color: '#A855F7'
                    button_text_color: '#FFFFFF'
                    button_icon_position: right
                    button_size: btn-xl
            -
                component: data-display/badge
                data-display/badge:
                    badge_content: 'This is badge'
                    badge_size: badge-sm
                    badge_style: default
                    badge_color: '#A855F7'
    column_2:
        blocks:
            -
                component: base/image
                base/image:
                    image: hero-growth-illustration.png
                    alt: 'A creative team climbing a colorful chart toward a bright star'
---

