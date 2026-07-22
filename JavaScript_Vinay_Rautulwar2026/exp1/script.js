function showEnvironment() {

    let browser = navigator.userAgent;
    let language = navigator.language;
    let platform = navigator.platform;

    let output = `
    <h2>Welcome User!</h2>

    <h3>Student Information</h3>

    <p><b>Name :</b> Vinay Rautulwar</p>

    <p><b>PRN :</b> 25070521513 </p>

    <p><b>File Path :</b> C:/Users/Vinay/Documents/JavaScript/Experiment/index.html</p>

    <hr>

    <h3>User Environment Information</h3>

    <p><b>Browser :</b> ${browser}</p>

    <p><b>Language :</b> ${language}</p>

    <p><b>Platform :</b> ${platform}</p>
    `;

    document.getElementById("output").innerHTML = output;

    console.log("Name : Vinay Rautulwar");
    console.log("PRN : 25070521513");
    console.log("File Path : C:/Users/Vinay/Documents/JavaScript/Experiment-1/index.html");

    console.log("JavaScript Experiment Started Successfully.");
    console.error("This is a sample error message.");

    console.table([
        {
            Name: "Vinay Rautulwar",
            PRN: "25070521513",
            Branch: "Computer Engineering"
        }
    ]);

    console.trace("Trace Method Executed");
}