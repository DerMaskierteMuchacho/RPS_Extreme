'use strict';

export async function getServerRanking() {
    let url = '/play';
    return await getData(url);
}

export async function getServerGame (playerName, yourPick) {
    let url = `/play?playerName=${playerName}&playerHand=${yourPick}`;
    const data = await getData(url);
    return data;
}

export async function getOrCreateNewPlayer (playerName) {
    let url = `/player=${playerName}`;
    const data = await getData(url);
    return data;
}

async function getData(url) {
    const response = await fetch(url);
    return await response.json();
}