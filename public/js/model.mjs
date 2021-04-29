'use strict';
import * as view from "./view.mjs";
import * as service from "./game-service.mjs";

export class Game {
    constructor(outcome, yourPick, enemyPick) {
        this.outcome = outcome;
        this.yourPick = yourPick;
        this.enemyPick = enemyPick;
    }
}

export class Player {
    constructor(name, wins) {
        this.name = name;
        if (wins === undefined) {
            this.wins = 0;
        } else {
            this.wins = wins;
        }
    }
    rank;
}

const MAX_LENGTH_OF_HISTORY = 5;
export let history = [];
export const valTextMappings = {0: "Stein", 1: "Papier", 2: "Schere"};

export async function playGame() {
    const yourPick = getYourPick();
    const playerName = view.getPlayerName();
    return await service.getServerGame(playerName, yourPick.yourPickText);
}

function getYourPick() {
    const yourPick = view.getPick();
    const yourPickVal = Math.round(yourPick.value);
    return {yourPickVal: yourPickVal, yourPickText: valTextMappings[yourPickVal]};
}

export async function loadRankingView() {
    let ranking = await service.getServerRanking();
    ranking.sort();
    view.displayRanking(ranking);
}

export function addGameToHistory(game) {
    history.unshift(game);
    if (history.length > MAX_LENGTH_OF_HISTORY) history.length = MAX_LENGTH_OF_HISTORY;
}

export function clearHistory() {
    history.length = 0;
}

function sortAndRank(ranking) {
    ranking.sort((p1, p2) => {
        return p2.wins - p1.wins;
    });

    let ranks = generateRanks(ranking);

    for (let i = 0; i < ranking.length; i++) {
        ranking[i].rank = ranks[i];
    }
}

function generateRanks(ranking) {
    let ranks = [ranking.length];
    ranks[0] = 1;
    for (let i = 1; i < ranking.length; i++) {
        if (ranking[i].wins === ranking[i - 1].wins) {
            ranks[i] = ranks[i - 1];
        } else {
            ranks[i] = i + 1;
        }
    }
    return ranks;
}