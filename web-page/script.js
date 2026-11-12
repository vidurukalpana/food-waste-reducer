// App Tour tabs. Without JavaScript every screen stays visible.
document.documentElement.classList.add('js')

const tabs = [...document.querySelectorAll('[role="tab"]')]
const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')))

function select(index) {
  tabs.forEach((tab, i) => {
    const active = i === index
    tab.setAttribute('aria-selected', String(active))
    tab.tabIndex = active ? 0 : -1
    panels[i].hidden = !active
  })
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => select(index))
  tab.addEventListener('keydown', (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (step) {
      const next = (index + step + tabs.length) % tabs.length
      select(next)
      tabs[next].focus()
    }
  })
})

select(0)
