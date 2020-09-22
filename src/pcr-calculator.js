// Create a Vue application


const app = Vue.createApp({
    data() {
        return {
            languages: ['de', 'en'],
            locale: 'en'
        }
    },
    computed: {
        currentComponent() {
            return 'pcr-' + this.locale.toLowerCase()
        }
    },
    methods: {
        getImgUrl(lang) {
            return require('./src/locales/' + lang + ".svg")
        }
    }

})


app.component('pcr-de', {
    data() {
        return {
            total_samples: '10000',
            infectionsrate_percent: '2',
            sensitivity_percent: '98,0',
            specificity_percent: '98,0',
            real_positive: 0,
            real_negative: 0,
            test_positive: 0,
            test_falsenegative: 0,
            test_falsepositive: 0,
            test_negative: 0,
            total_testpositive: 0,
            total_testnegative: 0,
            falsepositive_rate: 0,
            falsenegative_rate: 0,
            ppv: 0,
            npv: 0,
        }
    },
    methods: {
        calc_all() {
            this.real_negative = this.total_samples.replace(',', '.') - this.real_positive;
            this.test_positive = Number(this.sensitivity_percent.replace(',', '.')) / 100 * Number(this.real_positive);
            this.test_negative = Number(this.specificity_percent.replace(',', '.')) / 100 * Number(this.real_negative);
            this.test_falsenegative = Number(this.real_positive) - Number(this.test_positive);
            this.test_falsepositive = Number(this.real_negative) - Number(this.test_negative);
            this.total_testpositive = this.test_positive + this.test_falsepositive;
            this.total_testnegative = this.test_negative + this.test_falsenegative;
            this.falsepositive_rate = (this.test_falsepositive / this.total_testpositive);
            this.falsenegative_rate = (this.test_falsenegative / this.total_testnegative);
            this.ppv = (this.test_positive / this.total_testpositive);
            this.npv = (this.test_negative / this.total_testnegative);
        },
        calc_test() {
            this.total_testpositive = this.test_positive + this.test_falsepositive;
            this.total_testnegative = this.test_negative + this.test_falsenegative;
            this.falsepositive_rate = (this.test_falsepositive / this.total_testpositive);
            this.falsenegative_rate = (this.test_falsenegative / this.total_testnegative);
            this.ppv = (this.test_positive / this.total_testpositive);
            this.npv = (this.test_negative / this.total_testnegative);
        }
    },
    watch: {
        total_samples: function(val) {
            this.real_positive = val * Number(this.infectionsrate_percent.replace(',', '.')) / 100;
            this.calc_all();

        },
        infectionsrate_percent: function(val) {
            this.real_positive = Number(val.replace(',', '.')) / 100 * this.total_samples;
            this.calc_all();
        },
        sensitivity_percent: function(val) {
            this.test_positive = Number(val.replace(',', '.')) / 100 * Number(this.real_positive);
            this.test_falsenegative = Number(this.real_positive) - Number(this.test_positive);
            this.calc_test();
        },
        specificity_percent: function(val) {
            this.test_negative = Number(val.replace(',', '.')) / 100 * Number(this.real_negative);
            this.test_falsepositive = Number(this.real_negative) - Number(this.test_negative);
            this.calc_test();
        },
    },
    created: function() {
        this.real_positive = this.total_samples * Number(this.infectionsrate_percent.replace(',', '.')) / 100;
        this.calc_all();
    },
    template: `<div  class="jumbotron">
        <h2 class='text-center' href='#pcr'>PCR-Testergebnisse in der Epidemiologie</h2>
    </div>

    <div class='container'>
        <div class='row'>
            <div class='input-group mb-3 col-md-4'>

                <div class='input-group-prepend'>
                    <span  class='input-group-text bg-info text-white' id='inputGroup-sizing-default'>Anzahl der Testungen :</span>
                    
                </div>
                <input type='text' class='form-control' v-model='total_samples'>
            </div>
            <div class='input-group mb-3 col-md-4'>
                <div class='input-group-prepend'>
                    <span  class='input-group-text bg-info text-white' id='inputGroup-sizing-default'>Durchseuchungsrate:</span>
                </div>
                <input type='text' class='form-control' v-model='infectionsrate_percent'>
                <div class='input-group-append'>
                    <span class='input-group-text'>%</span>
                </div>
            </div>
        </div>
        <div class='row'>
            <table class='table'>
                <thead>
                    <tr>
                        <th  scope='col'>Test Specs</th>
                        <th scope='col'></th>
                        <th  scope='col'>Proben</th>
                        <th  scope='col'>+ Testergebnisse</th>
                        <th scope='col'>- Testergebnisse</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th  scope='row' class='col-md-3'>Sensitivität  <input type='text' style="width:50px; padding: 0 2px;" v-model='sensitivity_percent'> %</th>
                        <th  class='col-md-1'>Echte +</th>

                        <td class='col-md-2'>{{real_positive}}</td>
                        <td class="text-success col-md-2">{{test_positive}} </td>
                        <td class="text-danger col-md-2">{{test_falsenegative}}</td>
                    </tr>
                    <tr>
                        <th  scope='row' class='col-md-3'>Spezifität <input type='text' style="width:50px;padding: 0 2px;" v-model='specificity_percent'> %</th>
                        <th class='col-md-1'>Echte -</th>
                        <td class='col-md-2'>{{real_negative}}</td>
                        <td class="text-danger col-md-2">{{test_falsepositive}}</td>
                        <td class="text-success col-md-2">{{test_negative}}</td>
                    </tr>
                    <tr>
                        <th scope='row'></th>
                        <th>Total:</th>
                        <td>{{total_samples}}</td>
                        <td>{{total_testpositive}}</td>
                        <td>{{total_testnegative}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class='dropdown-divider'></div>
        <div class='row'>
            <div class='row'>
                <div class='input-group mb-3 col-md-6'>

                    <div class='input-group-prepend'>
                        <span  class='input-group-text bg-danger text-white' id='inputGroup-sizing-default'>Falsch-positiv-Rate:</span>
                    </div>
                    <div class='input-group-append'>
                        <span class='input-group-text '>{{(falsepositive_rate*100).toFixed(2)}} %</span>
                    </div>
                </div>
                <div class='input-group mb-3 col-md-6'>
                    <div class='input-group-prepend'>
                        <span  class='input-group-text bg-info text-white' id='inputGroup-sizing-default'>Falsch-negativ-Rate:</span>
                    </div>
                    <div class='input-group-append'>
                        <span class='input-group-text'>{{(falsenegative_rate *100).toFixed(2)}} %</span>
                    </div>
                </div>

                <div class='input-group mb-3 col-md-6'>

                    <div class='input-group-prepend'>
                        <span  class='input-group-text bg-danger text-white' id='inputGroup-sizing-default'>Positiver Vorhersagewert(PV) :</span>
                    </div>

                    <div class='input-group-append'>
                        <span class='input-group-text'>{{(ppv *100).toFixed(2)}} %</span>
                    </div>
                </div>
                <div class='input-group mb-3 col-md-6'>
                    <div class='input-group-prepend'>
                        <span class='input-group-text bg-info text-white' id='inputGroup-sizing-default'>Negativer Vorhersagewert(PV) :</span>
                    </div>

                    <div class='input-group-append'>
                        <span class='input-group-text'>{{(npv * 100).toFixed(2)}} %</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-group">
            <div class="card">
            <img src="assets/pcr-for-dummies.jpg" class="img-fluid" alt="Responsive image">
            <div class="card-body">
                <h5 class="card-title">Anmerkung</h5>
                <ul class="card-text">
                    <li>Die Zuverlässigkeit des PCR-Tests hängt stark von den drei Faktoren ab (nämlich von der Sensitivität/Empfindlichkeit des Testgeräts, der Spezifität der Testdatenbank und der Infektionsrate / -prävalenz in der getesteten Region).</li>
                    <li>Um die Infektionsrate (Prävalenz) zu bestimmen, müssen wir die Anzahl der gemeldeten kranken Patienten kennen.</li>
                    <li>100% der Empfindlichkeit bedeutet, dass das positive Testergebnis 100% des realen Positivs darstellt. Die Anzahl der Zyklen des Testparameters ändert die Empfindlichkeit.</li>
                    <li>100% der Spezifität bedeutet, dass das negative Testergebnis 100% des realen Negativs darstellt.</li>
                    <li><a href="https://en.wikipedia.org/wiki/Positive_and_negative_predictive_values">PV und NV</a> repräsentieren die Zuverlässigkeit des Testergebnisses. Je höher der Vorhersagewert ist, desto zuverlässiger ist das Ergebnis.</li>
                    <li>Die mathematische Berechnung heißt Bayes-Theorem, mehr zum Vertiefen: <a href="https://sphweb.bumc.bu.edu/otlt/MPH-Modules/BS/BS704_Probability/BS704_Probability6.html">"https://sphweb.bumc.bu.edu/otlt/MPH-Modules/BS/BS704_Probability/BS704_Probability6.html"</a></li>
                    <li>Videoquelle von dem Livestream mit Prof. Dr. Dr. Martin Haditsch:<a href="https://youtu.be/RFzBG_XMn_E?t=664">https://youtu.be/RFzBG_XMn_E?t=664</a></li>
                </ul>
            </div>
            </div>
        </div>
    </div>`
})

