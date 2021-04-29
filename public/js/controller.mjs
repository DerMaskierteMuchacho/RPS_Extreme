'use strict';
import * as service from "./game-service.mjs";
import * as view from "./view.mjs";
import * as model from "./model.mjs";

document.addEventListener('DOMContentLoaded', initStartView);

export function initStartView() {
    view.initStartButton();
    view.initBackButton();
    view.initPlayButton();
    model.loadRankingView().then();
    view.displayRanking();
}

export function loadGameView(playerName) {
    view.displayPlayerName(playerName);
    view.switchPageView();
    view.displayHistory();
}