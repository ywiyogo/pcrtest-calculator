// Create a Vue application
const app = Vue.createApp({})

app.component('pcr-comp', {
    data() {
        return {
            total_samples: 10000,
            infectionsrate_percent: 2,
            sensitivity_percent: 98,
            specificity_percent: 97,
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
            this.test_positive = Number(this.sensitivity_percent) / 100 * Number(this.real_positive);
            this.test_negative = Number(this.specificity_percent) / 100 * Number(this.real_negative);
            this.test_falsenegative = Number(this.real_positive) - Number(this.test_positive);
            this.test_falsepositive = Number(this.real_negative) - Number(this.test_negative);
            this.total_testpositive = this.test_positive + this.test_falsepositive;
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
            this.real_positive = val / 100 * this.total_samples;
            this.calc_all();
        },
        sensitivity_percent: function(val) {
            this.test_positive = val / 100 * Number(this.real_positive);
            this.test_falsenegative = Number(this.real_positive) - Number(this.test_positive);
            this.calc_test();
        },
        specificity_percent: function(val) {
            this.test_negative = val / 100 * Number(this.real_negative);
            this.test_falsepositive = Number(this.real_negative) - Number(this.test_negative);
            this.calc_test();
        },
    },
    created: function() {
        this.real_positive = this.total_samples * this.infectionsrate_percent / 100;
        this.calc_all();
    },
    template: `
    <div class="jumbotron">
        <h2 class='text-center' href='#pcr'>Understanding the PCR Test Results in Epidemiology using the Bayes's Theorem</h2>
    </div>
    <div class='container'>
        <div class='row'>
            <div class='input-group mb-3 col-md-3'>

                <div class='input-group-prepend'>
                    <span class='input-group-text bg-info text-white' id='inputGroup-sizing-default'>Number of Tests :</span>
                </div>
                <input type='text' class='form-control' v-model='total_samples'>
            </div>
            <div class='input-group mb-3 col-md-3'>
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
                        <span class='input-group-text bg-danger text-white' id='inputGroup-sizing-default'>False Positive Rate:</span>
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
                <li>The mathematical calculation is called the Bayes's Theorem, see this <a href="https://sphweb.bumc.bu.edu/otlt/MPH-Modules/BS/BS704_Probability/BS704_Probability6.html">article for more details.</a></li>
                <li>Video source <a href="https://youtu.be/RFzBG_XMn_E?t=664">Livestream with Prof. Dr. Dr. Martin Haditsch.</a></li>
            </ul>
        </div>
    </div>`
})

app.mount('#pcr_calc')