document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('This is a demo. Login functionality is not implemented.');
        });
    }

    const signupForm = document.querySelector('.signup-form form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('This is a demo. Signup functionality is not implemented.');
        });
    }
});
