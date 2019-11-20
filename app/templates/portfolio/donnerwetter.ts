const { html } = require('@popeindustries/lit-html-server')
const cache = require('../../services/cacheService.js')()

export default html`
  <page-sections>
    <page-section>
  		<div class="stage type-full" style="background-color: rgb(226,225,223)">
  			<img class="centered image" src="/${cache.get('files').media['media/donnerwetter-stage.png']}" alt="Donnerwetter" />
      </div>
    </page-section>
    <page-section centered maxwidth="1000px">
      <a class="portfolio-link-back" href="/home#portfolio">← Back</a>
      <h3 class="o-headline--h2 o-headline--portfolio">Donnerwetter</h3>
    </page-section>
    <page-section class="c-section-portfolio-intro" centered maxwidth="1000px">
      <div class="o-project-info o-project-section-container">
        <div class="o-project-info__item">
          <h4 class="o-project-info__title">Type</h4>
          <div class="o-project-info__description">Personal</div>
        </div>
        <div class="o-project-info__item">
          <h4 class="o-project-info__title">Created</h4>
          <div class="o-project-info__description">2010</div>
        </div>
        <div class="o-project-info__item">
          <h4 class="o-project-info__title">Objective</h4>
          <p class="type--l">This calendar consists of 12 posters, one per month. Every poster visualises a different kind of weather information in an information graphic. The dates rotate like the arm of a clock visualizing the time of the year.</p>
        </div>
      </div>
    </page-section>
  </page-sections>
`
