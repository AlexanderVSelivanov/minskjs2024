// @ts-check
/// <reference path='./index.d.ts' />
export {};

/*
  ДЕМО 1 страница chrome://bookmarks
  Найдем закладки содержащие в названии 'chrome' или 'extension' с сайта github и откроем в новых вкладках
*/

let bm = await chrome.bookmarks.search({});
let filter = (b) => /(chrome)|(extension)/i.test(b.title) && /github/.test(b.url);
bm.filter(filter)
// откроем найденные закладки в отдельных вкладках
bm.filter(filter).forEach(({url}) => chrome.tabs.create({url}))


/*
  ДЕМО 2 страница chrome://bookmarks
  Освободим память для всех вкладок
*/

(await chrome.tabs.query({})).forEach(t => !t.active && !t.discarded && chrome.tabs.discard(t.id));

/*
  ДЕМО 3 страница service worker
*/

// История посещения страниц содержащих в названии 'google' начиная с марта 2024
(await chrome.history.search({startTime: (new Date(2024, 2)).valueOf(),text:''})).filter(h => /google/i.test(h.title))

// Массив синхронизированных устройств (чтобы получить вкладки см sessions[].window.tabs)
await chrome.sessions.getDevices()

/*
  Extra
*/

// Фильтр: в названии 'chrome' или 'extension' с сайта github добавленные не раньше чем неделю назад
let weekAgo = new Date().setDate(new Date().getDate() - 7);
filter = (b) => /(chrome)|(extension)/i.test(b.title) && /github/.test(b.url) && b.dateAdded > weekAgo;
bm = await chrome.bookmarks.search({});
// откроем найденные закладки в отдельных вкладках и поместим в группу
chrome.tabs.group({
  tabIds:
    (
      await Promise.allSettled(
        bm.filter(filter)
          .map(async ({ url }) => await chrome.tabs.create({ url })))
    ).map(p => p.value.id)
})

// Освободим память у выделенных вкладок
let tabs = await chrome.tabs.query({});
let highlightedTabs = tabs.filter(t => t.highlighted && !t.active)
highlightedTabs.forEach(t => chrome.tabs.discard(t.id));

// Получить историю посещений по url
await chrome.history.getVisits({url: 'https://example.com'})

// Нотификация (обязательно использовать iconUrl)
chrome.notifications.create({
  type: 'basic',
  title: 'Hello MinskJS',
  message: 'Notification from extension for MinskJS demo',
  iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC',
});

// Chrome говорит
chrome.tts.speak('Hello, MinskJS.');

// Создадим для выбранных вкладок закладки в папке Inbox
let inboxId = (await chrome.bookmarks.search({ title: 'Inbox' }))?.[0]?.id
let selectedTabs = (await chrome.tabs.query({ highlighted: true }))
selectedTabs.forEach(({title, url}) => chrome.bookmarks.create({parentId: inboxId, title, url}))

// Добавить в Reading List
chrome.readingList.addEntry({
  title: "Title",
  url: "https://example.com/",
  hasBeenRead: false
});
