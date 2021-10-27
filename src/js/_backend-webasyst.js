var app = new Vue({
    delimiters: ['%%', '%%'],
    el: '.start',
    data: {
        plugin_url: document.querySelector('#plugin_url').value,
        url: document.querySelector('#url').value,
        custom_css_instruction: false,
        loading: true,
        button_save_disabled: false,
        error_image: false,
        error_video: false,
        // Settings default
        settings: {
          active_plugin: true,
          vertical_preload: 10,
          horizontal_preload: 0,
          autodescribing_sizes: true,
          forbidden_pages: ''
        }
      },
    filters: {
        bool: function (value) {
            if (!value) return ''
            value = Boolean(value)
            return value
        },

        int: function (value) {
            if (!value) return ''
            value = Number(value)
            return value
        },
    },
    methods: {
        faqOpen(e) {
            if (!e.target.className || !/faq__question/gi.test(e.target.className)) return

            const answer = e.target.parentNode.children[1]
            const question = e.target.parentNode.children[0]
            const icon = question.children[0]

            if (/open/gi.test(answer.className)) {
                answer.className = answer.className.replace(/\s(open)/, '')
                icon.className = icon.className.replace(/darr/gi, 'rarr')
            } else {
                answer.className += ' open'
                icon.className = icon.className.replace(/rarr/gi, 'darr')
            }
        },
        pageReload() {
            setTimeout(function () {
                window.location.reload();
            }, 500);
        },
    },
    mounted: function () {
        axios
            .get(this.url)
            .then(response => {
                const settingsDB = response.data.data.result

                // Привидение к числу свойств t-number
                for (const item in settingsDB) {
                    if (settingsDB.hasOwnProperty(item)) {
                        if (/_t-number/gi.test(item)) {
                            settingsDB[item] = Number(settingsDB[item])
                        }
                    }
                }

                const settingsMerge = Object.assign({}, this.settings, settingsDB)
                this.settings = settingsMerge
            })
            .catch(error => console.log(error))
            .finally(() => (this.loading = false))
    }

})