const checkBox = document.getElementById('toggle');
const logInPage = document.getElementById('log-in');
const signUpPage = document.getElementById('sign-up');


checkBox.addEventListener('change', function(){
  if (this.checked) {
    logInPage.classList.add('passive');
    signUpPage.classList.add('active');
} else {
  logInPage.classList.remove('passive');
  signUpPage.classList.remove('active');
}
});
