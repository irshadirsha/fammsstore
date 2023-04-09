function categoryupvalidate() {
    
    const addcategory = document.submission.addcategory.value;
    
    // const productpriceRegex = /^-?\d+(\.\d+)?$/
    //const stockRegex = /^-?\d+(\.\d+)?$/
    let productCheck = document.getElementsByClassName('text-danger')

    if (addcategory == '') {

        let i = 0;
        while (i < productCheck.length) {

            productCheck[i].innerHTML = 'Please enter Product Category'
            i++
        }
        return false;
    }

   
    if (addcategory == '') {
        productCheck[0].innerHTML = 'Please enter Product Category';
        return false
    }
    

}

function upcategoryclearmsg() {

    const productCheck = document.getElementsByClassName('text-danger')
    let i = 0

    while (i < productCheck.length) {
        productCheck[i].innerHTML = ''
        i++
    }

}