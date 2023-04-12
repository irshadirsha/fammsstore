function profileaddressvalidate() {
    const firstname = document.submission.firstname.value;
    const lastname = document.submission.lastname.value;
    const landmark = document.submission.landmark.value;
    const town = document.submission.town.value;
    const state = document.submission.state.value;
    const pincode = document.submission.pincode.value;
    const phonenumber = document.submission.phonenumber.value;
    const email = document.submission.email.value;
   
    const emailRegex= /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/gm
    const phoneregex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    const pincodeRegex= /^\d{6}$/

    // const productpriceRegex = /^-?\d+(\.\d+)?$/
    //const stockRegex = /^-?\d+(\.\d+)?$/
    let productCheck = document.getElementsByClassName('text-danger')

    if (firstname == '' && lastname == '' && landmark == '' &&town==''&& state == '' && pincode == ''&& phonenumber == '' && email == '') {

        let i = 0;
        while (i < productCheck.length) {

            productCheck[i].innerHTML = 'This Field Is Empty'
            i++
        }
        return false;
    }

    if (firstname == '') {
        productCheck[0].innerHTML = 'Please enter  firstname.';
        return false;
    }

    if (firstname.length < 4) {
        productCheck[0].innerHTML = 'Please enter atleast 4 charecter';
        return false;

    }
    if (lastname == '') {
        productCheck[1].innerHTML = 'Please enter lastname ';
        return false
    }
    if (lastname.length < 3) {
        productCheck[1].innerHTML = 'Please enter atleast 3 charecter';
        return false;

    }
    if (landmark == '') {
        productCheck[2].innerHTML = 'Please enter landmark  ';
        return false
    }
    if(landmark.length < 4) {
        productCheck[2].innerHTML = 'Please enter atleast 3 charecter';
        return false;
    }
    if (town == '') {
        productCheck[3].innerHTML = 'Please enter town  ';
        return false
    }
    if(town.length < 3) {
        productCheck[3].innerHTML = 'Please enter atleast 3 charecter';
        return false;
    }
    if (state == '') {
        productCheck[4].innerHTML = 'Please enter state  ';
        return false
    }
    if(state.length < 3) {
        productCheck[4].innerHTML = 'Please enter atleast 3 charecter';
        return false;
    }
    if (pincode == '') {
        productCheck[5].innerHTML = 'Please enter pincode  ';
        return false
    }
    if(pincodeRegex.test(pincode)==false){
        productCheck[5].innerHTML="Invalid Pincode"
        return false
    }
    if (phonenumber == '') {
        productCheck[6].innerHTML = 'Please enter  phonenumber';
        return false
    }
    if(phoneregex.test(phonenumber)==false){
        productCheck[6].innerHTML="Invalid Phone Number"
        return false
    }
    if (email == '') {
        productCheck[7].innerHTML = 'Please enter  email';
        return false
    }
    if(emailRegex.test(email)==false){
        productCheck[7].innerHTML="Invalid email"
        return false
    }
    return true
}

function addclearmsg() {

    const productCheck = document.getElementsByClassName('text-danger')
    let i = 0

    while (i < productCheck.length) {
        productCheck[i].innerHTML = ''
        i++
    }

}