// @ts-check
/// <reference path='./index.d.ts' />

// Показываем side panel с нашей панелькой при нажатии на кнопку расширения в тулбаре
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'discardAllTabs') {
    const allTabs = await chrome.tabs.query({});
    allTabs.forEach(tab => !tab.discarded && chrome.tabs.discard(tab.id));
  }
});