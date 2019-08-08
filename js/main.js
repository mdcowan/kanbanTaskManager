/*jshint esversion: 6 */

window.addEventListener("load", function () {
    console.log("page loaded");
    let Cowan_Kanban = AssignPrototype.getInstance();
});

class AssignPrototype{
    constructor() {
        //variables to hold API URL info
        const apiURL = "https://triangular-cabbage.glitch.me/api/";
        const accessToken = "?accessToken=5b1064585f4ab8706d275f90";

        //variable to hold the DOM list display
        const listDisplay = document.querySelector('#listdisplay');

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
            loadCustomColor();
            listDisplay.innerHTML = "";
            listData.forEach(element => {
                createList(element);
            });
            let newTaskButtons = document.querySelectorAll('.addTask');
            newTaskButtons.forEach(button => button.addEventListener('click', addTask));
            let tasks = document.querySelectorAll('li');
            tasks.forEach(task => task.addEventListener('click', viewTask));
        }

        //function to create the Lists in the DOM
        function createList(data){
            const sectionTemplate = document.querySelector('#listTemplate');
            let cloneSection = document.importNode(sectionTemplate.content, true);
            cloneSection.querySelector('section').dataset.listid = data.id;
            cloneSection.querySelector('h2').innerHTML = data.title;

            let targetList = cloneSection.querySelector('ul');
            const taskTemplate = document.querySelector('#taskTemplate');

            //create all of the list items
            if(data.items){

                data.items.forEach(element =>{
                    let cloneTask = document.importNode(taskTemplate.content, true);

                    cloneTask.querySelector('li').dataset.taskid = element.id;
                    cloneTask.querySelector('h3').innerHTML = element.title;
                    cloneTask.querySelector('p').innerHTML = element.description;
                    cloneTask.querySelector('time').innerHTML = element.dueDate;
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
            fetch(queryURL, {method: 'GET'})
                .then(validateResponse) //run the function to validate the response
                .then(newRes => newRes.json()) //convert the response to JSON
                .then(createPage) //run the function to create the HTML for the list(s) and insert it on the DOM
                .catch(logError); //write out any error in the console
        }

        //function to post a new task
        function postPutTask(event) {
            console.log("Post/Put Triggered")
            event.preventDefault();
            let target = event.target;
            let pageForm = document.querySelector('form');
            const disable = target.classList.contains('disabled');
            console.log(disable);

            if(disable===false){
                let title = pageForm.querySelector('input[name=title]').value;
                let listId = target.parentElement.dataset.listid;
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

                let taskID = target.parentElement.querySelector('h2').dataset.taskid;

                let newTask;
                let queryURL;
                let myInit;

                if (taskID){
                    newTask = {
                        title: title,
                        description: description,
                        dueDate: dueDate
                    };

                    queryURL = apiURL + 'items/'+ taskID + accessToken;
                    myInit = {
                        method: 'PUT',
                        body: JSON.stringify(newTask),
                        headers: {'content-type': 'application/json'}
                    };
                }
                else{
                    newTask = {
                        title: title,
                        listId: listId,
                        description: description,
                        dueDate: dueDate
                    };

                    queryURL = apiURL + 'items' + accessToken;
                    myInit = {
                        method: 'POST',
                        body: JSON.stringify(newTask),
                        headers: {'content-type': 'application/json'}
                    };
                }



                fetch(queryURL, myInit)
                    .then(validateResponse) //run the function to validate the response
                    .then(newRes => newRes.json()) //convert the response to JSON
                    .then(getLists) //run the function to create the HTML for the list(s) and insert it on the DOM
                    .catch(logError); //write out any error in the console
            }
        }

        // Submit Button Validation
        function validateForm(){
            let pageForm = document.querySelector('form');
            let required = pageForm.querySelector('input[name=title]');
            let submit = pageForm.querySelector('button');
            console.log("Validity State: " + required.validity.valid);
            //allow submit
            let alertText = pageForm.parentElement.querySelector('p');
            if (required.validity.valid === true){
                submit.removeAttribute("class");
                alertText.innerHTML = "";
                if(alertText.classList){
                    alertText.removeAttribute("class");
                }
            }
            else{
                alertText.classList.add("alert");
                alertText.innerHTML = "Title is a required field. Please update";
            }

            return required.validity;
        }

        //add task button event handler
        function addTask(event){
            let listID = event.target.parentElement.parentElement.dataset.listid;
            //create the form
            let formTitle = "Add Task";
            createForm(formTitle, listID);
        }

        //function to create the form to add/view task
        function createForm(formTitle, listID){
            const formTemplate = document.querySelector('#formTemplate');
            let cloneForm = document.importNode(formTemplate.content, true);
            listDisplay.innerHTML = "";
            listDisplay.appendChild(cloneForm);

            //variables to hold the new form
            let pageForm = document.querySelector('form');
            pageForm.dataset.listid = listID;
            let title = pageForm.querySelector('h2');
            title.innerHTML = formTitle;

            //Check if submissions are allowed
            let requiredField = pageForm.querySelector('#title');
            requiredField.addEventListener('blur', validateForm);

            //Form Submission
            let submit = pageForm.querySelector('#submit');
            submit.addEventListener('click', postPutTask);

            //Form Cancel
            let cancel = pageForm.querySelector('#cancel');
            cancel.addEventListener('click', getLists);

            return pageForm;
        }

        //view task click event handler
        function viewTask(event){

            //Record the data from the task that was clicked
            let task = event.currentTarget;
            let taskID = task.dataset.taskid;
            let list = task.parentElement.parentElement;
            let formTitle = list.querySelector('h2').innerHTML;
            let title = task.querySelector('h3').innerHTML;
            let description = task.querySelector('p').innerHTML;
            let dueDate = task.querySelector('time').innerHTML;
            let listID = list.dataset.listid;

            //create the form with populated data
            let pageForm = createForm(formTitle, listID);
            pageForm.querySelector('h2').dataset.taskid = taskID;
            pageForm.querySelector('p').innerHTML = "";
            pageForm.querySelector('#cancel').innerHTML = "Close";
            pageForm.querySelector('label').innerHTML = "Title";
            pageForm.querySelector('input[id=title]').value = title;
            pageForm.querySelector('input[id=description]').value = description;
            pageForm.querySelector('input[id=duedate]').value = dueDate;
            pageForm.querySelector('button').innerHTML = "Update";
            pageForm.querySelector('input[id=title]').focus();
        }

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



