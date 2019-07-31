//**Customization of page
const page = document.querySelector('body');
const themechange = page.querySelector("#themechange");
const btn = page.querySelector('header > button');
const theme1Btn = page.querySelector('#customtheme1');
const theme2Btn = page.querySelector('#customtheme2');
const theme3Btn = page.querySelector('#default');

theme1Btn.addEventListener('click', getTheme);
theme2Btn.addEventListener('click', getTheme);
theme3Btn.addEventListener('click', getTheme);

// function to open the modal window
function openModal(){
    themechange.style.display = "block";
}

// function to close the modal window
function closeModal(event){
    if (event.target === themechange) {
        themechange.style.display = "none";
    }
}

function getTheme(event){
    let choice = event.target.id;
    themeChange(choice);
}

function themeChange(choice){
    if(localStorage.getItem('customColor')){
        localStorage.removeItem('customColor');
    }
    let data;


    switch (choice){
        case "customtheme1":
            data = {
                colorClass: "customtheme1"
            };
            page.classList.add('custom1');
            if(page.classList.contains('custom2')){
                page.classList.remove('custom2');
            }
            break;
        case "customtheme2":
            data = {
                colorClass: "customtheme2"
            };
            page.classList.add('custom2');
            if(page.classList.contains('custom1')){
                page.classList.remove('custom1');
            }
            break;
        case "default":
            if(page.classList.contains('custom1')){
                page.classList.remove('custom1');
            }
            if(page.classList.contains('custom2')){
                page.classList.remove('custom2');
            }
            break;
    }

    localStorage.setItem('customColor', JSON.stringify(data));
    themechange.style.display = "none";
}

btn.addEventListener('click', openModal);
window.addEventListener('click', closeModal);

function loadCustomColor(){
    let customColor = JSON.parse(localStorage.getItem('customColor'));
    if(customColor){
        themeChange(customColor.colorClass);
    }
}

