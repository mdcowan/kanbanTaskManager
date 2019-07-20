//variables to hold API URL info
var apiURL = "https://mercurial-headphones.glitch.me/api/";
var accessToken = "?accessToken=5b1064585f4ab8706d275f90";

//variable to hold the DOM list display
var listDisplay = document.querySelector('#listdisplay')

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
    listDisplay.innerHTML = "<h2>Oops! Something went wrong!</h2>";
}

function createPage(listData){
    console.log(listData);
    listData.forEach(element => {
        console.log(element);
        createList(element);
    })
}

//function to get API list data
function getLists() {
    let queryURL = apiURL + 'lists' + accessToken;
    console.log(queryURL);
    fetch(queryURL, {method: 'GET'})
        .then(validateResponse) //run the function to validate the response
        .then(newRes => newRes.json()) //convert the response to JSON
        .then(createPage) //run the function to create the HTML for the list(s) and insert it on the DOM
        .catch(logError); //write out any error in the console
}

//function to get API list data
function postList(event) {

    let queryURL = apiURL + 'lists' + accessToken;
    let myInit = {method: 'POST',
                    headers: new Headers(),
                    body: JSON.stringify({title: event.newTitle})};
    fetch(queryURL, myInit)
        .then(validateResponse) //run the function to validate the response
        .then(newRes => newRes.json()) //convert the response to JSON
        .then(createList) //run the function to create the HTML for the list(s) and insert it on the DOM
        .catch(logError); //write out any error in the console
}

function createList(data){
    console.log('Creating list: ' + data.title);
    const sectionTemplate = document.querySelector('#listTemplate');
    let cloneSection = document.importNode(sectionTemplate.content, true);

    cloneSection.querySelector('section').id = data.id;
    cloneSection.querySelector('h2').innerHTML = data.title;

    let targetList = cloneSection.querySelector('ul');
    const taskTemplate = document.querySelector('#taskTemplate');
    if(data.items){

        data.items.forEach(element =>{
            console.log('Creating task: ' + element.title);
            let cloneTask = document.importNode(taskTemplate.content, true);
            console.log(cloneTask);

            cloneTask.querySelector('li').id = element.listId + '_' + element.id;
            cloneTask.querySelector('h3').innerHTML = element.title;
            cloneTask.querySelector('p').innerHTML = element.description;
            cloneTask.querySelector('datetime').innerHTML = element.dueDate;
            targetList.appendChild(cloneTask);
        })
    }
    else{
        let cloneTask = document.importNode(taskTemplate.content, true);
        cloneTask.classList.add("emptytext");
        targetList.appendChild(cloneTask);
    }

    listDisplay.appendChild(cloneSection);
}

getLists();