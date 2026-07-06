const loginBtn = document.querySelector(".login-btn");
const emailInput = document.querySelector(".login-email");
const passwordInput = document.querySelector(".login-password");

loginBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        const data = await response.json();

        localStorage.setItem("token", data.token);

        window.location.href = "index.html";

    } catch (error) {
        console.error(error);
    }
});