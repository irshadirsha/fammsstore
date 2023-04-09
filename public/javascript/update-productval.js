function productvalidate() {
    const productname = document.submission.productname.value;
    const stock = document.submission.stock.value;
    const productbrand = document.submission.productbrand.value;
    const productcategory = document.submission.productcategory.value;
    const productprice = document.submission.productprice.value;
    const productimage = document.submission.productimage.value;
    // const productpriceRegex = /^-?\d+(\.\d+)?$/
    //const stockRegex = /^-?\d+(\.\d+)?$/
    let productCheck = document.getElementsByClassName('text-danger')

    if (productname == '' && stock == '' && productid == '' &&productbrand==''&& productprice == '' && productimage == '') {

        let i = 0;
        while (i < productCheck.length) {

            productCheck[i].innerHTML = 'this field is empty'
            i++
        }
        return false;
    }

    if (productname == '') {
        productCheck[0].innerHTML = 'Please enter  Product name.';
        return false;
    }

    if (productname.length < 3) {
        productCheck[0].innerHTML = 'Please enter atleast 3 charecter';
        return false;

    }
    if (stock == '') {
        productCheck[1].innerHTML = 'Please enter Stock ';
        return false
    }
    if (productbrand == '') {
        productCheck[2].innerHTML = 'Please enter Product Brand ';
        return false
    }
    if (productcategory == '') {
        productCheck[3].innerHTML = 'Please enter Product Category';
        return false
    }
    if (productprice == '') {
        productCheck[4].innerHTML = 'Please enter ProductPrice';
        return false
    }
    if (productimage == '') {
        productCheck[5].innerHTML = 'Please Select Images'
        return false
    }

}

function clearmsg() {

    const productCheck = document.getElementsByClassName('text-danger')
    let i = 0

    while (i < productCheck.length) {
        productCheck[i].innerHTML = ''
        i++
    }

}