app.component('pcr-en', {
    data() {
        return {
            total_samples: 10000,
            infectionsrate_percent: '2.0',
            sensitivity_percent: '98.0',
            specificity_percent: '98.0',
            real_positive: 0,
            real_negative: 0,
            test_positive: 0,
            test_falsenegative: 0,
            test_falsepositive: 0,
            test_negative: 0,
            total_testpositive: 0,
            total_testnegative: 0,
            falsepositive_rate: 0,
            falsenegative_rate: 0,
            ppv: 0,
            npv: 0,
        }
    },
    methods: {
        calc_all() {
            this.real_negative = this.total_samples - this.real_positive;
            this.test_positive = Number(this.sensitivity_percent.replace(',', '.')) / 100 * Number(this.real_positive);
            this.test_negative = Number(this.specificity_percent.replace(',', '.')) / 100 * Number(this.real_negative);
            this.test_falsenegative = Number(this.real_positive) - Number(this.test_positive);
            this.test_falsepositive = Number(this.real_negative) - Number(this.test_negative);
            this.total_testpositive = this.test_positive + this.test_falsepositive;
            this.total_testnegative = this.test_negative + this.test_falsenegative;
            this.falsepositive_rate = (this.test_falsepositive / this.total_testpositive);
            this.falsenegative_rate = (this.test_falsenegative / this.total_testnegative);
            this.ppv = (this.test_positive / this.total_testpositive);
            this.npv = (this.test_negative / this.total_testnegative);
        },
        calc_test() {
            this.total_testpositive = this.test_positive + this.test_falsepositive;
            this.total_testnegative = this.test_negative + this.test_falsenegative;
            this.falsepositive_rate = (this.test_falsepositive / this.total_testpositive);
            this.falsenegative_rate = (this.test_falsenegative / this.total_testnegative);
            this.ppv = (this.test_positive / this.total_testpositive);
            this.npv = (this.test_negative / this.total_testnegative);
        }
    },
    watch: {
        total_samples: function(val) {
            this.real_positive = val * this.infectionsrate_percent / 100;
            this.calc_all();

        },
        infectionsrate_percent: function(val) {
            this.real_positive = Number(val.replace(',', '.')) / 100 * this.total_samples;
            this.calc_all();
        },
        sensitivity_percent: function(val) {
            this.test_positive = val.replace(',', '.') / 100 * Number(this.real_positive);
            this.test_falsenegative = Number(this.real_positive) - Number(this.test_positive);
            this.calc_test();
        },
        specificity_percent: function(val) {
            this.test_negative = val.replace(',', '.') / 100 * Number(this.real_negative);
            this.test_falsepositive = Number(this.real_negative) - Number(this.test_negative);
            this.calc_test();
        },
    },
    created: function() {
        this.real_positive = this.total_samples * Number(this.infectionsrate_percent.replace(',', '.')) / 100;
        this.calc_all();
    },
    template: `
    <div class="jumbotron">
        <h2 class='text-center' href='#pcr'>Understanding the PCR Test Results in Epidemiology</h2>
    </div>
    <div class='container'>
        <div class='row'>
            <div class='input-group mb-3 col-md-4'>
                <div class='input-group-prepend'>
                    <span class='input-group-text bg-info text-white' id='inputGroup-sizing-default'>Number of Tests :</span>
                </div>
                <input type='text' class='form-control' v-model='total_samples'>
            </div>
            <div class='input-group mb-3 col-md-4'>
                <div class='input-group-prepend'>
                    <span class='input-group-text bg-info text-white' id='inputGroup-sizing-default'>Rate of Infection :</span>
                </div>
                <input type='text' class='form-control' v-model='infectionsrate_percent'>
                <div class='input-group-append'>
                    <span class='input-group-text'>%</span>
                </div>
            </div>
        </div>
        <div class='row'>
            <table class='table'>
                <thead>
                    <tr>
                        <th scope='col'>Test Specs</th>
                        <th scope='col'></th>
                        <th scope='col'>Samples</th>
                        <th scope='col'>Test Result +</th>
                        <th scope='col'>Test Result -</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope='row' class='col-md-3'>Sensitivity <input type='text' style="width:50px; padding: 0 2px;" v-model='sensitivity_percent'> %</th>
                        <th class='col-md-1'>Real +</th>
                        <td class='col-md-2'>{{real_positive}}</td>
                        <td class="text-success col-md-2">{{test_positive}} </td>
                        <td class="text-danger col-md-2">{{test_falsenegative}}</td>
                    </tr>
                    <tr>
                        <th scope='row' class='col-md-3'>Specificity <input type='text' style="width:50px;padding: 0 2px;" v-model='specificity_percent'> %</th>
                        <th class='col-md-1'>Real -</th>
                        <td class='col-md-2'>{{real_negative}}</td>
                        <td class="text-danger col-md-2">{{test_falsepositive}}</td>
                        <td class="text-success col-md-2">{{test_negative}}</td>
                    </tr>
                    <tr>
                        <th scope='row'></th>
                        <th>Total:</th>
                        <td>{{total_samples}}</td>
                        <td>{{total_testpositive}}</td>
                        <td>{{total_testnegative}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class='dropdown-divider'></div>
        <div class='row'>
            <div class='row'>
                <div class='input-group mb-3 col-md-6'>

                    <div class='input-group-prepend'>
                        <span  class='input-group-text bg-danger text-white' id='inputGroup-sizing-default'>False Positive Rate:</span>
                    </div>
                    <div class='input-group-append'>
                        <span class='input-group-text '>{{(falsepositive_rate*100).toFixed(2)}} %</span>
                    </div>
                </div>
                <div class='input-group mb-3 col-md-6'>
                    <div class='input-group-prepend'>
                        <span class='input-group-text bg-info text-white' id='inputGroup-sizing-default'>False Negative Rate:</span>
                    </div>
                    <div class='input-group-append'>
                        <span class='input-group-text'>{{(falsenegative_rate *100).toFixed(2)}} %</span>
                    </div>
                </div>

                <div class='input-group mb-3 col-md-6'>

                    <div class='input-group-prepend'>
                        <span class='input-group-text bg-danger text-white' id='inputGroup-sizing-default'>Positive Predictive Value(PPV) :</span>
                    </div>

                    <div class='input-group-append'>
                        <span class='input-group-text'>{{(ppv *100).toFixed(2)}} %</span>
                    </div>
                </div>
                <div class='input-group mb-3 col-md-6'>
                    <div class='input-group-prepend'>
                        <span class='input-group-text bg-info text-white' id='inputGroup-sizing-default'>Negative Predictive Value (NPV) :</span>
                    </div>

                    <div class='input-group-append'>
                        <span class='input-group-text'>{{(npv * 100).toFixed(2)}} %</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title">Notes</h5>
            <ul class="card-text">
                <li>The reliability of the PCR test depends strongly on the 3 factors (the sensitivity, the specificity of the test device, and the infection rate/prevalence in the tested region).</li>
                <li>In order to determine the infection rate (prevalence), we have to know the number of the reported sick patients.</li>
                <li>100% of sensitivity means that the positive test result represents 100% the real positive. The number of cycles of the test parameter changes the sensitivity.</li>
                <li>100% of specificity means that the negative test result represents 100% the real negative.</li>
                <li><a href="https://en.wikipedia.org/wiki/Positive_and_negative_predictive_values">PPV and NPV</a> represent the reliability of the test result. The higher the predictive value, the more reliable is the result.</li>
                <li>The mathematical calculation is called the Bayes's Theorem, see this article for more details: <a href="https://sphweb.bumc.bu.edu/otlt/MPH-Modules/BS/BS704_Probability/BS704_Probability6.html">https://sphweb.bumc.bu.edu/otlt/MPH-Modules/BS/BS704_Probability/BS704_Probability6.html</a></li>
                <li>Video source Livestream with Prof. Dr. Dr. Martin Haditsch: <a href="https://youtu.be/RFzBG_XMn_E?t=664">https://youtu.be/RFzBG_XMn_E?t=664</a></li>
            </ul>
        </div>
    </div>`
})

app.mount('#pcr_calc')