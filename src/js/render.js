const BADGE_CLASS = {
  Marketing: "badge--marketing",
  Management: "badge--management",
  "HR & Recruiting": "badge--hr",
  Design: "badge--design",
  Development: "badge--development",
};

const badgeClass = (cat) => BADGE_CLASS[cat] || "badge--default";

const cardTpl = (c) => `
    <article class="course-card" role="listitem" data-id="${c.id}">
      <div class="course-card__image-wrap">
        <img class="course-card__image" src="${c.image}" alt="${c.title}" loading="lazy" width="400" height="250" />
      </div>
      <div class="course-card__body">
        <span class="badge ${badgeClass(c.category)}">${c.category}</span>
        <h2 class="course-card__title">${c.title}</h2>
        <p class="course-card__meta">
          <span class="course-card__price">$${c.price}</span>
          <span class="course-card__divider" aria-hidden="true">|</span>
          <span class="course-card__instructor">by ${c.instructor}</span>
        </p>
      </div>
    </article>`;

const tabTpl = ({ name, count, isActive }) => `
    <button
      class="catalog__tab${isActive ? " catalog__tab--active" : ""}"
      data-category="${name}"
      type="button"
      aria-pressed="${isActive}"
    >${name}<sup class="catalog__tab-count">${count}</sup></button>`;

export const renderCards = (container, courses, text = "No courses found") => {
  if (!courses || !courses.length) {
    container.innerHTML = `
        <div class="catalog__empty">
          <p class="catalog__empty-text">${text}</p>
        </div>`;
    return;
  }
  container.innerHTML = courses.map(cardTpl).join("");
};

export const renderTabs = (container, categories, active) => {
  container.innerHTML = categories
    .map((c) => tabTpl({ ...c, isActive: c.name === active }))
    .join("");
};

export const renderLoader = (container) => {
  container.innerHTML = `
    <div class="catalog__loading">
      <img src="icon/spinner.svg" class="catalog__loading-icon" alt="spinner"/>
      </div>`;
  return;
};
