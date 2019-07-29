//**Customization of page
const page = document.querySelector('body');
const themechange = page.querySelector("#themechange");
const btn = page.querySelector('header > button');
const theme1Btn = page.querySelector('#custom1');
const theme2Btn = page.querySelector('#custom2');
const theme3Btn = page.querySelector('#default');

// function to open the modal window
function openModal(){
    themechange.style.display = "block";
    theme1Btn.addEventListener('click',changeToTheme1);
    theme2Btn.addEventListener('click', changeToTheme2);
    theme3Btn.addEventListener('click', changeDefault);
}

// function to close the modal window
function closeModal(event){
    if (event.target === themechange) {
        themechange.style.display = "none";
    }
}

function changeToTheme1(){
    if(localStorage.getItem('customColor')){
        localStorage.removeItem('customColor');
    }
    let data = {
        colorClass: "1"
    };
    localStorage.setItem('customColor', JSON.stringify(data));

    page.classList.add('custom1');
    if(page.classList.contains('custom2')){
        page.classList.remove('custom2');
    }
    themechange.style.display = "none";
}

function changeToTheme2(){
    if(localStorage.getItem('customColor')){
        localStorage.removeItem('customColor');
    }
    let data = {
        colorClass: "2"
    };
    localStorage.setItem('customColor', JSON.stringify(data));

    page.classList.add('custom2');
    if(page.classList.contains('custom1')){
        page.classList.remove('custom1');
    }
    themechange.style.display = "none";
}

function changeDefault(){
    if(localStorage.getItem('customColor')){
        localStorage.removeItem('customColor');
    }
    if(page.classList.contains('custom1')){
        page.classList.remove('custom1');
    }
    if(page.classList.contains('custom2')){
        page.classList.remove('custom2');
    }
    themechange.style.display = "none";
}

btn.addEventListener('click', openModal);
window.addEventListener('click', closeModal);

function loadCustomColor(){
    let customColor = JSON.parse(localStorage.getItem('customColor'));
    console.log(customColor);
    if(customColor){
        switch(customColor.colorClass){
            case '1':
                changeToTheme1();
                break;
            case '2':
                changeToTheme2();
                break;
        }
    }
}

