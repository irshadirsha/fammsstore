function bannervalidate() {

    const maintitle1 = document.submission.maintitle1.value;
    const maintitle2 = document.submission.maintitle2.value;
    const bannerpicture = document.submission.bannerpicture.value;

    let productCheck = document.getElementsByClassName('text-danger')

    if (maintitle1 == '' && maintitle2 == '' && bannerpicture == '' ) {

        let i = 0;
        while (i < productCheck.length) {

            productCheck[i].innerHTML = 'This Field Is Empty'
            i++
        }
        return false;
    }

    if (maintitle1 == '') {
        productCheck[0].innerHTML = 'Please enter Banner maintitle name.';
        return false;
    }

    if (maintitle1.length < 10) {
        productCheck[0].innerHTML = 'Please enter atleast 10 charecter';
        return false;

    }
    if (maintitle2 == '') {
        productCheck[1].innerHTML = 'Please enter banner subtitle ';
        return false
    }
    if (bannerpicture == '') {
        productCheck[2].innerHTML = 'Please Select Images'
        return false
    }

}

function bannerclearmsg() {

    const productCheck = document.getElementsByClassName('text-danger')
    let i = 0

    while (i < productCheck.length) {
        productCheck[i].innerHTML = ''
        i++
    }

}