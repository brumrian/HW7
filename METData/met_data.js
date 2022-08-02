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

  function filterByNationality(string){

    for(i = 0; i < Nationalities.length; i++){

        check = string.includes(Nationalities[i])
        if(check){
            return check;
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
let dateSet = new Set();
let mediumSet = new Set();
let accessionYearSet = new Set();


let highlighted_met_data = new Array();
let highlightedObjectNameSet = new Set();
let highlightedArtNationalitySet = new Set();
let highlightedDateSet = new Set();
let highlightedMediumSet = new Set();
let highlightedAccessionYearSet = new Set();


window.onload = async function(){

    d3.csv("MetObjects.csv", function(data) {
        console.log(data[0]);
        // console.log(data[0]["Medium"]);

        // object_data = new MetData(data[0].Title, data[0]["Object Name"], data[0]["Is Highlight"], data[0]["Artist Nationality"], data[0]["Object Begin Date"], data[0]["Object End Date"], );
        // console.log(object_data);
        for (var i = 0; i < data.length; i++) {

            // console.log(data[i]);
            object_data = new MetData(data[i].Title, parseInt(data[i]["AccessionYear"]), data[i]["Object Name"], getBooleanValue(data[i]["Is Highlight"]), data[i]["Artist Nationality"], parseInt(data[i]["Object Begin Date"]), parseInt(data[i]["Object End Date"]), data[i]["Medium"]);
            // console.log("Data is ", object_data);            
            if( filterByNationality(object_data.artistNationality)
                && object_data.objectName == "Painting"
                 ){

                met_data.push(object_data);
                objectNameSet.add(object_data.objectName);
                artNationalitySet.add(object_data.artistNationality);
                dateSet.add(object_data.objectBeginDate);
                dateSet.add(object_data.objectEndDate);
                mediumSet.add(object_data.medium);
                accessionYearSet.add(object_data.accessionYear);

                if(object_data.isHighlighted){

                    highlighted_met_data.push(object_data);
                    highlightedObjectNameSet.add(object_data.objectName);
                    highlightedArtNationalitySet.add(object_data.artistNationality);
                    highlightedDateSet.add(object_data.objectBeginDate);
                    highlightedDateSet.add(object_data.objectEndDate);
                    highlightedMediumSet.add(object_data.medium);
                    highlightedAccessionYearSet.add(object_data.accessionYear);
                }



            }
        }

       
        // console.log(met_data);
        // console.log(objectNameSet);
        console.log(artNationalitySet);
        console.log(highlightedArtNationalitySet);
        // console.log(highlighted_met_data);
        console.log(dateSet);
        console.log(highlightedDateSet);
        // console.log(mediumSet);
        // console.log(highlightedMediumSet);
        console.log(accessionYearSet);
        console.log(highlightedAccessionYearSet);


        //here is where we need to come up with how we want to store data for our visuals

    });

}

console.log("This code runs before the data is read in.");

