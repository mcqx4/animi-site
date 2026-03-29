const { getDatabase, initDatabase } = require('./database');

function seed() {
  initDatabase();
  const db = getDatabase();

  // Clear existing seed data
  db.exec('DELETE FROM books');
  db.exec('DELETE FROM cartoons');

  // --- Books ---
  const insertBook = db.prepare(`
    INSERT INTO books (title, slug, description, therapy_effect, age_min, age_max, themes, pages_24_price, pages_36_price, badge, sort_order)
    VALUES (@title, @slug, @description, @therapy_effect, @age_min, @age_max, @themes, @pages_24_price, @pages_36_price, @badge, @sort_order)
  `);

  const books = [
    {
      title: 'Лис, который нашёл свой свет',
      slug: 'lis-kotoryj-nashyol-svoj-svet',
      description: 'Терапевтическая сказка о маленьком лисёнке, который боялся темноты, но нашёл внутренний свет.',
      therapy_effect: 'Помогает преодолеть страх темноты и снизить тревожность',
      age_min: 3,
      age_max: 7,
      themes: 'страх темноты,тревожность',
      pages_24_price: 4900,
      pages_36_price: 6900,
      badge: 'Хит',
      sort_order: 1,
    },
    {
      title: 'Река, которая научилась течь медленно',
      slug: 'reka-kotoraya-nauchilas-tech-medlenno',
      description: 'История о бурной реке, которая обрела спокойствие и гармонию.',
      therapy_effect: 'Снижает тревожность и помогает при гиперактивности',
      age_min: 5,
      age_max: 10,
      themes: 'тревожность,гиперактивность',
      pages_24_price: 4900,
      pages_36_price: 6900,
      badge: 'Новинка',
      sort_order: 2,
    },
    {
      title: 'Когда мама уходит, но всегда возвращается',
      slug: 'kogda-mama-ukhodit-no-vsegda-vozvrashchaetsya',
      description: 'Нежная сказка о том, что мама всегда возвращается, даже когда уходит.',
      therapy_effect: 'Помогает справиться с тревогой разлуки',
      age_min: 3,
      age_max: 6,
      themes: 'разлука,тревожность',
      pages_24_price: 4900,
      pages_36_price: 6900,
      badge: null,
      sort_order: 3,
    },
    {
      title: 'Дракон, который не умел дружить',
      slug: 'drakon-kotoryj-ne-umel-druzhit',
      description: 'Сказка о драконе, который учился управлять своими эмоциями и находить друзей.',
      therapy_effect: 'Помогает справиться с агрессией и научиться дружить',
      age_min: 4,
      age_max: 8,
      themes: 'агрессия,дружба',
      pages_24_price: 4900,
      pages_36_price: 6900,
      badge: null,
      sort_order: 4,
    },
    {
      title: 'Совёнок и первый день в новом лесу',
      slug: 'sovyonok-i-pervyj-den-v-novom-lesu',
      description: 'История маленького совёнка, который переехал в новый лес и нашёл там друзей.',
      therapy_effect: 'Помогает при адаптации к новой среде',
      age_min: 3,
      age_max: 7,
      themes: 'адаптация,тревожность',
      pages_24_price: 4900,
      pages_36_price: 6900,
      badge: null,
      sort_order: 5,
    },
    {
      title: 'Тропа, на которой встретились двое',
      slug: 'tropa-na-kotoroj-vstretilis-dvoe',
      description: 'Сказка о двух зверятах, которые учились делить внимание и дружить.',
      therapy_effect: 'Помогает справиться с ревностью и научиться делиться',
      age_min: 4,
      age_max: 8,
      themes: 'ревность,дружба',
      pages_24_price: 4900,
      pages_36_price: 6900,
      badge: 'Новинка',
      sort_order: 6,
    },
  ];

  const insertBooks = db.transaction((items) => {
    for (const item of items) {
      insertBook.run(item);
    }
  });
  insertBooks(books);
  console.log(`Seeded ${books.length} books`);

  // --- Cartoons ---
  const insertCartoon = db.prepare(`
    INSERT INTO cartoons (title, slug, description, therapy_effect, duration_min, price, age_min, age_max, themes, sort_order)
    VALUES (@title, @slug, @description, @therapy_effect, @duration_min, @price, @age_min, @age_max, @themes, @sort_order)
  `);

  const cartoons = [
    {
      title: 'Новый лес Совёнка',
      slug: 'novyj-les-sovyonka',
      description: 'Мультфильм о совёнке, который переезжает в новый лес и учится адаптироваться.',
      therapy_effect: 'Помогает при адаптации к новой среде',
      duration_min: 4,
      price: 3900,
      age_min: 3,
      age_max: 7,
      themes: 'адаптация,тревожность',
      sort_order: 1,
    },
    {
      title: 'Песня глубокого озера',
      slug: 'pesnya-glubokogo-ozera',
      description: 'Мультфильм о маленькой рыбке, которая обретает уверенность.',
      therapy_effect: 'Помогает преодолеть страхи и обрести уверенность',
      duration_min: 5,
      price: 3900,
      age_min: 4,
      age_max: 8,
      themes: 'страхи,уверенность',
      sort_order: 2,
    },
    {
      title: 'Светлячки тихой ночи',
      slug: 'svetlyachki-tikhoj-nochi',
      description: 'Нежный мультфильм о светлячках, которые помогают заснуть.',
      therapy_effect: 'Помогает при страхе темноты и проблемах с засыпанием',
      duration_min: 4,
      price: 3900,
      age_min: 3,
      age_max: 6,
      themes: 'страх темноты,засыпание',
      sort_order: 3,
    },
  ];

  const insertCartoons = db.transaction((items) => {
    for (const item of items) {
      insertCartoon.run(item);
    }
  });
  insertCartoons(cartoons);
  console.log(`Seeded ${cartoons.length} cartoons`);

  console.log('Seed complete!');
}

seed();
