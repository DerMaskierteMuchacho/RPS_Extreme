'use strict';

export async function getServerRanking() {
    let url = '/players';
    let ranking = await getData(url);
    console.log(ranking);
    return ranking;
}

export async function getServerGame(playerName, yourPick) {
    let url = `/play?playerName=${playerName}&playerHand=${yourPick}`;
    return await getData(url);
}

export async function createPlayerIfNotExists(playerName) {
    let url = `/player?playerName=${playerName}`;
    return await fetch(url);
}

async function getData(url) {
    const response = await fetch(url);
    return await response.json();
}