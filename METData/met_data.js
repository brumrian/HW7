// HW 7 - Data visualization
// 8/3/2022
// Partners: Rian Brumfield and Malila Freeman

// Description: We took data from the MET (Metropolitan Museum of Art) which includes data points about works that they have acquired such as piece type, artist
// nationality, year the piece was started and finished, year the piece was acquired, etc. We displayed data for only paintings, and we created visuals of (1) a 
// scatterplot of the year the piece was finished vs. the year the MET acquired the piece, and (2) a histogram of the number of pieces per artist nationality. 
// The user can filter based on all of the paintings or on just the paintings that have been highlighted in MET exhibitions. The user can also filter based on
// artist nationality, which will show only the colored points for that specific nationality and grey out the other nationalities both in the scatterplot and in the
// histogram. The user is also able to hover their mouse over data points in the scatter plot to view the piece's title. 


// IMPORTANT TO RUN THE CODE:

// 1. Download the MET Object Dataset: https://github.com/metmuseum/openaccess/blob/master/MetObjects.csv, right click "download" --> "download linked file"
// 2. Place the .csv in the METData directory that contains this .js file and the index.html file. 
// 3. Once the server has been run with $python3 -m http.server (from the METData directory), open "localhost:8000/index.html" in browser. 


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
  highlightedNationalityCount = new Map();
  ColorCode = ["#ff00ff", "#7CFC00", "#006400",  "#9ACD32", "#8B008B", "#FF0000", "#FFA500", "#808000", "#008080", "#4f77aa", "#78aed3", "#ffb6c1", "#DEB887", "#8A2BE2", "#ff1493", "#00ffff", "#ff7f50"]
  const ColorMap = new Map();
  for(i = 0; i < Nationalities.length; i++ ){
    ColorMap.set(Nationalities[i], ColorCode[i]);
    NationalityCount.set(Nationalities[i], 0);
    highlightedNationalityCount.set(Nationalities[i], 0);
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

        for (var i = 0; i < data.length; i++) {

            object_data = new MetData(data[i].Title, parseInt(data[i]["AccessionYear"]), data[i]["Object Name"], getBooleanValue(data[i]["Is Highlight"]), data[i]["Artist Nationality"], parseInt(data[i]["Object Begin Date"]), parseInt(data[i]["Object End Date"]), data[i]["Medium"]);

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
                    highlightedNationalityCount.set(getNationality(object_data.artistNationality), highlightedNationalityCount.get(getNationality(object_data.artistNationality)) + 1);

                }
            }
        }

       
        console.log(met_data);
        console.log(highlighted_met_data);
        console.log("Max", Math.max(...endDateSet), "\nMin :", Math.min(...endDateSet));
        console.log("Highlighted end date", highlightedEndDateSet);
        console.log("highlighted ass: ", highlightedAccessionYearSet);
        makeHighlightButtons();

        showAllData();
    });
}

// Creates the buttons where the user can select either highlighted pieces or all pieces and the data will display accordingly 
function makeHighlightButtons(){

    // Want to add 2 buttons side by side to the toggles div
    var div = d3.select("#toggles")

    // All paintings button
    div.insert("p")
        .attr('id', "singleToggle")
        .attr('class', "AllButton")
        .text("Show all paintings")
        .on('click', showAllData)
        .style('background-color', "#FFFF00" )

    // Highlighted paintings button
    div.insert("p")
        .attr('id', "singleToggle")
        .attr('class', "HighlightedButton")
        .text("Show highlighted paintings only")
        .on('click', showHighlightData)
        .style('background-color', "#d3d3d3")

}

// Buttons on the left that allow the user to filter the displayed data based on artist nationality
function makeButtons(){

    // Nationality buttons
    for(i = 0; i < Nationalities.length; i++){
        d3.select('#Buttons')
          .insert("p")
          .attr('class', Nationalities[i])
          .attr('id', "singleButton")
          .text(Nationalities[i]).on('click', handleNationalityClick).style('background-color', ColorMap.get(Nationalities[i]));
    }

    // Add a reset button
    d3.select('#Buttons')
    .insert("p")
    .attr('class', "resetButton")
    .attr('id', "singleButton")
    .text("RESET")
    .on('click', handleReset)
    .style('background-color', '#d3d3d3');
    
}

// This function creates the initial scatterplot. The data parameter is adjusted to be either the entire dataset or just the set with the highlighted paintings
function createScatterplot(data, xMax, xMin, yMax, yMin){

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 560 - margin.top - margin.bottom;

    // Set the dimensions of the graph
    var svg = d3.select("#scatterplot")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    var x = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add X axis label
    svg.append("text")      // text label for the x axis
        .attr("x", width / 2 )
        .attr("y",  height + margin.bottom + 10 )
        .style("text-anchor", "middle")
        .text("Year of Piece Creation");
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y).tickFormat(d3.format("d")));

    // Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Year of Piece Acquisition");

    // Add title for the entire graph
    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "18px") 
    .text("Creation and Acquisition of Pieces");

    // Create a div to hold the title names - this will be filled as the user hovers over the scatterplot points
    var titleDiv = d3.select("body").append("div")
     .attr("class", "titleHolder")
     .style("opacity", 0);

  
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
        // When the user hovers over a scatterplot dot, we want to make the point bigger and add the corresonding painting's title to the titleDiv and display it 
        .on("mouseover", function (d, i){
            // Makes the points bigger when the user hovers over them
            d3.select(this).transition()
                            .duration('100')
                            .attr('r', 5);
            titleDiv.transition()
                .duration('100')
                // opacity = 1 makes it appear 
                .style("opacity", 1);
            titleDiv.html(d.title)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
        })
        // When the user stops hovering over the dot, we want the dot to return to its original size and the div with the title to disappear 
        .on("mouseout", function (d, i){
            d3.select(this).transition()
                            .duration('200')
                            .attr('r', 2);
            titleDiv.transition()
                    .duration('200')
                    // opacity = 0 makes it disappear 
                    .style("opacity", 0);
        });
  }

  // This function creates the initial histogram
