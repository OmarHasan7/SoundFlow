document.addEventListener('DOMContentLoaded', () => {    
    document.querySelector('#input-switch').addEventListener('click', (e) => {
        let x = document.getElementById("light-text");
        if (x.innerHTML === "OFF") {
            x.innerHTML = "ON";
        } else {
            x.innerHTML = "OFF";
        }
        e.target.classList.toggle("lights-on");
    });
});