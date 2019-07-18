//variables to hold API URL
var apiURL = "https://kanban-mdcowan.glitch.me/api/lists?accessToken=5b1064585f4ab8706d275f90";

//** Use fetch to retrieve JSON data **\\

//function to validate the API response
function validateResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

//function to log any errors received from the API
function logError(error){
    console.log('Error: \n', error);
}

function createPage(listData){
    
}

//function to get API list data
function getList() {
    fetch(apiURL, {method: 'GET /list'})
        .then(validateResponse) //run the function to validate the response
        .then(newRes => newRes.json()) //convert the response to JSON
        .then(createPage) //run the function to create the HTML for the recipe and insert it on the DOM
        .catch(logError); //write out any error in the console
}