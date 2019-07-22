/*jshint esversion: 6 */

window.addEventListener("load", function () {
    console.log("page loaded");
    let Cowan_Kanban = AssignPrototype.getInstance();
});

class AssignPrototype{
    constructor() {
        getLists();
    }

    static getInstance(){
        //Is there an instance variable attached to the class?
        //If so, don't create. If not, then it's ok to create.
        if(!AssignPrototype._instance){
            AssignPrototype._instance = new AssignPrototype();
            return AssignPrototype._instance;
        }
        else{
            throw "Error: Singleton already exists.";
        }
    }
}

//variables to hold API URL info
var apiURL = "https://triangular-cabbage.glitch.me/api/";
var accessToken = "?accessToken=5b1064585f4ab8706d275f90";

//variable to hold the DOM list display
var listDisplay = document.querySelector('#listdisplay');

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

//function to create the List Page
function createPage(listData){
    listDisplay.innerHTML = "";
    console.log(listData);
    listData.forEach(element => {
        createList(element);
    });
    let newTaskButtons = document.querySelectorAll('button');
    newTaskButtons.forEach(button => button.addEventListener('click', addTask));
    let tasks = document.querySelectorAll('li');
    tasks.forEach(task => task.addEventListener('click', viewTask));
}

//function to create the Lists in the DOM
function createList(data){
    console.log('Creating listID: ' + data.id);
    const sectionTemplate = document.querySelector('#listTemplate');
    let cloneSection = document.importNode(sectionTemplate.content, true);

    cloneSection.querySelector('button').id = data.id;
    cloneSection.querySelector('h2').innerHTML = data.title;

    let targetList = cloneSection.querySelector('ul');
    const taskTemplate = document.querySelector('#taskTemplate');
    if(data.items){

        data.items.forEach(element =>{
            console.log('Creating taskID: ' + element.id);
            let cloneTask = document.importNode(taskTemplate.content, true);

            cloneTask.querySelector('li').id = element.listId + '_' + element.id;
            cloneTask.querySelector('h3').innerHTML = element.title;
            cloneTask.querySelector('p').innerHTML = element.description;
            cloneTask.querySelector('datetime').innerHTML = element.dueDate;
            targetList.appendChild(cloneTask);
        });
    }
    else{
        let cloneTask = document.importNode(taskTemplate.content, true);
        cloneTask.classList.add("emptytext");
        targetList.appendChild(cloneTask);
    }

    listDisplay.appendChild(cloneSection);
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

//function to post a new task
function postTask(event) {
    event.preventDefault();
    var target = event.target;
    var disable = target.classList.contains('disabled');

    if(disable===false){
        let pageForm = document.querySelector('form');

        let title = pageForm.querySelector('input[id=title]').value;
        let listId = event.target.id;
        let description;
        if (pageForm.querySelector('input[id=description]').value){
            description = pageForm.querySelector('input[id=description]').value;
        }
        else {
            description = null;
        }
        let dueDate;
        if(pageForm.querySelector('input[id=duedate]').value){
            dueDate = pageForm.querySelector('input[id=duedate]').value;
        }
        else{
            dueDate = null;
        }
        let newTask = {
            title: title,
            listId: listId,
            description: description,
            dueDate: dueDate
        };

        let queryURL = apiURL + 'items' + accessToken;
        let myInit = {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: {'content-type': 'application/json'}
        };
        fetch(queryURL, myInit)
            .then(validateResponse) //run the function to validate the response
            .then(newRes => newRes.json()) //convert the response to JSON
            .then(getLists) //run the function to create the HTML for the list(s) and insert it on the DOM
            .catch(logError); //write out any error in the console
    }
    else{
        alert("Title is required!");
    }
}

// Submit Button Validation
function validateForm(){
    let pageForm = document.querySelector('form');
    let fields = pageForm.querySelectorAll('.required');
    let submit = pageForm.querySelector('button');
    let valid = false;
    for (let i=0; i <fields.length; i++){
        if(fields[i].value){valid = true;}
    }

    //allow submit
    if (valid === true){
        submit.removeAttribute("class");
    }
}

function addTask(event){
    //create the form
    let formTitle = "Add Task";
    let pageForm = createForm(formTitle);
    pageForm.querySelector('button').id = event.target.id;
}

function createForm(formTitle){
    const formTemplate = document.querySelector('#formTemplate');
    let cloneForm = document.importNode(formTemplate.content, true);
    listDisplay.innerHTML = "";
    listDisplay.appendChild(cloneForm);

    //variables to hold the new form
    let pageForm = document.querySelector('form');
    let title = pageForm.querySelector('h2');
    title.innerHTML = formTitle;

    //Check if submissions are allowed
    let requiredFields = pageForm.querySelectorAll('.required');
    for (let i=0; i <requiredFields.length; i++){
        requiredFields[i].addEventListener('input', validateForm);
    }

    let submit = pageForm.querySelector('#submit');

    //Form Submission
    submit.addEventListener('click', postTask);

    //Form Cancel
    let cancel = pageForm.querySelector('#cancel');
    cancel.addEventListener('click', getLists);

    return pageForm;
}

function viewTask(event){
    if(event.target.id){
        //Record the data from the task that was clicked
        let task = event.target;
        let list = task.parentElement.parentElement;
        let formTitle = list.querySelector('h2').innerHTML;
        let title = task.querySelector('h3').innerHTML;
        let description = task.querySelector('p').innerHTML;
        let dueDate = task.querySelector('datetime').innerHTML;

        //create the form with populated data
        let pageForm = createForm(formTitle);
        pageForm.querySelector('button').remove();
        pageForm.querySelector('p').innerHTML = "";
        pageForm.querySelector('#cancel').innerHTML = "Close";
        pageForm.querySelector('label').innerHTML = "Title";
        pageForm.querySelector('input[id=title]').value = title;
        pageForm.querySelector('input[id=description]').value = description;
        pageForm.querySelector('input[id=duedate]').value = dueDate;
    }
}

