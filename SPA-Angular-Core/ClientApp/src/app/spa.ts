import {Component, OnInit} from "@angular/core";
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import "rxjs/add/operator/map";
import {Question} from "./Question";
import {Headers} from "@angular/http";


@Component({
    selector: "min-app",
    templateUrl: "SPA.html"
})
export class SPA {
    visSkjema: boolean;
    skjemaStatus: string;
    visKundeListe: boolean;
    alleKunder: Array<Question>; // for listen av alle kundene
    skjema: FormGroup;
    laster: boolean;
    
    constructor(private _http: Http, private fb: FormBuilder) {
        this.skjema = fb.group({
            id: [""],
            newQuestion: [null, Validators.compose([Validators.required, Validators.pattern("[a-zæøåA-ZÆØÅ0-9 \n\r_,'.-?]*")])],
            answer: [null, Validators.compose([Validators.required, Validators.pattern("[a-zæøåA-ZÆØÅ0-9 \n\r_,'.-?]*")])],
        });
    }
   
    ngOnInit() {
        this.laster = true;
        this.hentAlleKunder();
        this.visSkjema = false;
        this.visKundeListe = true;
    }

    hentAlleKunder() {
        this._http.get("api/question/")
           // .map(returData => {   --- .map er ikke lenger nødvendig!
           //     let JsonData = returData.json();
           //     return JsonData;
           // 
           .subscribe(
              JsonData => {
              this.alleKunder = [];
              if (JsonData) {
                for (let kundeObjekt of JsonData.json()) { // .json her
                        this.alleKunder.push(kundeObjekt);
                        this.laster = false;
                    }
                };
            },
            error => alert(error),
            () => console.log("ferdig get-api/question")
        );
    };

    vedSubmit() {
        if (this.skjemaStatus == "Registrere") {
            this.lagreKunde();
        }
        else if (this.skjemaStatus == "Endre") {
            this.endreEnKunde();
        }
        else {
            alert("Feil i applikasjonen!");
        }
    }

    registrerKunde() {
        // må resette verdiene i skjema dersom skjema har blitt brukt til endringer

        this.skjema.setValue({
            id: "",
            newQuestion: "",
            answer: "",
            
        });
        this.skjema.markAsPristine();
        this.visKundeListe = false;
        this.skjemaStatus = "Registrere";
        this.visSkjema = true;
    }

    tilbakeTilListe() {
        this.hentAlleKunder();
        this.visKundeListe = true;
        this.visSkjema = false;
    }

    lagreKunde() {
        var savedQuestion = new Question();

        savedQuestion.newQuestion = this.skjema.value.newQuestion;
        savedQuestion.answer = this.skjema.value.answer;       

        var body: string = JSON.stringify(savedQuestion);
        var headers = new Headers({ "Content-Type": "application/json" });

        this._http.post("api/question", body, { headers: headers })
            //.map(returData => returData.toString())
            .subscribe(
                retur=> {
                    this.hentAlleKunder();
                    this.visSkjema = false;
                    this.visKundeListe = true;
                },
            error => alert(error),
            () => console.log("ferdig post-api/question")
        );
    };

    sletteKunde(id: number) {
        this._http.delete("api/question/" + id)
            //.map(returData => returData.toString())
            .subscribe(
            retur => {
                this.hentAlleKunder();
            },
            error => alert(error),
            () => console.log("ferdig delete-api/question")
        );
    };

    upvoteQuestion(id: number) {
        console.log("upvote ID: " + id);
        this._http.get("api/Question/upvoteQuestion/" + id)
            .subscribe(
               retur => {
                    var s = document.getElementById("votes" + id).innerText;
                    var i = parseInt(s) + 1;
                    document.getElementById("votes" + id).innerHTML = i.toString();
                })
    }

    downvoteQuestion(id: number) {
        console.log("upvote ID: " + id);
        this._http.get("api/Question/downvoteQuestion/" + id)
            .subscribe(
                retur => {
                    var s = document.getElementById("votes" + id).innerText;
                    var i = parseInt(s) - 1;
                    document.getElementById("votes" + id).innerHTML = i.toString();
                })
    }
    // her blir kunden hentet og vist i skjema
    endreKunde(id: number) {
        this._http.get("api/question/"+id)
            //.map(returData => {
            //    let JsonData = returData.json();
            //    return JsonData;
            // })
            .subscribe(
            returData => { // legg de hentede data inn i feltene til endreSkjema. Kan bruke setValue også her da hele skjemaet skal oppdateres. 
                let JsonData = returData.json();
                this.skjema.patchValue({ id: JsonData.id });
                this.skjema.patchValue({ fornavn: JsonData.fornavn });
                this.skjema.patchValue({ etternavn: JsonData.etternavn });
                this.skjema.patchValue({ adresse: JsonData.adresse });
                this.skjema.patchValue({ postnr: JsonData.postnr });
                this.skjema.patchValue({ poststed: JsonData.poststed });
                },
            error => alert(error),
            () => console.log("ferdig get-api/question")
        );
        this.skjemaStatus = "Endre";
        this.visSkjema = true;
        this.visKundeListe = false;
    }
    // her blir den endrede kunden lagret
    endreEnKunde() {
        var updatedQuestion = new Question();

        updatedQuestion.newQuestion = this.skjema.value.fornavn;
        updatedQuestion.answer = this.skjema.value.etternavn;
        updatedQuestion.votes = this.skjema.value.adresse;
        

        var body: string = JSON.stringify(updatedQuestion);
        var headers = new Headers({ "Content-Type": "application/json" });

        this._http.put("api/question/" + this.skjema.value.id, body, { headers: headers })
            //.map(returData => returData.toString())
            .subscribe(
            retur => {
                this.hentAlleKunder();
                this.visSkjema = false;
                this.visKundeListe = true;
            },
            error => alert(error),
            () => console.log("ferdig post-api/question")
        );
    }
}


