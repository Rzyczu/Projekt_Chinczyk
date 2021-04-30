
var ctx = null;
window.addEventListener('DOMContentLoaded', () => {
    poczekalnia.pobierzUzytkownikow()
    poczekalnia.synchronizujPoczkelanie()
    document.querySelector('input[type=checkbox]').addEventListener('input', poczekalnia.chceGrac)
    const canvas = document.getElementById('canvasPlansza');
    ctx = canvas.getContext('2d');
})




const poczekalnia = {
    tablicaUzytkownikow: [],
    bazaDanych: {},
    kimJestem: {},
    ktoChceGrac: [],
    tablicaSpanow: [],
    numerGracza: null,
    synchronizacjaUzytkownikowInt: null,
    synchronizacjaGryInt: null,
    toursInterwal: null,
    timeTour: null,
    whoseTour: null,
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
        }, 4000)
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
    },

    startGry() {
        clearInterval(poczekalnia.synchronizacjaUzytkownikowInt)
        console.log("STARUJEMY")
        document.getElementById("isReady").remove();
        this.graStatus();

        //         //console.log(poczekalnia)

        //         poczekalnia.bazaDanych.users.forEach((element, counter) => {
        //             poczekalnia.tablicaSpanow[counter].classList.add(element.color)
        //             element.status = "waiting"
        //         })

        //         poczekalnia.tury(0);

        //         // this.bazaDanych.users.forEach((element, counter) => {
        //         //     element.status = "playing"
        //         //     if (this.kimJestem.idGracza == element.idGracza) {
        //         //         console.log(element.nicks)
        //         //         console.log("Twoja tura")
        //         //     }
        //         // })
    }, graStatus() {
        /* 
        Funkcja służąca do pobrania wszystkich aktualnie obecnych graczy wywoływana 1 przy starcie i cyklicznie aż do statu gry
        */
        fetch('/graStat', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.bazaDanych = {
                    ...data
                }
                // this.numerGracza = data.kimJestem.idGracza
                // this.kimJestem = {
                //     ...data.kimJestem
                // }
                // this.nazwijUzytkownikow()
                // if (data.status) {
                //     this.startGry()
                // }
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
    }, synchronizujGre() {
        this.synchronizacjaGryInt = setInterval(() => {
            this.graStatus()
        }, 4000)
    },
    // tury(id) {
    //     this.toursInterwal = setInterval(() => {


    //         this.bazaDanych.users[id].status = "playing"

    //         if (document.getElementById("dice") != null) {
    //             document.getElementById("dice").remove();
    //         }

    //         if (this.kimJestem.idGracza == this.bazaDanych.users[id].idGracza) {

    //             console.log("Twoja tura")
    //             var ileOczek = null;



    //             var plansza = document.getElementById("plansza")
    //             var img = document.createElement("img");
    //             img.src = "../photos/dice.png";
    //             img.id = "dice"
    //             img.style.position = "absolute"
    //             img.style.top = "2vh"
    //             img.style.left = "2vw"
    //             img.style.height = "80px"
    //             img.style.width = "80px"
    //             //console.log(plansza)
    //             plansza.appendChild(img);

    //             img.addEventListener("click", function () {
    //                 if (ileOczek == null) {
    //                     ileOczek = Math.floor(Math.random() * 6) + 1
    //                 }
    //                 //console.log(ileOczek)

    //                 var img = new Image;
    //                 img.onload = function () {
    //                     var sy = null
    //                     if (ileOczek <= 3) {
    //                         sy = 65
    //                     } else {
    //                         sy = 430
    //                     }
    //                     console.log(ileOczek)
    //                     ctx.drawImage(img, 85 + 310 * (ileOczek - 1), sy, 235, 235, 50, 50, 100, 100);
    //                 };
    //                 img.src = "https://mendela.pl/iii/chinczyk/img/kostka.jpg";
    //             });

    //         }



    //         if (id == this.bazaDanych.users.length - 1)
    //             id = 0
    //         else
    //             id++
    //     }, 2000)
    // },

    //taKtoraWysylaZapytania
}