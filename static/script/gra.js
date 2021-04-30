"use strict"


export { gra }
import { ctx } from './main.js';

const gra = {
    bazaDanych: null,
    serverResponse: {}, // odpowiedź serwera
    users: null, // tablica użytkowników (KLASY)
    playerOperationArray: [],
    KimJestem: null, //informacja kim jestem
    kostka: null, // zawiera informacje o wylosowanych z póli kostkach
    myPawns: [], // przechowywuje informacje o wszystkich pionkach
    Place: [], // przechowuje ostatnie miejsce i nie wymusz rerenderowania jeśli nie doszło do zminy
    lastDice: null, // ostania kostka
    lastPLayer: null,
    synchronizacjaGryInt: null,
    twojaTura: false,

    //zarządzanie planszą
    gra() {


        var plansza = new Image;
        plansza.onload = function () {
            ctx.drawImage(plansza, 200, 0, 600, 600);
        };
        plansza.src = "https://mendela.pl/iii/chinczyk/img/plansza.jpg";

        var playerDiv = document.createElement("h1");
        playerDiv.id = "playerDiv"
        playerDiv.style.color = "white"
        document.getElementById("kolejka").appendChild(playerDiv);
        var timeDiv = document.createElement("h1");
        timeDiv.id = "timeDiv"
        timeDiv.style.color = "white"
        document.getElementById("kolejka").appendChild(timeDiv);



        this.kimJestem = this.bazaDanych.kimJestem
        this.users = this.bazaDanych.users
        this.synchGameServer();
        console.log(this.bazaDanych)
        this.synchronizujGre()
        // console.log(this.bazaDanych)
    }, synchGameServer() {
        fetch('/graSynchronizacjaServer', { // adres serwera
            method: 'GET', //metoda
        })
            .then(response => response.json())
            .then(data => {
                this.bazaDanych = {
                    ...data
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }, synchGameClient() {
        fetch('/graSynchronizacjaClient', { // adres serwera
            method: 'GET', //metoda
        })
            .then(response => response.json())
            .then(data => {
                this.bazaDanych = {
                    ...data
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, tura() {
        console.log("Twoja tura")


        ctx.fillStyle = 'rgb(39, 39, 39)';
        ctx.fillRect(50, 50, 100, 100);

        this.rzutKostka()

    }, rzutKostka() {


        var plansza = document.getElementById("plansza")
        var img = document.createElement("img");
        img.src = "../photos/dice.png";
        img.id = "dice"
        img.style.position = "absolute"
        img.style.top = "2vh"
        img.style.left = "2vw"
        img.style.height = "80px"
        img.style.width = "80px"
        //console.log(plansza)
        plansza.appendChild(img);

        img.addEventListener("click", function () {
            if (this.kostka == null) {
                this.kostka = Math.floor(Math.random() * 6) + 1
            }

            var msg = new SpeechSynthesisUtterance(this.kostka);
            window.speechSynthesis.speak(msg);



            var imgSrc = null;
            switch (this.kostka) {
                case 1:
                    imgSrc = "https://miro.medium.com/max/256/1*5i3bBsz_bMcGQ-UgDMCzQA.png"
                    break;
                case 2:
                    imgSrc = "https://miro.medium.com/max/256/1*dqZhjZbsbEBDXzKQPAagXw.png"
                    break;
                case 3:
                    imgSrc = "https://miro.medium.com/max/256/1*DrPdeWaJON0XbtmiEZc3jw.png"
                    break;
                case 4:
                    imgSrc = "https://miro.medium.com/max/256/1*5w7bpE0KdwXc21zUQoOtOw.png"
                    break;
                case 5:
                    imgSrc = "https://miro.medium.com/max/256/1*UYR8l1h7AI4MNtJWAugyjg.png"
                    break;
                case 6:
                    imgSrc = "https://miro.medium.com/max/256/1*15_KIo9vPHULoA98NYT9jQ.png"
                    break;
            }

            var img = new Image;
            img.onload = function () {
                ctx.drawImage(img, 50, 50, 100, 100);
            };
            img.src = imgSrc;
        });

    }, synchronizujGre() {
        this.synchronizacjaGryInt = setInterval(() => {
            this.synchGameClient()
            // if (this.kimJestem.idGracza == this.bazaDanych.player) {
            //     console.log("Twoja tura")
            // }
            var kolor = null;
            if (this.bazaDanych.users[this.bazaDanych.player].color == "red") {
                kolor = "#691f1f"
            } else if (this.bazaDanych.users[this.bazaDanych.player].color == "blue") {
                kolor = "#2b2b5c"
            } else if (this.bazaDanych.users[this.bazaDanych.player].color == "green") {
                kolor = "#426e3c"
            } else if (this.bazaDanych.users[this.bazaDanych.player].color == "yellow") {
                kolor = "#929264"
            }
            document.getElementById("playerDiv").innerHTML = `${this.bazaDanych.nicks[this.bazaDanych.player]}`
            document.getElementById("playerDiv").style.color = kolor
            document.getElementById("timeDiv").innerHTML = `\n ${this.bazaDanych.remainingTime / 1000} `

            if (this.kimJestem.idGracza == this.bazaDanych.player) {
                if (this.twojaTura == false) {
                    this.twojaTura = true
                    console.log("Moja Tura")
                    this.tura();
                }
            } else {
                this.twojaTura = false
                if (document.getElementById("dice") != null) {
                    document.getElementById("dice").remove();
                }
            }
        }, 1000)
    },
}
