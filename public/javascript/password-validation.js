function passwordvald(){
    
    var password=document.submission.password.value
    var confirm_password=document.submission.confirm_password.value

    let pass=document.getElementsByClassName("text-danger ")
    // const phoneRegex= /^\s*(?:\+?(\d{1,3}))?[-. (](\d{3})[-. )](\d{3})[-. ](\d{4})(?: *x(\d+))?\s$/
    
    const passwordRegex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm
    
    if(password==""&&confirm_password==""){
        let i=0
        while(i<pass.length){
            pass[i].innerHTML="Please Fill The Field"
            i++
        }
        return false
    }
   
    if(password==""){
        pass[0].innerHTML="Password Is Empty"
        return false
    }
    if(passwordRegex.test(password)==false){
        pass[0].innerHTML="Enter 1 Capital letter And number,minimum 8 letters"
        return false
    }
    if(confirm_password==""){
        pass[1].innerHTML="Confirm Password is empty"
        return false
    }
    if(confirm_password!=password){
        pass[1].innerHTML="Password is Mismatching"
        return false
    }
    return true
}

    function passclearform(){
        let pass=document.getElementsByClassName("text-danger")
        let i=0
        while(i<pass.length){
            pass[i].innerHTML=""
            i++
        }
    }