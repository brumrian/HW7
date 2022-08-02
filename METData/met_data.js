class MetData {

    constructor(title, objectName, isHighlighted, artistNationality, objectBeginDate, objectEndDate ) {
      this.title = title;
      this.objectName = objectName;
      this.isHighlighted = isHighlighted;
      this.artistNationality = artistNationality;
      this.objectBeginDate = objectBeginDate;
      this.objectEndDate = objectEndDate;
    }
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
let highlighted_met_data = new Array();

window.onload = async function(){

    d3.csv("MetObjects.csv", function(data) {
        // console.log(data[0]);
        // object_data = new MetData(data[0].Title, data[0]["Object Name"], data[0]["Is Highlight"], data[0]["Artist Nationality"], data[0]["Object Begin Date"], data[0]["Object End Date"]);
        // console.log(object_data);
        for (var i = 0; i < data.length; i++) {

            // console.log(data[i]);
            object_data = new MetData(data[i].Title, data[i]["Object Name"], getBooleanValue(data[i]["Is Highlight"]), data[i]["Artist Nationality"], parseInt(data[i]["Object Begin Date"]), parseInt(data[i]["Object End Date"]));
            // console.log("Data is ", object_data);            
            if( object_data.artistNationality != " " && object_data.artistNationality != "" 
                && object_data.objectName == "Painting"
                 ){
                met_data.push(object_data);
                objectNameSet.add(object_data.objectName);
                artNationalitySet.add(object_data.artistNationality);

                if(object_data.isHighlighted){
                    highlighted_met_data.push(object_data);
                }

            }
        }

       
        console.log(met_data);
        console.log(objectNameSet);
        console.log(artNationalitySet);
        console.log(highlighted_met_data);

        //here is where we need to come up with how we want to store data for our visuals

    });

}

console.log("This code runs before the data is read in.");

