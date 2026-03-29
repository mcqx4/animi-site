const MOCK_STORY_TEMPLATE = (childName) => ({
  title: 'Светлячок и волшебный лес',
  preview: `В одном уютном лесу, где деревья шептали колыбельные, а ручьи звенели хрустальными голосами, жил маленький светлячок по имени Лучик. Каждый вечер он зажигал свой фонарик и летал между деревьев, освещая дорогу лесным жителям.

Однажды в этот лес пришёл ${childName}. Было уже темно, и тропинка терялась среди высоких папоротников. ${childName} остановился на поляне, не зная, куда идти дальше. Но тут среди ветвей мелькнул тёплый золотистый огонёк — это Лучик заметил нового гостя.

— Не бойся, — прошептал светлячок, подлетая ближе. — Я покажу тебе дорогу. В нашем лесу никто не остаётся один.`,
  full_text: `В одном уютном лесу, где деревья шептали колыбельные, а ручьи звенели хрустальными голосами, жил маленький светлячок по имени Лучик. Каждый вечер он зажигал свой фонарик и летал между деревьев, освещая дорогу лесным жителям.

Однажды в этот лес пришёл ${childName}. Было уже темно, и тропинка терялась среди высоких папоротников. ${childName} остановился на поляне, не зная, куда идти дальше. Но тут среди ветвей мелькнул тёплый золотистый огонёк — это Лучик заметил нового гостя.

— Не бойся, — прошептал светлячок, подлетая ближе. — Я покажу тебе дорогу. В нашем лесу никто не остаётся один.

${childName} протянул ладошку, и Лучик сел на неё, мягко согревая кожу своим светом. Вместе они пошли по лесной тропинке. Светлячок рассказывал о каждом дереве и каждом камушке, и лес перестал казаться таким тёмным и незнакомым.

По дороге они встретили Лисёнка Рыжика, который сидел под кустом и тихонько вздыхал.

— Что случилось? — спросил ${childName}.

— Я потерял свою любимую ягодку, — ответил Лисёнок. — Мама дала мне самую спелую землянику, а я её где-то уронил.

${childName} присел рядом с Лисёнком и мягко сказал:

— Давай поищем вместе. Лучик посветит нам, и мы обязательно найдём.

Лучик взлетел повыше и осветил тропинку ярким золотистым светом. И правда — совсем рядом, под листочком подорожника, лежала красная ягодка, блестящая от вечерней росы.

— Нашли! — обрадовался Лисёнок и крепко обнял ${childName}. — Спасибо тебе! Ты настоящий друг.

Они пошли дальше втроём. Лес становился всё волшебнее: светлячки-друзья Лучика один за другим зажигали свои огоньки, и скоро вся тропинка сияла, как звёздная река.

Вскоре они вышли на большую поляну. Посередине стоял старый дуб, а в его дупле жила мудрая Сова Софья. Она посмотрела на ${childName} добрыми глазами и сказала:

— Я вижу, у тебя доброе сердце. Тот, кто помогает другим, никогда не заблудится — ни в лесу, ни в жизни. Запомни: когда тебе трудно, просто оглянись — рядом всегда найдётся тот, кто протянет руку. Или лапку. Или крылышко.

${childName} улыбнулся. Страх давно прошёл, а на его месте поселилось тёплое чувство — как будто весь лес стал родным домом.

— А теперь закрой глаза, — мягко сказала Сова.

${childName} закрыл глаза. Подул тёплый ветерок, и вокруг зазвучала нежная мелодия — это деревья пели свою вечернюю песню. Когда ${childName} открыл глаза, то увидел, что на каждом дереве горит маленький огонёк, как ёлочная гирлянда.

— Это лес благодарит тебя, — прошептал Лучик. — За доброту, за смелость, за то, что ты не прошёл мимо чужой беды.

Лисёнок Рыжик прижался к боку ${childName} и тихо сказал:

— Приходи к нам ещё. Мы будем ждать.

${childName} кивнул. Теперь этот лес был его секретным местом — местом, где всегда тепло, светло и безопасно. Местом, куда можно вернуться в любое время, просто закрыв глаза и вспомнив золотистый свет Лучика.

Тропинка вывела ${childName} обратно, и луна мягко освещала путь домой. В кармане лежала маленькая ягодка — подарок от Лисёнка. А в сердце — тёплый огонёк, который теперь никогда не погаснет.

Лес тихо шептал вслед: «Спокойной ночи. Мы всегда рядом.»

И ${childName} уснул крепко-крепко, с улыбкой на лице, зная, что утро принесёт новый день, полный чудес и добрых встреч.`,
});

function buildSystemPrompt(childData) {
  const { child_name, child_gender, child_age, problem, favorite_character, friend_name, wishes } = childData;

  return `Ты — мастер терапевтических сказок для детей. Создай персонализированную терапевтическую сказку.

Правила:
- Сказка должна быть 1500-2000 слов
- Главный герой — ребёнок по имени ${child_name} (${child_gender === 'male' ? 'мальчик' : 'девочка'}, ${child_age} лет)
- Сказка должна мягко помочь ребёнку справиться с: ${problem}
- Используй метафоры и сказочные образы для проработки проблемы
- Структура: знакомство с героем → встреча с трудностью → путешествие/поиск → кульминация → мягкое разрешение
- Тон: тёплый, бережный, спокойный
- Не используй страшные образы, насилие, угрозы
- Добавь элементы природы: лес, река, свет, светлячки
- ${favorite_character ? `Включи в сюжет персонажа: ${favorite_character}` : ''}
- ${friend_name ? `Имя друга/питомца: ${friend_name}` : ''}
- ${wishes ? `Дополнительные пожелания: ${wishes}` : ''}

Формат ответа:
НАЗВАНИЕ: [название сказки]
---
[текст сказки, разделённый на абзацы]`;
}

function parseStoryResponse(text) {
  let title = 'Волшебная сказка';
  let fullText = text;

  // Extract title from НАЗВАНИЕ: line
  const titleMatch = text.match(/НАЗВАНИЕ:\s*(.+)/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Remove the title line and separator
  fullText = text
    .replace(/НАЗВАНИЕ:\s*.+/, '')
    .replace(/^---+\s*/m, '')
    .trim();

  // Preview = first 3 paragraphs
  const paragraphs = fullText.split(/\n\n+/).filter((p) => p.trim());
  const preview = paragraphs.slice(0, 3).join('\n\n');

  return { title, preview, full_text: fullText };
}

async function callClaude(systemPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.AI_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        { role: 'user', content: 'Создай сказку по указанным правилам.' },
      ],
      system: systemPrompt,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callOpenAI(systemPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 4000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Создай сказку по указанным правилам.' },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateFairyTale(childData) {
  const { child_name } = childData;

  // If no API key configured, return mock story
  if (!process.env.AI_API_KEY) {
    console.log('[AI] No AI_API_KEY set — returning mock story');
    return MOCK_STORY_TEMPLATE(child_name);
  }

  const provider = (process.env.AI_PROVIDER || 'claude').toLowerCase();
  const systemPrompt = buildSystemPrompt(childData);

  try {
    let rawText;

    if (provider === 'openai') {
      rawText = await callOpenAI(systemPrompt);
    } else {
      rawText = await callClaude(systemPrompt);
    }

    return parseStoryResponse(rawText);
  } catch (err) {
    console.error(`[AI] ${provider} API failed:`, err.message);
    // Fallback to mock story on error
    const mock = MOCK_STORY_TEMPLATE(child_name);
    mock.error = err.message;
    return mock;
  }
}

module.exports = { generateFairyTale };
