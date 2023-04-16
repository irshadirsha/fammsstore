function changevalidateform(){
    var password=document.Submission.password.value
    var newpassword=document.Submission.newpassword.value
    var confirmpassword=document.Submission.confirmpassword.value
    let pass=document.getElementsByClassName("text-danger")

    const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm
    const newpasswordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm

    if(password==""&&newpassword==""&&confirmpassword==""){
        let i=0
        while(i<pass.length){
            pass[i].innerHTML="Please fill the field"
            i++
        }
        return false
    }
    if(password==""){
        pass[0].innerHTML="The username is empty"
        return false
    }
    if(passwordRegex.test(password)==false){
        pass[0].innerHTML="Enter 1 Capital letter And number minimum 8 letters"
        return false
    }
    if(newpassword==""){
        pass[1].innerHTML="The Newpassword is empty"
        return false
    }
    if(newpasswordRegex.test(newpassword)==false){
        pass[1].innerHTML="Enter 1 Capital letter And number,minimum 8 letters"
        return false
    }
    if(confirmpassword==""){
        pass[2].innerHTML="Confirm Password Is Empty"
        return false
    }
    if(confirmpassword!=newpassword){
        pass[2].innerHTML="The password is Mis Matching"
        return false
    }
    return true
}

function clearForm(){
    let pass=document.getElementsByClassName("text-danger")
    let i=0
    while(i<pass.length){
        pass[i].innerHTML=""
        i++
    }
}