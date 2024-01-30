function loginval(){
    var username=document.submission.username.value
    var password=document.submission.password.value

    let pass=document.getElementsByClassName("text-danger")

    const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/gm

    if(username==""&&password==""){
        let i=0
        while(i<pass.length){
            pass[i].innerHTML="Please Fill The Field"
            i++
        }
        return false
    }
    if(username==""){
        pass[0].innerHTML="The Username Is Empty"

        return false
        
    }
    if(username.length<5){
        pass[0].innerHTML="Username Should Contain 5 Letters"
        
        return false
    }
    if(password==""){
        pass[1].innerHTML="Password Is Empty"
        return false
    }
    if(passwordRegex.test(password)==false){
        pass[1].innerHTML="Enter 1 Capital letter,1 number, No need special charecter"
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