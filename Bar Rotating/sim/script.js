// Global variables
var category = "";
var page = " ";



var values = { // m for model
    m: 0, // Already pulled from smartsparrow. How to I set random inputs?
    L: 0,
    b: 0,
    I_G: 0,
    I_o: 0,
    O_x_1: 0,
    O_y_1: 0,
    O_1: 0,
    w_1: 0,
    alpha_1: 0,
    w_2: 0,
    alpha_2: 0,
    V_2: 0,
    O_x_2: 0,
    O_y_2: 0,
    O_2: 0,
};

var valuesRounded = {
    m: 0, // all these should be 0 for some reason. I guess it doesn't matter?
    L: 0,
    b: 0,
    I_G: 0,
    I_o: 0,
    O_x_1: 0,
    O_y_1: 0,
    O_1: 0,
    w_1: 0,
    alpha_1: 0,
    w_2: 0,
    alpha_2: 0,
    V_2: 0,
    O_x_2: 0,
    O_y_2: 0,
    O_2: 0,
};

var names = { //choose how to write variable string.
    m: "m",
    L: "L",
    b: "b",
    I_G: "I<sub>G</sub>",
    I_o: "I<sub>o</sub>",
    O_x_1: "O<sub>x</sub>",
    O_y_1: "O<sub>y</sub>",
    O_1: "O",
    w_1: "&#969",
    alpha_1: "&#945",
    w_2: "&#969",
    alpha_2: "&#945",
    V_2: "V<sub>A</sub>",
    O_x_2: "O<sub>x</sub>",
    O_y_2: "O<sub>y</sub>",
    O_2: "O",
};

var units = { //write the units
    m: "kg",
    L: "m",
    b: "m",
    I_G: "kgm<sup>2</sup>",
    I_o: "kgm<sup>2</sup>",
    O_x_1: "N",
    O_y_1: "N",
    O_1: "N",
    w_1: "rad s<sup>-1</sup>",
    alpha_1: "rad s<sup>-2</sup>",
    w_2: "rad s<sup>-1</sup>",
    alpha_2: "rad s<sup>-2</sup>",
    V_2: "m/s",
    O_x_2: "N",
    O_y_2: "N",
    O_2: "N",
};


// Get values from SS
var model = new pipit.CapiAdapter.CapiModel({
    m: 0, 
    L: 0,
    b: 0,
    I_G: 0,
    I_o: 0,
    O_x_1: 0,
    O_y_1: 0,
    O_1: 0,
    w_1: 0,
    alpha_1: 0,
    w_2: 0,
    alpha_2: 0,
    V_2: 0,
    O_x_2: 0,
    O_y_2: 0,
    O_2: 0,
    // m: " ", 
    // L: " ",
    // b: " ",
    // I_G: " ",
    // I_o: " ",
    // O_x_1: " ",
    // O_y_1: " ",
    // O_1: " ",
    // w_1: " ",
    // alpha_1: " ",
    // w_2: " ",
    // alpha_2: " ",
    // V_2: " ",
    // O_x_2: " ",
    // O_y_2: " ",
    // O_2: " ",
    page: "10",
});
// I think this exposes the values to Smart Sparrow. :D
pipit.CapiAdapter.expose('m', model);
pipit.CapiAdapter.expose('L', model);
pipit.CapiAdapter.expose('b', model);
pipit.CapiAdapter.expose('I_G', model);
pipit.CapiAdapter.expose('I_o', model);
pipit.CapiAdapter.expose('O_x_1', model);
pipit.CapiAdapter.expose('O_y_1', model);
pipit.CapiAdapter.expose('O_1', model);
pipit.CapiAdapter.expose('w_1', model);
pipit.CapiAdapter.expose('alpha_1', model);
pipit.CapiAdapter.expose('w_2', model);
pipit.CapiAdapter.expose('V_2', model);
pipit.CapiAdapter.expose('O_x_2', model);
pipit.CapiAdapter.expose('O_y_2', model);
pipit.CapiAdapter.expose('O_2', model);
pipit.CapiAdapter.expose('page', model);

