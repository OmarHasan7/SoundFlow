chrome.storage.sync.get(["playOnpause"], (result) => {
    if(result) {
        let inputSwitch = document.querySelector("#input-switch");
        inputSwitch.checked = result.playOnpause;
        changeText(inputSwitch);
    }
});

window.addEventListener('load', () => {
});
document.addEventListener('DOMContentLoaded', () => {    
    document.querySelector('#input-switch').addEventListener('click', (e) => {
        console.log(e.target.checked)
        changeText(e.target);
        chrome.storage.sync.set({"playOnpause": e.target.checked}, () => {
            chrome.storage.sync.get(["playOnpause"], (result) => console.log(result));
        });
    });
});

function changeText(input) {
    let x = document.getElementById("light-text");
    if (input.checked) {
        x.innerHTML = "ON";
    } else {
        x.innerHTML = "OFF";
    }
}