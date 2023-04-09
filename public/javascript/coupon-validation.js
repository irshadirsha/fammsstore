function couponvalidate() {
    const coupencode = document.submission.coupencode.value;
    const discountvalue = document.submission.discountvalue.value;
    const createdate = document.submission.createdate.value;
    const minpurchese = document.submission.minpurchese.value;
    const expiredate = document.submission.expiredate.value;
    const discounttype = document.submission.discounttype.value;
    // const productpriceRegex = /^-?\d+(\.\d+)?$/
    //const stockRegex = /^-?\d+(\.\d+)?$/
    let productCheck = document.getElementsByClassName('text-danger')

    if (coupencode == '' && discountvalue == '' && createdate == '' &&minpurchese==''&& expiredate == '' && discounttype == '') {

        let i = 0;
        while (i < productCheck.length) {

            productCheck[i].innerHTML = 'This Field Is Empty'
            i++
        }
        return false;
    }

    if (coupencode == '') {
        productCheck[0].innerHTML = 'Please enter coupencode';
        return false;
    }
    if (coupencode.length < 5) {
        productCheck[0].innerHTML = 'Please enter atleast five digits';  
        return false;

    }
    if (discountvalue == '') {
        productCheck[1].innerHTML = 'Please enter discountvalue ';
        return false
    }
    if (discountvalue.length < 3) {
        productCheck[1].innerHTML = 'Please enter atleast five digits';
        return false;
    }
    if (createdate == '') {
        productCheck[2].innerHTML = 'Please select create date ';
        return false
    }
    if (minpurchese == '') {
        productCheck[3].innerHTML = 'Please enter minimum purchese';
        return false
    }
    if (expiredate == '') {
        productCheck[4].innerHTML = 'Please select expiredate';
        return false
    }
    if (discounttype == '') {
        productCheck[5].innerHTML = 'Please Select discounttype'
        return false
    }

}

function couponclearmsg() {

    const productCheck = document.getElementsByClassName('text-danger')
    let i = 0

    while (i < productCheck.length) {
        productCheck[i].innerHTML = ''
        i++
    }

}