export const getCategories = (courses) => {
  const counts = courses.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    
    return acc;
  }, {});

  return [
    { name: "All", count: courses.length },
    ...Object.entries(counts).map(([name, count]) => ({ name, count })),
  ];
};

export const filterCourses = ({ courses, category, search }) => {
  const q = search.trim().toLowerCase();

  return courses.filter((c) => {
    const byCategory = category === "All" || c.category === category;
    const bySearch = !q || c.title.toLowerCase().includes(q);

    return byCategory && bySearch;
  });
};
