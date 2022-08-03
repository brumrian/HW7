class MetData {

    constructor(title, accessionYear, objectName, isHighlighted, artistNationality, objectBeginDate, objectEndDate, medium ) {
      this.title = title;
      this.accessionYear = accessionYear;
      this.objectName = objectName;
      this.isHighlighted = isHighlighted;
      this.artistNationality = artistNationality;
      this.objectBeginDate = objectBeginDate;
      this.objectEndDate = objectEndDate;
      this.medium = medium;
    }
  }


  Nationalities = ["Chinese", "American", "Japanese", "German", "Scottish", "Isreli", "French", "Italian", "Netherlandish", "Dutch", "British", "Flemish", "Spanish", "Cuban", "Mexican", "Chilean", "Austrian", "Swiss", "Lebanese", "Puerto Rican", "Brazilian", "Greek", "Armenian-Iranian", "Sienese", "Uruguayan"];
//   ColorCode = ["#800000", "#9a6324", "#808000", "#469990", "#000075", "#e6194b", "#f58231", "#ffe119", "#bfef45", "#3cb44b", "#42d4f4", "#4363d8", "#911eb4", "#f032e6", "#fabed4", "#ffd8b1", "#aaffc3", "#dcbeff", ""]
  ColorCode = ["#006400", "#8B0000", "#808000", "#483D8B", "#008080", "#4682B4", "#000080", "#9ACD32", "#8B008B", "#FF0000", "#FFA500", "#FFFF00", "#7CFC00", "#DEB887", "#8A2BE2", "#ff1493", "#ee82ee", "#00ff7f", "#00ffff", "#0000ff", "#ff7f50", "#ff00ff", "#1e90ff", "#db7093", "#add8e6"]
  const ColorMap = new Map();
  for(i = 0; i < Nationalities.length; i++ ){
    ColorMap.set(Nationalities[i], ColorCode[i]);
  }

  console.log("Length:", Nationalities.length)

  function filterByNationality(string){

    for(i = 0; i < Nationalities.length; i++){

        check = string.includes(Nationalities[i])
        if(check){
            return check;
        }

    }

    return false;
  }

  function getNationality(string){

    for(i = 0; i < Nationalities.length; i++){

        check = string.includes(Nationalities[i])
        if(check){
            return Nationalities[i];
        }

    }

    return false;
  }

function getBooleanValue(string){
    if(string == "False"){
        return false;
    }
    else if(string == "True"){
        return true;
    }
}

let met_data = new Array();
let objectNameSet = new Set();
let artNationalitySet = new Set();
let endDateSet = new Set();
let mediumSet = new Set();
let accessionYearSet = new Set();


let highlighted_met_data = new Array();
let highlightedObjectNameSet = new Set();
let highlightedArtNationalitySet = new Set();
let highlightedEndDateSet = new Set();
let highlightedMediumSet = new Set();
let highlightedAccessionYearSet = new Set();


window.onload = async function(){

    d3.csv("MetObjects.csv", function(data) {
        // console.log(data[0]);
        // console.log(data[0]["Medium"]);

        // object_data = new MetData(data[0].Title, data[0]["Object Name"], data[0]["Is Highlight"], data[0]["Artist Nationality"], data[0]["Object Begin Date"], data[0]["Object End Date"], );
        // console.log(object_data);
        for (var i = 0; i < data.length; i++) {

            // console.log(data[i]);
            object_data = new MetData(data[i].Title, parseInt(data[i]["AccessionYear"]), data[i]["Object Name"], getBooleanValue(data[i]["Is Highlight"]), data[i]["Artist Nationality"], parseInt(data[i]["Object Begin Date"]), parseInt(data[i]["Object End Date"]), data[i]["Medium"]);
            // console.log("Data is ", object_data);            
            if( filterByNationality(object_data.artistNationality)
                && object_data.objectName == "Painting"
                && object_data.accessionYear != null && object_data.accessionYear > 0
                // && if
                 ){

                met_data.push(object_data);
                objectNameSet.add(object_data.objectName);
                artNationalitySet.add(object_data.artistNationality);
                endDateSet.add(object_data.objectEndDate);
                mediumSet.add(object_data.medium);
                accessionYearSet.add(object_data.accessionYear);

                if(object_data.isHighlighted){

                    highlighted_met_data.push(object_data);
                    highlightedObjectNameSet.add(object_data.objectName);
                    highlightedArtNationalitySet.add(object_data.artistNationality);
                    highlightedEndDateSet.add(object_data.objectEndDate);
                    highlightedMediumSet.add(object_data.medium);
                    highlightedAccessionYearSet.add(object_data.accessionYear);
                }



            }
        }

       
        console.log(met_data);
        // console.log(objectNameSet);
        // console.log(artNationalitySet);
        // console.log(highlightedArtNationalitySet);
        console.log(highlighted_met_data);
        console.log("Max", Math.max(...endDateSet), "\nMin :", Math.min(...endDateSet));
        console.log("Highlighted end date", highlightedEndDateSet);
        // console.log(mediumSet);
        // console.log(highlightedMediumSet);
        // console.log(accessionYearSet);
        console.log("highlighted ass: ", highlightedAccessionYearSet);
        makeButtons();

        // createScatterplot(highlighted_met_data , Math.max(...highlightedEndDateSet), Math.min(...highlightedEndDateSet), Math.max(...highlightedAccessionYearSet), Math.min(...highlightedAccessionYearSet));
        createScatterplot(met_data, Math.max(...endDateSet), Math.min(...endDateSet), Math.max(...accessionYearSet), Math.min(...accessionYearSet));
        console.log()
        //here is where we need to come up with how we want to store data for our visuals

    });




}


function makeButtons(){

    for(i = 0; i < Nationalities.length; i++){
        d3.select('#Buttons').insert("p").text(Nationalities[i]).on('click', handleClick).style('background-color', ColorMap.get(Nationalities[i]));
    }
    console.log("end make buttons");
    
}

function handleClick(){
    console.log("Click-click");
}

function createScatterplot(data, xMax, xMin, yMax, yMin){

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatterplot")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


      //Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv", function(data) {

    // Add X axis
    var x = d3.scale.linear()
      .domain([xMin, xMax])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));
  
    // Add Y axis
    var y = d3.scale.linear()
      .domain([yMin, yMax])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.svg.axis().scale(y).orient("left"));
  
    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.objectEndDate); } )
        .attr("cy", function (d) { return y(d.accessionYear); } )
        .attr("r", 1.5)
        .style("fill", function(d){
            nationality = getNationality(d.artistNationality)
            console.log("nationality is: ", nationality)
            return ColorMap.get(nationality)})
  
//   })
}

console.log("This code runs before the data is read in.");