//this gets the values from Smart Sparrow. So does that mean I need to put inputs into Smart Sparrow variable tab? Either way, I'm sure these are just the inputs
//I think I can place M R theta_deg in variables. Then make pages # in iniitial state. Then i'm done??!
pipit.Controller.notifyOnReady();

model.on("change:m", function() {
    draw();
});
model.on("change:L", function() {
    draw();
});
model.on("change:b", function() {
    draw();
});
model.on("change:w_1", function() {
    draw();
});
model.on("change:page", function() {
     draw();
});

// This is JQuery right? 
$("#selectBox").change(function() {
    draw();
});

//this is the generic function which does all the magic. It gets the values from SS then calculates them then figures out which catagory its in (how does it know what question #? from getvaleusformSS function!!) then displays the values
function draw() {
    getValuesFromSS();
    calculateVariables();

    category = $("#selectBox option:selected").val();
    sendValuesToSS();
    displayValues();
}

//there is no need to send the input values back to smart sparrow. so only send the values that have been calculated.
function sendValuesToSS() {
    model.set("I_G", values.I_G);
    model.set("I_o", values.I_o);
    model.set("O_x_1", values.O_x_1);
    model.set("O_y_1", values.O_y_1);
    model.set("O_1", values.O_1);
    model.set("alpha_1", values.alpha_1);
    model.set("w_2", values.w_2);
    model.set("V_2", values.V_2);
    model.set("O_x_2", values.O_x_2);
    model.set("O_y_2", values.O_y_2);
    model.set("O_2", values.O_2);
}
// what is the purpose of the num == 4 ? Is this to make it fit to the table somehow?
function displayValues() {
    var show = getShowVariables();
    var s = "<table class=right><tr><td>";
    var num = 1;

    $.each(show, function(i, e) {
        var name = names[e]; // objects can reference members by object.property or by object['property'], allowing you to use variables
        var value = valuesRounded[e];
        var unit = units[e];

        s += name + " = " + value + " " + unit + "<br>";

        if (num == 4) {
            s += "</td><td>";
            num = 0
        }
        num++;

    });

    s += "</td></tr></table>";

    $("#right")[0].innerHTML = s;
}







//THIS IS A HUGE PROBLEM!! I DON'T WANT TO GET THE VALUES FROM ANOTHER SIM (TMIN, TMAX) SHOULD I JUST PLACE THEM IN VARIABLES (LOOK BELOW)








