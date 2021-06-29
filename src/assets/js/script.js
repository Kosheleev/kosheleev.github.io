vm = new Vue({
  el: '#root',
  data: () => ({
    navbar: false,
    form: {
      name: '',
      phone: '',
    }
  }),
  methods: {
    onFormSubmit() {
      if (!this.form.name || !this.form.phone) {
        return
      }

      console.log(this.form)
    },
    setHeaderOnScroll() {
      const header = document.getElementById('header')
      header.children[0].style.opacity = (window.scrollY / 80).toFixed(2)

      if (window.scrollY > 40) {
        header.classList.add('header_scroll')
      } else {
        header.classList.remove('header_scroll')
      }
    },
  },
  watch: {
    navbar(to) {
      const body = document.getElementById('body')

      if (to) {
        body.style.overflow = 'hidden'
        return
      }

      body.removeAttribute('style')
    }
  },
  mounted() {
    window.addEventListener('scroll', this.setHeaderOnScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.setHeaderOnScroll)
  }
})