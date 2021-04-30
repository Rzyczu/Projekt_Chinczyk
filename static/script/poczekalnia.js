"use strict"

export { poczekalnia };
import { gra } from './gra.js';


const poczekalnia = {
    tablicaUzytkownikow: [],
    bazaDanych: {},
    kimJestem: {},
    ktoChceGrac: [],
    tablicaSpanow: [],
    numerGracza: null,
    synchronizacjaUzytkownikowInt: null,
    pobierzUzytkownikow() {
        /* 
        Funkcja służąca do pobrania wszystkich aktualnie obecnych graczy wywoływana 1 przy starcie i cyklicznie aż do statu gry
        */
        fetch('/uzytkownicy', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.bazaDanych = {
                    ...data
                }
                this.numerGracza = data.kimJestem.idGracza
                this.kimJestem = {
                    ...data.kimJestem
                }
                this.nazwijUzytkownikow()
                if (data.status) {
                    this.startGry()
                }
                /* 
                    this.bazaDanych.users = data.users
                    this.bazaDanych.doGry =  data.doGry
                    ...
                    this.bazaDanyh = { 
                        doGry:3 .... itd 
                        "wypakowywujemy data do bazy danych "
                    }
                */

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    },
    nazwijUzytkownikow() {
        this.tablicaSpanow = document.querySelectorAll('span');
        this.bazaDanych.nicks.forEach((element, counter) => {
            this.tablicaSpanow[counter].innerText = element
            //dcaSpanow[counter].innerText = element.nick
        });
        Object.keys(this.bazaDanych.ktoChceGrac).forEach((element, counter) => {
            //console.log(element);
            if (this.bazaDanych.ktoChceGrac[element].chceGrac) {
                poczekalnia.tablicaSpanow[counter].classList.add(element)
            } else {
                poczekalnia.tablicaSpanow[counter].classList.remove(element)
            }
        })
        //     ||
        /*        for(let i = 0; i<this.bazaDanych.users.length;i++)         
            i=== counter
            this.bazaDanych.users[i] === element
        */
    },
    synchronizujPoczkelanie() {
        this.synchronizacjaUzytkownikowInt = setInterval(() => {
            this.pobierzUzytkownikow()
        }, 3000)
    },
    chceGrac(e) {
        console.log(e.target.checked)
        console.log(poczekalnia.kimJestem)
        console.log(poczekalnia.tablicaSpanow[poczekalnia.numerGracza])
        if (e.target.checked) {
            poczekalnia.tablicaSpanow[poczekalnia.numerGracza].classList.add(poczekalnia.kimJestem.color)
            poczekalnia.chceGracNaSerer(e.target.checked)
        } else {
            poczekalnia.tablicaSpanow[poczekalnia.numerGracza].classList.remove(poczekalnia.kimJestem.color)
            poczekalnia.chceGracNaSerer(e.target.checked)
        }
    },

    chceGracNaSerer(status) {
        fetch('/taKtoraWysylaZapytania', { // adres serwera
            method: 'POST', //metoda
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                color: this.kimJestem.color,
                status: status
            }), //to co wysyłamy w postaci stringu JSONO'podonnego 
        })
            .then(response => response.json())
            .then(data => {
                //console.log(data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, startGry() {
        clearInterval(poczekalnia.synchronizacjaUzytkownikowInt)
        console.log("STARUJEMY")
        document.getElementById("isReady").remove();
        this.synch()
    }, synch() {
        var Dane = {
            gracze: this.bazaDanych.nicks,
            kimJestem: this.kimJestem,
            startTime: this.bazaDanych.users[0].startTime
        }
        let timeoutCount = this.bazaDanych.users[0].startTime - new Date().getTime();
        setTimeout(() => {
            //window.location.href = "/gra";
            //this.gra()
            gra.bazaDanych = this.bazaDanych
            gra.gra()
        }, timeoutCount);
    }

}

// class serverOperation {
//     constructor(data, adress) {
//         this.response = null
//         this.data = data || null
//         this.adress = adress

//         //this.contentType = contentType || config.contentTypes.json

//     }
//     startGry() {
//         return ("Data serverOperations: " + this.data)
//     }
//     async fetchData() {
//         console.log(this.data)
//     }
// }

