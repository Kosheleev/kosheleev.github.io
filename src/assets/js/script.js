let body
let navbar

document.addEventListener('DOMContentLoaded', () => {
  body = document.getElementById('body')
  navbar = document.getElementById('navbar')

  document.getElementById('header-button').addEventListener('click', () => {
    navbar.classList.add('navbar_opened')
    body.style.overflow = 'hidden'
  })

  document.getElementById('navbar-button').addEventListener('click', () => {
    navbar.classList.remove('navbar_opened')
    body.removeAttribute('style')
  })
})

window.addEventListener('scroll', () => {
  const header = document.getElementById('header')
  header.children[0].style.opacity = (window.scrollY / 80).toFixed(2)

  if (window.scrollY > 40) {
    header.classList.add('header_scroll')
  } else {
    header.classList.remove('header_scroll')
  }
})