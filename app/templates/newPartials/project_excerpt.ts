const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')

export default (project) => html`
<section class="Project-excerpt Project-card Project-card__link" projectSlug="${project.slug}">
  <div class="Project-excerpt__title">
    <h4 class="Project-card__client">${project.client}</h4>
    <h2 class="Project-card__title">${project.subtitle}</h2>
  </div>
  <div class="Project-excerpt__challenge">
    <h6>Challenge</h6>
    ${unsafeHTML(project.challenge)}
  </div>
  <div class="Project-excerpt__solution">
    <h6>Solution</h6>
    ${unsafeHTML(project.solution)}
  </div>
  <div class="Project-excerpt__results">
    <h6>Results</h6>
    ${unsafeHTML(project.results)}
  </div>
  <div class="Project-excerpt__responsibilities">
    <h6>Responsibilities</h6>
    <ul class="Project-excerpt__responsibilities-list">
      ${repeat(project.responsibilities.slice(0, Math.ceil(project.responsibilities.length / 2)), item => html`<li>${item}</li>`)}
    </ul>
    <ul class="Project-excerpt__responsibilities-list">
      ${repeat(project.responsibilities.slice(Math.ceil(project.responsibilities.length / 2)), item => html`<li>${item}</li>`)}
    </ul>
  </div>
  <a href="${project.slug}" class="Project-excerpt__case_link">View Case</a>
  <figure class="Project-excerpt__image-container Project-card__image-container">
    <picture class="Project-card__image Project-excerpt__image">
      <source type="image/webp" srcset="${project.previewImage.fields.url}?fm=webp">
      <img src="${project.previewImage.fields.url}" alt="${project.previewImage.fields.title}" loading="lazy"/>
    </picture>
  </figure>
</section>
`
