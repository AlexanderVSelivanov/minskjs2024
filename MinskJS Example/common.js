// @ts-check
/// <reference path='./index.d.ts' />

export const getCurrentTab = async () => (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))?.[0];

/**
 * @param {string} id 
 * @param {() => void} onClick 
 */
export const onBtnClick = (id, onClick) => document.getElementById(id)?.addEventListener('click', onClick);