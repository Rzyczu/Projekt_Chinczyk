"use strict"

import { poczekalnia } from './poczekalnia.js';
import { gra } from './gra.js';
export { ctx }


var ctx = null;
window.addEventListener('DOMContentLoaded', () => {
    poczekalnia.pobierzUzytkownikow()
    poczekalnia.synchronizujPoczkelanie()
    document.querySelector('input[type=checkbox]').addEventListener('input', poczekalnia.chceGrac)
    const canvas = document.getElementById('canvasPlansza');
    ctx = canvas.getContext('2d');
})


