const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/database');
const telegram = require('../services/telegram');

const PLACEHOLDER_STORY = `Жил-был маленький зверёк по имени {child_name}. Он был самым добрым и храбрым во всём волшебном лесу. Каждое утро {child_name} просыпался с улыбкой и выбегал на солнечную полянку, где его ждали друзья.

Однажды {child_name} узнал, что в лесу появилась загадочная тропинка, которую раньше никто не замечал. Тропинка вела куда-то далеко, за высокие деревья и мимо журчащего ручья. «Я должен узнать, что там!» — решил {child_name} и отправился в путь.

По дороге {child_name} встретил мудрую сову, которая сидела на старом дубе. «Куда ты идёшь, малыш?» — спросила сова. «Я ищу, что находится в конце этой тропинки», — ответил {child_name}. Сова улыбнулась и сказала: «Самое важное — не то, что ты найдёшь в конце пути, а то, чему ты научишься по дороге».

{child_name} продолжил путь и вскоре оказался у берега волшебного озера. Вода в озере была такой прозрачной, что можно было увидеть каждый камушек на дне. Вдруг из воды выпрыгнула золотая рыбка и сказала: «Привет, {child_name}! Ты пришёл сюда, потому что у тебя храброе сердце».

«Но мне иногда бывает трудно», — признался {child_name}. Рыбка покачала плавником: «Всем бывает трудно. Главное — помнить, что ты не один. Твои друзья и семья всегда рядом, даже когда кажется, что ты совсем один».

{child_name} посмотрел в воду и увидел своё отражение. И вдруг понял: он гораздо сильнее, чем думал раньше. Внутри него живёт свет, который помогает справляться с любыми трудностями.

С тех пор {child_name} знал: когда становится трудно, нужно просто вспомнить о тех, кто тебя любит, и о свете внутри. Он вернулся домой и обнял маму. А тропинка в волшебном лесу навсегда стала его любимым местом для прогулок.

И если когда-нибудь тебе станет грустно — помни, что ты тоже можешь найти свою волшебную тропинку. Она всегда начинается прямо у тебя в сердце.`;

function personalizeStory(text, childName) {
  return text.replace(/\{child_name\}/g, childName);
}

// POST /api/generate — generate a story preview
router.post('/', async (req, res, next) => {
  try {
    const {
      child_name,
      child_gender,
      child_age,
      problem,
      favorite_character,
      friend_name,
      wishes,
    } = req.body;

    // Validate required fields
    if (!child_name || !child_gender || !child_age || !problem) {
      return res.status(400).json({
        error: 'Missing required fields: child_name, child_gender, child_age, problem',
      });
    }

    const story_title = `Сказка для ${child_name}`;
    const fullText = personalizeStory(PLACEHOLDER_STORY, child_name);
    const paragraphs = fullText.split('\n\n');
    const story_preview = paragraphs.slice(0, 3).join('\n\n');

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO generated_stories (child_name, child_gender, child_age, problem, favorite_character, friend_name, wishes, story_title, story_preview, story_full)
      VALUES (@child_name, @child_gender, @child_age, @problem, @favorite_character, @friend_name, @wishes, @story_title, @story_preview, @story_full)
    `);

    const result = stmt.run({
      child_name,
      child_gender,
      child_age,
      problem,
      favorite_character: favorite_character || null,
      friend_name: friend_name || null,
      wishes: wishes || null,
      story_title,
      story_preview,
      story_full: fullText,
    });

    res.json({
      success: true,
      story_id: result.lastInsertRowid,
      story_title,
      story_preview,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/generate/purchase — purchase a generated story
router.post('/purchase', async (req, res, next) => {
  try {
    const { story_id } = req.body;

    if (!story_id) {
      return res.status(400).json({ error: 'Missing required field: story_id' });
    }

    const db = getDatabase();

    // Check that the story exists
    const story = db.prepare('SELECT * FROM generated_stories WHERE id = ?').get(story_id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Mark as paid
    db.prepare('UPDATE generated_stories SET paid = 1 WHERE id = ?').run(story_id);

    // Send Telegram notification (non-blocking)
    telegram.notifyNewStory(story)
      .catch(err => console.error('[Telegram] notifyNewStory failed:', err.message));

    res.json({
      success: true,
      story_full: story.story_full,
      story_title: story.story_title,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