function createBarChart(data, maxcount){

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
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

    // Add the x-axis label
    svg.append("text")      
        .attr("x", width / 2 )
        .attr("y",  height + margin.bottom )
        .style("text-anchor", "middle")
        .text("Artist Nationality");

   // Add y-axis label
   svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Pieces");

   // Add title for entire graph
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .text("Number of Pieces by Artist Nationality");
  

    // Create the bars
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

var highlightedButtonSelected = false;

// This function is called when the page is first loaded and anytime the "Show all paintings" button is clicked
function showAllData(){

    // When this function is called, we know the highlighted pieces button is not selected - set to false
    highlightedButtonSelected = false;

    d3.select("#scatterplot").html("");
    d3.select("#histogram").html("");
    d3.select("#Buttons").html("")
    d3.select('.HighlightedButton').style('background-color', '#d3d3d3');
    d3.select('.AllButton').style('background-color', "#FFFF00");


    makeButtons();

    // Create a scatterplot with all of the data
    createScatterplot(met_data, Math.max(...endDateSet), Math.min(...endDateSet), Math.max(...accessionYearSet), Math.min(...accessionYearSet));
        
        
    const arr = Array.from(NationalityCount, function (item) {
        return { key: item[0], value: item[1] }
    });

    max = 0;
    for(i = 0; i < arr.length; i++){

        if(arr[i].value > max){
            max = arr[i].value;
        }     
   }
    
   createBarChart(arr, max);
}

// This function is called when the "Show highlighted paintings only" button is clicked
function showHighlightData(){

    highlightedButtonSelected = true;

    d3.select("#scatterplot").html("");
    d3.select("#histogram").html("");
    d3.select("#Buttons").html("")
    d3.select('.HighlightedButton').style('background-color', "#FFFF00");
    d3.select('.AllButton').style('background-color', '#d3d3d3')

    makeButtons();


    // Create scatterplot with data filtered for the highlighted pieces
    createScatterplot(highlighted_met_data , Math.max(...highlightedEndDateSet), Math.min(...highlightedEndDateSet), Math.max(...highlightedAccessionYearSet), Math.min(...highlightedAccessionYearSet));
        
        
    const arr = Array.from(highlightedNationalityCount, function (item) {
        return { key: item[0], value: item[1] }
     });

    max = 0;
    for(i = 0; i < arr.length; i++){
        if(arr[i].value > max){
            max = arr[i].value;
        }
     }

    createBarChart(arr, max);
}

// This function is called when the user clicks on a specific nationality - its purpose is to update the 2 visuals with the appropriate colors
function handleNationalityClick(e, d){
    
    updateScatterplot(this.outerText);
    updateBarchart(this.outerText);
    updateButtons(this.outerText)
}

// This function is called when the user clicks the reset button
function handleReset(e, d){

    // If the highlighted button is currently selected, we want to reload only the highlighted data
    if (highlightedButtonSelected){
        showHighlightData();
    }
    // If the show all paintings button is currently selected, we want to reload all of the data
    else {
        showAllData();
    }
}

// This function will change the button colors according to which nationality is selected by the user 
function updateButtons(nat){

    nationality = ColorMap.get(nat);

    var svg = d3.select('#Buttons')

    for(i = 0; i < Nationalities.length; i++){

        // Want to keep the nationality's original color if it's the one selected 
        if(Nationalities[i] == nat){
            color = ColorMap.get(nat);
            var dots = svg.selectAll("." + nat).style('background-color', color)

        }
        // If it's not the one selected we want to turn it to grey
        else{
            var dots = svg.selectAll("." + Nationalities[i]).style('background-color', '#d3d3d3')
        }
    }
}

  // This function updates the scatterplot so that the dots that correspond with the nationality the user has selected stay colorful and all others go grey
function updateScatterplot(nat){


    nationality = ColorMap.get(nat);

    var svg = d3.select('#scatterplot')

    for(i = 0; i < Nationalities.length; i++){
        // Keep the nationality's original color on the plot if it is selected
        if(Nationalities[i] == nat){
            color = ColorMap.get(nat);
            var dots = svg.selectAll("." + nat).style('fill', color)
        }
        // If the nationality is not selected, make the corresponding point grey
        else{
            var dots = svg.selectAll("." + Nationalities[i]).style('fill', '#d3d3d3')

        }
    }
}

  // This function updates the histogram so that the bar that corresponds with the nationality the user has selected stays colorful and all others go grey
  function updateBarchart(nat){

        nationality = ColorMap.get(nat);
    
        var svg = d3.select('#histogram')
    
        for(i = 0; i < Nationalities.length; i++){

            // Keep the nationality's original color on the plot if it is selected
            if(Nationalities[i] == nat){
                color = ColorMap.get(nat);
                var dots = svg.selectAll("." + nat).style('fill', color)
    
            }

            // If the nationality is not selected, make the corresponding point grey
            else{
                var dots = svg.selectAll("." + Nationalities[i]).style('fill', '#d3d3d3')
            }
        }
}