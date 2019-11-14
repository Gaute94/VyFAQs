"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
require("rxjs/add/operator/map");
var Kunde_1 = require("./Kunde");
var http_2 = require("@angular/http");
var SPA = (function () {
    function SPA(_http, fb) {
        this._http = _http;
        this.fb = fb;
        this.skjema = fb.group({
            id: [""],
            fornavn: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern("[a-zA-ZøæåØÆÅ\\-. ]{2,30}")])],
            etternavn: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern("[a-zA-ZøæåØÆÅ\\-. ]{2,30}")])],
            adresse: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern("[0-9a-zA-ZøæåØÆÅ\\-. ]{2,30}")])],
            postnr: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern("[0-9]{4}")])],
            poststed: [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern("[a-zA-ZøæåØÆÅ\\-. ]{2,30}")])]
        });
    }
    SPA.prototype.ngOnInit = function () {
        this.laster = true;
        this.hentAlleKunder();
        this.visSkjema = false;
        this.visKundeListe = true;
    };
    SPA.prototype.hentAlleKunder = function () {
        var _this = this;
        this._http.get("api/kunde/")
            .map(function (returData) {
            var JsonData = returData.json();
            return JsonData;
        })
            .subscribe(function (JsonData) {
            _this.alleKunder = [];
            if (JsonData) {
                for (var _i = 0, JsonData_1 = JsonData; _i < JsonData_1.length; _i++) {
                    var kundeObjekt = JsonData_1[_i];
                    _this.alleKunder.push(kundeObjekt);
                    _this.laster = false;
                }
            }
            ;
        }, function (error) { return alert(error); }, function () { return console.log("ferdig get-api/kunde"); });
    };
    ;
    SPA.prototype.vedSubmit = function () {
        if (this.skjemaStatus == "Registrere") {
            this.lagreKunde();
        }
        else if (this.skjemaStatus == "Endre") {
            this.endreEnKunde();
        }
        else {
            alert("Feil i applikasjonen!");
        }
    };
    SPA.prototype.registrerKunde = function () {
        // må resette verdiene i skjema dersom skjema har blitt brukt til endringer
        this.skjema.setValue({
            id: "",
            fornavn: "",
            etternavn: "",
            adresse: "",
            postnr: "",
            poststed: ""
        });
        this.skjema.markAsPristine();
        this.visKundeListe = false;
        this.skjemaStatus = "Registrere";
        this.visSkjema = true;
    };
    SPA.prototype.tilbakeTilListe = function () {
        this.visKundeListe = true;
        this.visSkjema = false;
    };
    SPA.prototype.lagreKunde = function () {
        var _this = this;
        var lagretKunde = new Kunde_1.Kunde();
        lagretKunde.fornavn = this.skjema.value.fornavn;
        lagretKunde.etternavn = this.skjema.value.etternavn;
        lagretKunde.adresse = this.skjema.value.adresse;
        lagretKunde.postnr = this.skjema.value.postnr;
        lagretKunde.poststed = this.skjema.value.poststed;
        var body = JSON.stringify(lagretKunde);
        var headers = new http_2.Headers({ "Content-Type": "application/json" });
        this._http.post("api/kunde", body, { headers: headers })
            .map(function (returData) { return returData.toString(); })
            .subscribe(function (retur) {
            _this.hentAlleKunder();
            _this.visSkjema = false;
            _this.visKundeListe = true;
        }, function (error) { return alert(error); }, function () { return console.log("ferdig post-api/kunde"); });
    };
    ;
    SPA.prototype.sletteKunde = function (id) {
        var _this = this;
        this._http.delete("api/kunde/" + id)
            .map(function (returData) { return returData.toString(); })
            .subscribe(function (retur) {
            _this.hentAlleKunder();
        }, function (error) { return alert(error); }, function () { return console.log("ferdig delete-api/kunde"); });
    };
    ;
    // her blir kunden hentet og vist i skjema
    SPA.prototype.endreKunde = function (id) {
        var _this = this;
        this._http.get("api/kunde/" + id)
            .map(function (returData) {
            var JsonData = returData.json();
            return JsonData;
        })
            .subscribe(function (JsonData) {
            _this.skjema.patchValue({ id: JsonData.id });
            _this.skjema.patchValue({ fornavn: JsonData.fornavn });
            _this.skjema.patchValue({ etternavn: JsonData.etternavn });
            _this.skjema.patchValue({ adresse: JsonData.adresse });
            _this.skjema.patchValue({ postnr: JsonData.postnr });
            _this.skjema.patchValue({ poststed: JsonData.poststed });
        }, function (error) { return alert(error); }, function () { return console.log("ferdig get-api/kunde"); });
        this.skjemaStatus = "Endre";
        this.visSkjema = true;
        this.visKundeListe = false;
    };
    // her blir den endrede kunden lagret
    SPA.prototype.endreEnKunde = function () {
        var _this = this;
        var endretKunde = new Kunde_1.Kunde();
        endretKunde.fornavn = this.skjema.value.fornavn;
        endretKunde.etternavn = this.skjema.value.etternavn;
        endretKunde.adresse = this.skjema.value.adresse;
        endretKunde.postnr = this.skjema.value.postnr;
        endretKunde.poststed = this.skjema.value.poststed;
        var body = JSON.stringify(endretKunde);
        var headers = new http_2.Headers({ "Content-Type": "application/json" });
        this._http.put("api/kunde/" + this.skjema.value.id, body, { headers: headers })
            .map(function (returData) { return returData.toString(); })
            .subscribe(function (retur) {
            _this.hentAlleKunder();
            _this.visSkjema = false;
            _this.visKundeListe = true;
        }, function (error) { return alert(error); }, function () { return console.log("ferdig post-api/kunde"); });
    };
    return SPA;
}());
SPA = __decorate([
    core_1.Component({
        selector: "min-app",
        templateUrl: "./app/SPA.html"
    }),
    __metadata("design:paramtypes", [http_1.Http, forms_1.FormBuilder])
], SPA);
exports.SPA = SPA;
//# sourceMappingURL=SPA.js.map