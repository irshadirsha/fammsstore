function signupVald(){
    var fullname=document.submission.fullname.value
    var username=document.submission.username.value
    var useremail=document.submission.useremail.value
    var password=document.submission.password.value
    var confirm_password=document.submission.confirm_password.value

    let pass=document.getElementsByClassName("text-danger ")
    // const phoneRegex= /^\s*(?:\+?(\d{1,3}))?[-. (](\d{3})[-. )](\d{3})[-. ](\d{4})(?: *x(\d+))?\s$/
    const fullnameRegex =/^[A-Za-z ]+$/
    const useremailRegex= /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/gm
    const passwordRegex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm
    
    if(fullname==""&&username==""&&useremail==""&&password==""&&confirm_password==""){
        let i=0
        while(i<pass.length){
            pass[i].innerHTML="Please Fill The Field"
            i++
        }
        return false
    }
    if(fullname==""){
        pass[0].innerHTML="The Fullname is empty"
      
        return false
    }
    if(fullname.length<5){
        
        pass[0].innerHTML='FullName should contain 5 letters'
         return false
    }
    if(fullnameRegex.test(fullname)==false){
        pass[0].innerHTML="Only Contain Charecter"
        return false
    }
   
    if(username==""){
        pass[1].innerHTML="The Username is empty"
      
        return false
    }
    if(username.length<5){
        
        pass[1].innerHTML='UserName should contain 5 letters'
         return false
    }
    if(useremail==""){
        pass[2].innerHTML="Email is empty"

        return false
    }
    if(useremailRegex.test(useremail)==false){
        pass[2].innerHTML="Invalid email"
        return false
    }
    if(password==""){
        pass[3].innerHTML="Password is empty"
        return false
    }
    if(passwordRegex.test(password)==false){
        pass[3].innerHTML="Enter 1 Capital letter,1 number, No need special charecter"
        return false
    }
    if(confirm_password==""){
        pass[4].innerHTML="Confirm Password is empty"
        return false
    }
    if(confirm_password!=password){
        pass[4].innerHTML="Password is Mismatching"
        return false
    }
    return true
}

    function clearform(){
        let pass=document.getElementsByClassName("text-danger")
        let i=0
        while(i<pass.length){
            pass[i].innerHTML=""
            i++
        }
    }