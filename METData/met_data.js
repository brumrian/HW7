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


  Nationalities = ["Netherlandish", "Dutch",  "Flemish", "Spanish", "Scottish", "Mexican", "Austrian", "Swiss", "Brazilian", "Greek", "Chinese", "Japanese", "French", "German", "Italian", "British", "American"];
  NationalityCount = new Map();
  //   ColorCode = ["#800000", "#9a6324", "#808000", "#469990", "#000075", "#e6194b", "#f58231", "#ffe119", "#bfef45", "#3cb44b", "#42d4f4", "#4363d8", "#911eb4", "#f032e6", "#fabed4", "#ffd8b1", "#aaffc3", "#dcbeff", ""]
  ColorCode = [ "#FFFF00", "#7CFC00", "#006400",  "#9ACD32", "#8B008B", "#FF0000", "#FFA500", "#808000", "#008080", "#4682B4", "#1e90ff", "#db7093", "#DEB887", "#8A2BE2", "#ff1493", "#00ffff", "#ff7f50", "#ff00ff"]
  const ColorMap = new Map();
  for(i = 0; i < Nationalities.length; i++ ){
    ColorMap.set(Nationalities[i], ColorCode[i]);
    NationalityCount.set(Nationalities[i], 0);
    // console.log(Nationalities[i]);
  }

  console.log("Length:", Nationalities.length)

  function filterByNationality(string){

    for(i = 0; i < Nationalities.length; i++){

        check = string.includes(Nationalities[i])
        if(check){

            // NationalityCount.set(Nationalities[i], NationalityCount.get(Nationalities[i]) + 1);
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
                NationalityCount.set(getNationality(object_data.artistNationality), NationalityCount.get(getNationality(object_data.artistNationality)) + 1);


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
        
        
        const arr = Array.from(NationalityCount, function (item) {
            return { key: item[0], value: item[1] }
        });

        // max = 0;
        // for(pair in arr){
        //     console.log(pair.key)
        //     if(pair.value > max){
        //         max = pair.value;
        //     }
        // }
        // console.log(arr);
        createBarChart(arr, 2000);

        // createHistogram(NationalityCount.values());
        // createHistogram(NationalityCount);

        // console.log(NationalityCount.entries())

        // console.log(NationalityCount);
        //here is where we need to come up with how we want to store data for our visuals

    });




}


function makeButtons(){

    for(i = 0; i < Nationalities.length; i++){
        d3.select('#Buttons')
          .insert("p")
          .attr('class', Nationalities[i])
          .classed("singleButton", true)
          .text(Nationalities[i]).on('click', handleClick).style('background-color', ColorMap.get(Nationalities[i]));
    }
    console.log("end make buttons");
    
}

function updateButtons(nat){

    nationality = ColorMap.get(nat);

    var svg = d3.select('#Buttons')

    // var p = svg.selectAll('p').style('background-color', "#d3d3d3");

    for(i = 0; i < Nationalities.length; i++){
        if(Nationalities[i] == nat){
            color = ColorMap.get(nat);
            var dots = svg.selectAll("." + nat).style('background-color', color)

        }
        else{
            var dots = svg.selectAll("." + Nationalities[i]).style('background-color', '#d3d3d3')

        }
    }



}

function handleClick(e, d){
    
    console.log("Click-click");
    // console.log("e is", e);
    // let elem = d3.select(this);
    // console.log("elem is", this.outerText);


    updateScatterplot(this.outerText);
    updateBarchart(this.outerText);
    updateButtons(this.outerText)
}

function createScatterplot(data, xMax, xMin, yMax, yMin){

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
// width = 460 - margin.left - margin.right,
// height = 400 - margin.top - margin.bottom;
width = 600 - margin.left - margin.right,
height = 560 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svg = d3.select("#scatterplot")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


      //Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv", function(data) {

    // Add X axis
    var x = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));
  
    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr('class', function(d){return getNationality(d.artistNationality)})
        .attr("cx", function (d) { return x(d.objectEndDate); } )
        .attr("cy", function (d) { return y(d.accessionYear); } )
        .attr("r", 2)
        .style("fill", function(d){
            nationality = getNationality(d.artistNationality)
            return ColorMap.get(nationality)})
        .on("click", handleDotClick);
  
//   })
}




function updateScatterplot(nat){


    nationality = ColorMap.get(nat);

    var svg = d3.select('#scatterplot')

    for(i = 0; i < Nationalities.length; i++){
        if(Nationalities[i] == nat){
            color = ColorMap.get(nat);
            var dots = svg.selectAll("." + nat).style('fill', color)

        }
        else{
            var dots = svg.selectAll("." + Nationalities[i]).style('fill', '#d3d3d3')

        }
    }
 
    }

    function updateBarchart(nat){

        nationality = ColorMap.get(nat);
    
        var svg = d3.select('#histogram')
    
        for(i = 0; i < Nationalities.length; i++){
            if(Nationalities[i] == nat){
                color = ColorMap.get(nat);
                var dots = svg.selectAll("." + nat).style('fill', color)
    
            }
            else{
                var dots = svg.selectAll("." + Nationalities[i]).style('fill', '#d3d3d3')
    
            }
        }
     
        }


function handleDotClick(e, d){

    
    console.log("on hover")
}

console.log("This code runs before the data is read in.");



function createBarChart(data, maxcount){

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
// width = 460 - margin.left - margin.right,
// height = 400 - margin.top - margin.bottom;

width = 600 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#histogram")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.key; }))
    .paddingInner(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
  
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, maxcount])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  

    // Bars
svg.selectAll("mybar")
.data(data)
.enter()
.append("rect")
  .attr("x", function(d) { return x(d.key); })
  .attr("y", function(d) { return y(d.value); })
  .attr('class', function(d){return getNationality(d.key)})
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return height - y(d.value); })
  .attr("fill", function(d){return ColorMap.get(d.key)})

}