// Here i'm getting all the inputs from Smart Sparrow. This is the start of the draw function. Only put in inputs because other variables won't be there
function getValuesFromSS() {
    values.m = model.get('m');
    values.L = model.get('L');
    page = model.get('page');
    values.b = model.get('b');
    values.w_1 = model.get('w_1');
}
//ones the inputs are pulled from Smart Sparrow then they're calculated (all part of the draw function). Make sure I start from elementary formulas and work done.
function calculateVariables() {
    values.I_G = values.m * values.L * values.L / 12;
    values.I_o = values.I_G + values.m * values.b * values.b;
    values.O_x_1 = 0;
    values.O_y_1 = values.m * 9.81 * (1 - values.m * values.b * values.b / values.I_o);
    values.O_1 = values.O_y_1;
    values.alpha_1 = values.m * 9.81 * values.b / values.I_o;
    values.w_2 = Math.sqrt(2 * values.m * 9.81 * values.b / values.I_o);
    values.V_2 = values.w_2 * (values.b + values.L / 2);
    values.alpha_2 = 0;
    values.O_x_2 = 0;
    values.O_y_2 = values.m * 9.81 + values.m * values.b * values.w_2 * values.w_2;
    values.O_2 = values.O_y_2;


    // Round values into valuesRounded
    $.each(values, function(i, e) {
        valuesRounded[i] = round(values[i]);
    })
}
// case 1 = catagory 1. Is the order determiend by the order in the HTML code?
// page 3 = 30. Page 3 from start of SS tutorial? Start at page 0 or page 1? Why is crank shaft velocity page 1??!
// For case 1, pages 3,4,5,6,7,8 and 9 are all taken care of by the one return line. right?
// what is the max number of variables per category??
// what happens if I have less than 5 categories? How do I specify 3 categories for example?
function getShowVariables() {
    switch (category) {
        case "1": // Category 1
            switch (page) {
                case "10": 
                case "20": 
                case "30": 
                case "40": 
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["m", "L", "b"];
                    break;
            }
            break;

        case "2": // Category 2
            switch (page) {
                case "10":
                    return [];
                    break;
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["I_G", "I_o"];
                    break;
            }
            break;

        case "3":
            switch (page) {
                case "10":
                    return [];
                    break;
                case "20":
                    return ["w_1"];
                    break;
                case "30":
                    return ["w_1", "O_x_1"];
                    break;
                case "40":
                    return ["w_1", "alpha_1", "O_x_1", "O_y_1"];
                    break;
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["w_1", "alpha_1", "O_x_1", "O_y_1", "O_1"];
                    break;
            }
            break;

        case "4":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                    return [];
                    break;
                case "60":
                    return ["w_2"];
                    break;
                case "70":
                    return ["w_2", "V_2"];
                    break;
                case "80":
                    return ["w_2", "V_2", "alpha_2", "O_x_2"];
                    break;
                case "90":
                    return ["w_2", "V_2", "alpha_2", "O_x_2", "O_y_2"];
                    break;

            }
            break;
    }
    return []; // empty
}
/*
function getShowVariables() {
    switch (category) {
        case "1": // Category 1
            switch (page) {
                case "10": //Crank Shaft Angular Velocity page
                case "20": //Input Power page
                    return ["tMax", "tMin", "tAvg"];
                    break;

                case "30": //Theta_1 and theta_2 page
                case "40": // and so on
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["tMax", "tMin", "tAvg", "P"];
                    break;
            }
            break;

        case "2": // Category 2
            switch (page) {
                case "10":
                    return [];
                    break;

                case "20":
                case "30":
                    return ["w_1_rad"];
                    break;

                case "40":
                    return ["w_1_rad", "theta_1", "theta_2"];
                    break;

                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["w_1_rad", "theta_1", "theta_2", "delta_E"];
                    break;
            }
            break;

        case "3":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["d_1", "d_2"];
                    break;
            }
            break;

        case "4":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["w_2_RPM"];
                    break;
            }
            break;

        case "5":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                    return [];
                    break;

                case "50":
                    return ["w_1_RPM", "wMin", "wMax"];
                    break;

                case "60":
                    return ["w_1_RPM", "wMin", "wMax", "C"];
                    break;

                case "70":
                    return ["w_1_RPM", "wMin", "wMax", "C", "percent", "i_reqd"];
                    break;

                case "80":
                    return ["w_1_RPM", "wMin", "wMax", "C", "percent", "rho", "i_reqd", "i_fw"];
                    break;

                case "90":
                    return ["w_1_RPM", "wMin", "wMax", "C", "percent", "rho", "i_reqd", "i_fw", "dI", "dO"];
                    break;
            }
            break;

    }
    return []; // empty
}
*/



// Debugging
// $.each(model.attributes, function(i, e) {
//     console.log(i + " : " + e);
// });


function round(input) {
    // if it is an integer number, return it
    if (parseInt(input) == parseFloat(input)) {
        return input;
    }

    // if the input is NaN or not available or 0, dont round
    if (isNaN(input) == true || input == " " || input == 0) {
        return input;
    }

    //rounds if not an integer or NaN or "" or 0
    var i = Math.abs(input);
    var sigfig = 3
    var mag = Math.floor(Math.log10(i));
    input = input * Math.pow(10, sigfig - mag);
    input = Math.round(input)
    input = input / Math.pow(10, sigfig - mag);
        return input;
}
