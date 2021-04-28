'use strict';
import * as controller from "./controller.mjs";
import * as model from "./model.mjs";

const EMPTY_RANKING_STRING = `<h3> Noch kein Ranking vorhanden</h3>`;
const EMPTY_HISTORY_STRING = '<h3> Noch kein Spiel gespielt </h3>';
const INSERT_NAME_STRING = "Bitte Namen eingeben";
const MAX_LENGTH_OF_RANKING = 10;

const gameSection = document.querySelector("#gameSection")
const startSection = document.querySelector("#rankingSection");
const startBtn = document.querySelector("#startBtn");
const playBtn = document.querySelector("#playBtn");
const backBtn = document.querySelector("#backBtn");
const historyList = document.querySelector("#historyList");
const rankingList = document.querySelector("#rankingList");
const nameInputBox = document.querySelector("#nameInputBox");
const playerNameField = document.querySelector("#playerName");
const outcomeField = document.querySelector("#outcomeField");
const enemyPickField = document.querySelector("#enemyPickField");

export function initStartButton() {
    startBtn.addEventListener('click', function () {
        const playerName = getPlayerName();
        if (playerName.length > 0) {
            controller.getOrCreatePlayer(playerName);
            controller.loadGameView(playerName);
        } else {
            alertUserWhenNameEmpty();
        }
    });
}

export function initBackButton() {
        backBtn.addEventListener('click', event => {
            clearWhenBack();
            switchPageView();
            model.loadRankingView().then();
        });
}

export function initPlayButton() {
    playBtn.addEventListener('click', async function () {
        let game = await model.playGame();
        console.log(game.enemyPick);
        model.addGameToHistory(game);
        displayPlayedGame(game);
    });
}

export function getPlayerName() {
    return nameInputBox.value;
}

export function displayPlayedGame(game) {
    displayEnemyPickAndOutcome(game.enemyPick, game.outcome);
    displayHistory();
}

function displayEnemyPickAndOutcome(enemyPickText, resultText) {
    enemyPickField.innerHTML = `Gegnerische Hand: ${enemyPickText}`;
    outcomeField.innerHTML = `Resultat: ${resultText}`;
}

export function displayHistory() {
    historyList.innerHTML = model.history.length === 0 ? EMPTY_HISTORY_STRING : generateHistoryHTMLString();
}

export function displayRanking(ranking) {
    rankingList.innerHTML = ranking.length === 0 ? EMPTY_RANKING_STRING : generateRankingHTMLString(ranking);
}

export function switchPageView() {
    if (startSection.hidden) {
        startSection.hidden = false;
        gameSection.classList.add("hidden");
    } else {
        startSection.hidden = true;
        gameSection.classList.remove("hidden");
    }
}

export function clearWhenBack() {
    model.clearHistory();
    displayHistory();
    playerNameField.innerHTML = "";
    outcomeField.innerHTML = "";
    enemyPickField.innerHTML = "";
}

export function displayPlayerName(playerName) {
    playerNameField.innerHTML = `Spieler Name: ${playerName}`;
}

export function getPick() {
    return document.querySelector('input[name="pick"]:checked');
}

function generateRankingHTMLString(ranking) {
    let rankingHTMLString = "";
    for (let i = 0; i < MAX_LENGTH_OF_RANKING; i++) {
        rankingHTMLString += rankingEntryHTMLString(ranking[i]);
    }
    return rankingHTMLString;
}

function rankingEntryHTMLString(player) {
    return `<li> ${player.rank}. Rang mit ${player.wins} Siegen: ${player.name} </li>`;
}

function generateHistoryHTMLString() {
    let historyHTMLString = "";
    for (let game of model.history) {
        historyHTMLString += historyEntryHTMLString(game);
    }
    return historyHTMLString;
}

function historyEntryHTMLString(game) {
    return `<li> Resultat: ${game.outcome} | Deine Hand: ${game.yourPick} | Gegnerische Hand: ${game.enemyPick} </li> <br />`;
}

export function alertUserWhenNameEmpty() {
    alert(INSERT_NAME_STRING);
}