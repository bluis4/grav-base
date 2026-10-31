---
block: section-layout
display_mode: grid
gap_size: gap-8
align_items: items-start
justify_content: justify-start
justify_items: justify-items-stretch
padding_y: py-16
background_style: solid
background_color: '#ffffff'
background_overlay: 35
title: testing
columns:
    -
        align_self: self-auto
        justify_self: justify-self-auto
        blocks:
            -
                component: data-display/badge
                data-display/badge:
                    badge_content: 'This is my badge in sample section'
                admin_label: 'My sample badge'
        admin_label: '1st column'
    -
        admin_label: '2nd column'
        align_self: self-auto
        justify_self: justify-self-auto
        blocks:
            -
                component: data-display/card
                data-display/card:
                    title: 'test title'
                    label: 'test short text'
                    text: ''
                    image: 'media://agency-studio-hero.png'
                    image_position: left
                    button_text: 'Hello Button'
                    button_url: '#'
                    button_link_source: page
                    page:
                        button_page: /components
                admin_label: 'Testing card'
            -
                component: actions/dropdown
                admin_label: 'My Test Dropdown'
                actions/dropdown:
                    dropdown_text: DropDown
                    items:
                        -
                            item_text: 'Drop Item 1'
                            link_destination: /blog
                            link_source: page
                            page:
                                link_page: /components
                            url_behavior: same
                        -
                            item_text: 'Drop Item 2'
                            link_destination: 'https://www.google.com/'
                            custom:
                                link_custom_url: 'https://www.google.com'
                            url_behavior: new_tab
                    dropdown_position: center
                    dropdown_on_hover: true
                    dropdown_direction: top
            -
                component: actions/fab
                actions/fab:
                    fab_mode: fab
                    speed_dial_settings:
                        items:
                            -
                                item_type: icon
                                item_link_source: custom
                                item_url_behavior: same
                                item_icon_fields:
                                    item_icon: bi-alarm-fill
                                custom:
                                    item_custom_url: '#'
                                item_label: 'Icon 1'
                            -
                                item_type: icon
                                item_link_source: page
                                item_url_behavior: same
                                item_label: 'Icon 2'
                                item_icon_fields:
                                    item_icon: bi-align-center
                                page:
                                    item_page: /blog
                            -
                                item_type: icon
                                item_link_source: page
                                item_url_behavior: same
                                item_label: 'Icon 2'
                                item_icon_fields:
                                    item_icon: bi-archive
                                page:
                                    item_page: /home
                        fab_style: quarter_circle
                    fab_position: inline
                    fab_title: ''
                    fab_icon: bi-arrow-up-right-circle
                    fab_link_settings:
                        fab_link_source: page
                        page:
                            fab_page: /components
                admin_label: 'My Speed Dial'
            -
                component: actions/modal
                admin_label: 'My Modal'
                actions/modal:
                    modal_content: 'Sample Modal Text'
            -
                component: actions/swap
                admin_label: 'My Swap'
            -
                component: actions/theme-controller
                admin_label: 'My Theme Controller'
---
