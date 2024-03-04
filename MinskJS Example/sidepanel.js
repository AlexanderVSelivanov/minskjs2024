// @ts-check
/// <reference path='./index.d.ts' />

import {getCurrentTab, onBtnClick} from'./common.js';

onBtnClick("btnDiscardAllTabs", async () => {
    (await chrome.tabs.query({})).forEach(tab => !tab.discarded && chrome.tabs.discard(tab.id))
});
onBtnClick("btnDiscardSelectedTabs", async () => {
    const selectedTabs = (await chrome.tabs.query({ highlighted: true }))
    selectedTabs.forEach(tab => !tab.discarded && chrome.tabs.discard(tab.id));
});

onBtnClick("btnSaveToInbox", async () => {
    const tab = await getCurrentTab();
    const inboxId = (await chrome.bookmarks.search({ title: 'Inbox' }))?.[0]?.id
    if(!tab || !tab.id || !inboxId) return;
    chrome.bookmarks.create({ parentId: inboxId, title: tab.title, url: tab.url });
    chrome.tabs.remove(tab.id);
});

// Simple global flag (better use map with tab id relation) 
let youTubeStyleInjected = false;
onBtnClick("btnYouTubeStyle", async () => {
    const tab = await getCurrentTab();
    if(!tab || !tab.id) return;

    youTubeStyleInjected
        ? await chrome.scripting.removeCSS({ files: ['./youtubeStyle.css'], target: { tabId: tab.id } })
        : await chrome.scripting.insertCSS({ files: ['./youtubeStyle.css'], target: { tabId: tab.id } });

    youTubeStyleInjected = !youTubeStyleInjected;
});

onBtnClick("btnInjectScript", async () => {
    const tab = await getCurrentTab();
    if(!tab || !tab.id) return;

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: () => {
          document.body.style.backgroundColor = 'orange';
        },
      });
});

onBtnClick("btnNotification", () => {
    chrome.notifications.create({
        type: 'basic',
        title: 'Hello, MinskJS!',
        message: 'Notification from MinskJS demo extension',
        iconUrl: 'icon.png',
    });
});

onBtnClick("btnSpeak", () => {
    // WORK ONLY IN CHROME (not in chromium)
    chrome.tts.speak("Hello, MinskJS!");
});