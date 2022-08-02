window.onload = async function(){

    var Fall_ByCourseDept = d3.csvParse("Data/Fall_ByCourseDept.csv");
    var Fall_ByInstructionMethod = d3.csvParse("Data/Fall_ByInstructionMethod.csv");
    var Fall_ByStudentProgram = d3.csvParse("Data/Fall_ByStudentProgram.csv");
    var Fall_ByStudentProgramType = d3.csvParse("Data/Fall_ByStudentProgramType.csv");
    var Fall_DistanceOnlineStatus = d3.csvParse("Data/Fall_DistanceOnlineStatus.csv");


    var Summer_ByCourseDept = d3.csvParse("Data/Summer_ByCourseDept.csv");
    var Summer_ByInstructionMethod = d3.csvParse("Data/Summer_ByInstructionMethod.csv");
    var Summer_ByStudentProgram = d3.csvParse("Data/Summer_ByStudentProgram.csv");
    var Summer_ByStudentProgramType = d3.csvParse("Data/Summer_ByStudentProgramType.csv");
    var Summer_DistanceOnlineStatus = d3.csvParse("Data/Summer_DistanceOnlineStatus.csv");

    console.log("Read the data in.");
}






