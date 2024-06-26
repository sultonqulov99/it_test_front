// for register input 
function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var toggleIcon = document.querySelector(".toggle-password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.textContent = "🙈"; // Ko'zni yopilgan holatga almashtirish
    } else {
        passwordInput.type = "password";
        toggleIcon.textContent = "👁️"; // Ko'zni ochilgan holatga almashtirish
    }
}
