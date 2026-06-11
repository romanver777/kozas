import { COURSES_DATA } from "../mocks/coursesData";

const simulateFetch = async (data = COURSES_DATA) =>
  new Promise((resolve) =>
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 500),
  );

const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
};

export const fetchCoursesPage = async ({
  category,
  search,
  page,
  pageSize = 9,
}) => {
  let filtered = await simulateFetch();

  if (category && category !== "All") {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (search && typeof search === "string" && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((c) => c.title.toLowerCase().includes(q));
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const items = paginate(filtered, page, pageSize);

  return {
    items,
    page,
    totalPages,
    totalItems,
    hasMore: page < totalPages,
  };
};

export const getCategories = async () => {
  const coursesData = await simulateFetch();

  const counts = coursesData.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  return [
    { name: "All", count: coursesData.length },
    ...Object.entries(counts).map(([name, count]) => ({ name, count })),
  ];
};
