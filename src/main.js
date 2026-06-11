import { renderLoader, renderCards, renderTabs } from "./js/render";
import { getCategories, fetchCoursesPage } from "./js/api";
import { filterCourses } from "./js/filter";
import { getUrlState, setUrlState } from "./js/url";

const DEBOUNCE_MS = 250;
const PAGE_SIZE = 9;

const debounce = (fn, ms) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

const createState = (initial) => {
  let s = { ...initial };
  return {
    get: () => ({ ...s }),
    set: (patch) => {
      s = { ...s, ...patch };
    },
  };
};

const init = async () => {
  const grid = document.getElementById("grid");
  const tabsEl = document.getElementById("tabs");
  const searchEl = document.getElementById("search-input");
  const loadMoreEl = document.getElementById("load-more");

  renderLoader(grid);

  let categories = [];

  try {
    categories = await getCategories();
  } catch (error) {
    renderCards(grid, null, error);
    return;
  }

  const { category: initCat, search: initSearch } = getUrlState();

  const state = createState({
    category: initCat,
    search: initSearch,
    page: 1,
    totalPages: 1,
    allItems: [],
  });

  searchEl.value = initSearch;

  const loadCourses = async ({ category, search, page, append = false }) => {
    try {
      if (!append) {
        renderLoader(grid);
      } else {
        loadMoreEl.classList.add("catalog__load-more_loading");
      }

      const result = await fetchCoursesPage({
        category,
        search,
        page,
        pageSize: PAGE_SIZE,
      });

      state.set({
        page: page,
        totalPages: result.totalPages,
        allItems: append
          ? [...state.get().allItems, ...result.items]
          : result.items,
      });

      if (append) {
        renderCards(grid, state.get().allItems);
      } else {
        renderCards(grid, result.items);
      }

      if (result.hasMore) {
        loadMoreEl.classList.remove("catalog__load-more_hidden");
      } else {
        loadMoreEl.classList.add("catalog__load-more_hidden");
      }

      setUrlState({ category, search });

      return result;
    } catch (error) {
      console.error("Error loading courses:", error);
      renderCards(grid, null, "Error loading courses. Please try again");
    }
  };

  const applyFiltersAndReset = async () => {
    const { category, search } = state.get();
    state.set({ page: 1, allItems: [] });

    await loadCourses({
      category,
      search,
      page: 1,
      append: false,
    });
  };

  renderTabs(tabsEl, categories, initCat);

  await loadCourses({
    category: initCat,
    search: initSearch,
    page: 1,
    append: false,
  });

  tabsEl.addEventListener("click", async (e) => {
    const tab = e.target.closest("[data-category]");
    if (!tab) return;

    const newCategory = tab.dataset.category;
    state.set({ category: newCategory, page: 1 });
    renderTabs(tabsEl, categories, newCategory);

    await loadCourses({
      category: newCategory,
      search: state.get().search,
      page: 1,
      append: false,
    });
  });

  searchEl.addEventListener(
    "input",
    debounce(async (e) => {
      const newSearch = e.target.value;
      state.set({ search: newSearch, page: 1 });

      await loadCourses({
        category: state.get().category,
        search: newSearch,
        page: 1,
        append: false,
      });
    }, DEBOUNCE_MS),
  );

  loadMoreEl.addEventListener("click", async () => {
    const { category, search, page, totalPages } = state.get();
    const nextPage = page + 1;

    if (nextPage <= totalPages) {
      state.set({ page: nextPage });

      await loadCourses({
        category,
        search,
        page: nextPage,
        append: true,
      });
    } else {
      loadMoreEl.classList.add("catalog__load-more_hidden");
    }

    loadMoreEl.classList.remove("catalog__load-more_loading");
  });

  window.addEventListener("popstate", async () => {
    const { category, search } = getUrlState();

    state.set({ category, search, page: 1 });
    searchEl.value = search;

    renderTabs(tabsEl, categories, category);

    await loadCourses({
      category,
      search,
      page: 1,
      append: false,
    });
  });
};

init();
