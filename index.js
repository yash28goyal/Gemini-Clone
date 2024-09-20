const typeForm = document.querySelector(".search-form");
const chatList = document.querySelector(".chat-list");
const themeToggle = document.querySelector("#theme-changer")
let usrmesg = null;

const API_KEY = "AIzaSyBUBFIcH4Rp5930TyqQ_FAs_cMRBmLy2wM";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const localStorageData = () => {
    const islight_mode = (localStorage.getItem("themeColor") === "light_mode");

    document.body.classList.toggle("light_mode", islight_mode);
    themeToggle.innerText = islight_mode ? "dark_mode" : "light_mode";
}

localStorageData();

const createMessage = (content, ...className) => {
    const div = document.createElement("div");
    div.classList.add("chat", ...className);
    div.innerHTML = content;
    return div;
}

const typingEffect = (text, element) => {
    const word = text.split(' ');
    let currIdx = 0; 
    const typingInterval = setInterval(() => {
        element.innerText += (currIdx === 0 ? '' : ' ') + word[currIdx++];
        
        if(currIdx === word.length) {
            clearInterval(typingInterval);
        }
    }, 75);
}

const generateAPIResponse = async (incomingMessage) => {
    const APIText = incomingMessage.querySelector(".text")
    try {
        const response = await fetch(API_URL, {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({
                contents: [{
                    role : "user",
                    parts : [{text : usrmesg }]
                }]
            })
        });

        const data = await response.json();
        const apiData = data?.candidates[0].content.parts[0].text;  
        // console.log(apiData);
        // APIText.innerText = apiData; 
        typingEffect(apiData, APIText);

    } catch (error) {
        console.log(error);
    } finally {
        incomingMessage.classList.remove("loading-message");
    }
}

const showLoadingAnimation = () => {
    const code = `<div class="chat-content">
                    <img src="./images/favicon.svg" alt="Gemini Image" class="Avatar avatar">
                    <p class="text"></p>
                    <div class="loading">
                        <div class="load-bar"></div>
                        <div class="load-bar"></div>
                        <div class="load-bar"></div>
                    </div>
                </div>
                <span onclick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

    const incomingMessage = createMessage(code, "incoming", "loading-message");
    chatList.appendChild(incomingMessage);

    generateAPIResponse(incomingMessage);
}

const copyMessage = (copyIcon) => {
    const copied_message = copyIcon.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(copied_message);
    copyIcon.innerText = "done";
    setTimeout(() => copyIcon.innerText = "content_copy", 1000);
}

const handelOutgoingChat = () => {
    usrmesg = typeForm.querySelector(".typeInput").value.trim();

    if(!usrmesg) return;
    
    const code = `<div class="chat-content">
                    <img src="./images/user.png" alt="User Image" class="Avatar1 avatar">
                    <p class="text"></p>
                  </div>`;

    const outgoingMessage = createMessage(code, "outgoing");
    outgoingMessage.querySelector(".text").innerText = usrmesg;
    chatList.appendChild(outgoingMessage);

    typeForm.reset();
    setTimeout(showLoadingAnimation, 500);
}

themeToggle.addEventListener("click", () => {
    const islight_mode = document.body.classList.toggle("lightMode");
    localStorage.setItem("themeColor", islight_mode ? "light_mode" : "dark_mode");
    themeToggle.innerText = islight_mode ? "dark_mode" : "light_mode";
})

typeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handelOutgoingChat();
})